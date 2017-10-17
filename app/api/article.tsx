import { List } from "immutable";
import { AxiosResponse } from "axios";
import PlutoAxios from "./pluto";
import { IArticleRecord, recordifyArticle, IArticle } from "../model/article";
import { ISubmitEvaluationParams } from "../components/articleShow/actions";

export interface IGetArticlesParams {
  size?: number;
  page?: number;
}

interface IGetArticlesResult {
  articles: List<IArticleRecord>;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: string | null;
  totalElements: number;
  totalPages: number;
}

class ArticleAPI extends PlutoAxios {
  public async getArticles({ size = 10, page = 0 }: IGetArticlesParams): Promise<IGetArticlesResult> {
    const articlesResponse: AxiosResponse = await this.get("articles", {
      params: {
        size,
        page,
      },
    });
    const rawArticles: IArticle[] = articlesResponse.data.content;

    const recordifiedArticlesArray = rawArticles.map(article => {
      return recordifyArticle(article);
    });
    return {
      articles: List(recordifiedArticlesArray),
      first: articlesResponse.data.first,
      last: articlesResponse.data.last,
      number: articlesResponse.data.number,
      numberOfElements: articlesResponse.data.numberOfElements,
      size: articlesResponse.data.size,
      sort: articlesResponse.data.sort,
      totalElements: articlesResponse.data.totalElements,
      totalPages: articlesResponse.data.totalPages,
    };
  }

  public async getArticle(articleId: number): Promise<IArticleRecord> {
    const rawArticle = await this.get(`articles/${articleId}`);

    return recordifyArticle(rawArticle.data);
  }

  public async postEvaluation(params: ISubmitEvaluationParams): Promise<void> {
    await this.post(`articles/${params.articleId}/evaluations`, {
      point: {
        analysis: params.analysisScore,
        contribution: params.contributionScore,
        expressiveness: params.expressivenessScore,
        originality: params.originalityScore,
        analysisComment: params.analysisComment,
        contributionComment: params.contributionComment,
        expressivenessComment: params.expressivenessComment,
        originalityComment: params.originalityComment,
      },
    });
  }
}

const apiHelper = new ArticleAPI();

export default apiHelper;
