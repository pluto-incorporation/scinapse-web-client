import * as React from 'react';
import { Dispatch } from 'redux';
import { findIndex, unionBy } from 'lodash';
import { Survey, RawQuestion } from '../constants';
import { withStyles } from '../../../../../../helpers/withStylesHelper';
const styles = require('./question.scss');

interface QuestionProps {
  question: Survey;
  qKey: number;
  dispatch: Dispatch<any>;
  surveyResult: RawQuestion[];
  handleChangeAnswer: (value: React.SetStateAction<RawQuestion[]>) => void;
}

interface AnswerProps {
  value: string;
  name: string;
  type: string;
  handleChangeAnswer: () => void;
}

function changeSurveyAnswer(
  survey: RawQuestion,
  type: string,
  surveyResult: RawQuestion[],
  changeSurveyAnswer: (value: React.SetStateAction<RawQuestion[]>) => void
) {
  const targetSurveyIndex = findIndex(surveyResult, ['question', survey.question]);

  if (targetSurveyIndex >= 0) {
    const targetSurvey = surveyResult[targetSurveyIndex];

    if (type === 'checkbox') {
      const targetAnswerIndex = findIndex(targetSurvey.checked, survey.checked[0]);
      const newSurveyResult = [
        ...surveyResult.slice(0, targetSurveyIndex),
        {
          ...targetSurvey,
          checked:
            targetAnswerIndex >= 0
              ? [
                  ...targetSurvey.checked.slice(0, targetAnswerIndex),
                  ...targetSurvey.checked.slice(targetAnswerIndex + 1, targetSurvey.checked.length),
                ]
              : unionBy(targetSurvey.checked, survey.checked, 'name'),
        },
        ...surveyResult.slice(targetSurveyIndex + 1, surveyResult.length),
      ];

      return changeSurveyAnswer(newSurveyResult);
    } else {
      const newSurveyResult = [
        ...surveyResult.slice(0, targetSurveyIndex),
        survey,
        ...surveyResult.slice(targetSurveyIndex + 1, surveyResult.length),
      ];
      return changeSurveyAnswer(newSurveyResult);
    }
  }
  return changeSurveyAnswer([survey, ...surveyResult]);
}

const Answer: React.FC<AnswerProps> = props => {
  const { value, name, type, handleChangeAnswer } = props;
  return (
    <div className={styles.answerWrapper}>
      <label onChange={handleChangeAnswer}>
        <input type={type} name={name} value={value} className={styles.answerRadioBtn} />
        <span className={styles.answerDesc}>{value}</span>
      </label>
    </div>
  );
};

const Question: React.FC<QuestionProps> = props => {
  const { question, qKey, surveyResult, handleChangeAnswer } = props;

  const answers = question.answers.map((answer, index) => {
    const surveyPayload: RawQuestion = {
      surveyName: question.surveyName,
      question: question.question,
      random: question.random,
      checked: [
        {
          name: answer,
          order: index,
        },
      ],
    };

    return (
      <Answer
        value={answer}
        name={`q_${qKey}`}
        key={`q_${qKey}-a_${index}`}
        type={question.type}
        handleChangeAnswer={() => {
          changeSurveyAnswer(surveyPayload, question.type, surveyResult, handleChangeAnswer);
        }}
      />
    );
  });

  return (
    <div className={styles.questionContainer}>
      <div className={styles.title}>{question.question}</div>
      <div className={styles.answersWrapper}>{answers}</div>
    </div>
  );
};

export default withStyles<typeof styles>(styles)(Question);
