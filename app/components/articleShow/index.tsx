import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as moment from "moment";
import { IAppState } from "../../reducers";
import { ICurrentUserRecord } from "../../model/currentUser";
import Type from "./components/type";
import ArticleInfo from "./components/articleInfo";
import AuthorList from "./components/authorList";
import Abstract from "./components/abstract";
import Article from "./components/article";
import ArticleEvaluate from "./components/evaluate";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "./records";
import * as Actions from "./actions";
import { IArticleRecord, ARTICLE_INITIAL_STATE } from "../../model/article";
import EvaluateSummary from "./components/summary";
import ArticleNote from "./components/note";

const styles = require("./articleShow.scss");

interface IArticlePageParams {
  articleId?: number;
}

interface IArticleShowProps extends RouteComponentProps<IArticlePageParams>, DispatchProp<any> {
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  article: IArticleRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUser: state.currentUser,
    articleShow: state.articleShow,
    article: state.article,
  };
}

@withRouter
class ArticleShow extends React.PureComponent<IArticleShowProps, {}> {
  private handleSubmitEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { dispatch, article, articleShow } = this.props;

    dispatch(
      Actions.submitEvaluation({
        articleId: article.id,
        originalityScore: articleShow.myOriginalityScore,
        originalityComment: articleShow.myOriginalityComment,
        contributionScore: articleShow.myContributionScore,
        contributionComment: articleShow.myContributionComment,
        analysisScore: articleShow.myAnalysisScore,
        analysisComment: articleShow.myAnalysisComment,
        expressivenessScore: articleShow.myExpressivenessScore,
        expressivenessComment: articleShow.myExpressivenessComment,
      }),
    );
  };

  private handleTogglePeerEvaluation = (peerEvaluationId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.togglePeerEvaluationComponent(peerEvaluationId));
  };

  private handleEvaluationTabChange = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleEvaluationTab());
  };

  private handleClickStepButton = (step: ARTICLE_EVALUATION_STEP) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationStep(step));
  };

  private goToNextStep = () => {
    const { dispatch, articleShow } = this.props;

    if (articleShow.currentStep !== ARTICLE_EVALUATION_STEP.FOURTH) {
      dispatch(Actions.changeEvaluationStep(articleShow.currentStep + 1));
    }
  };

  private handleClickScore = (step: ARTICLE_EVALUATION_STEP, score: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationScore(step, score));
  };

  private handleEvaluationChange = (step: ARTICLE_EVALUATION_STEP, comment: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEvaluationComment(step, comment));
  };

  private handlePeerEvaluationCommentSubmit = (params: Actions.IHandlePeerEvaluationCommentSubmitParams) => {
    const { dispatch } = this.props;
    const { comment, evaluationId } = params;

    dispatch(
      Actions.handlePeerEvaluationCommentSubmit({
        comment,
        evaluationId,
      }),
    );
  };

  public componentDidMount() {
    const { match, dispatch } = this.props;
    const { articleId } = match.params;

    if (match.params.articleId) {
      dispatch(Actions.getArticle(articleId));
    }
  }

  public render() {
    const { article, articleShow, currentUser } = this.props;
    if (articleShow.isLoading || article === ARTICLE_INITIAL_STATE) {
      return <div>Loading... </div>;
    } else {
      const { type, summary, authors, createdAt, createdBy, link, source, title, note } = article;

      return (
        <div className={styles.articleShowContainer}>
          <div className={styles.articleContentContainer}>
            <Type tag={type} />
            <div className={styles.title}>{title}</div>
            <ArticleInfo from={source} createdAt={moment(createdAt).format("ll")} createdBy={createdBy} />
            <AuthorList authors={authors} />
            <Abstract content={summary} />
            <ArticleNote note={note} />
            <Article link={link} />
            <ArticleEvaluate
              currentUser={currentUser}
              articleShow={articleShow}
              article={article}
              handleClickScore={this.handleClickScore}
              handleEvaluationTabChange={this.handleEvaluationTabChange}
              handleClickStepButton={this.handleClickStepButton}
              handleEvaluationChange={this.handleEvaluationChange}
              goToNextStep={this.goToNextStep}
              handleSubmitEvaluation={this.handleSubmitEvaluation}
              handleTogglePeerEvaluation={this.handleTogglePeerEvaluation}
              handlePeerEvaluationCommentSubmit={this.handlePeerEvaluationCommentSubmit}
            />
          </div>
          <div className={styles.evauluationSummaryContainer}>
            <EvaluateSummary article={article} />
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(ArticleShow);
