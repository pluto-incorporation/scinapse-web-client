import PlutoAxios from './pluto';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Paper } from '../model/paper';
import { Collection } from '../model/collection';

export interface BasedOnCollectionPapersParams {
  collection: Collection;
  recommendations: Paper[];
}

class RecommendationAPI extends PlutoAxios {
  public async getPapersFromUserAction(): Promise<Paper[]> {
    const res = await this.get(`/recommendations/sample`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }

  public async getPapersFromCollection(): Promise<BasedOnCollectionPapersParams> {
    const res = await this.get(`/collections/recommendations`);
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content[0];
  }

  public async addPaperToRecommendationPool(paperId: number) {
    const res = await this.put(`/recommendations/base`, {
      paper_id: paperId,
    });
    const camelizedRes = camelCaseKeys(res.data);
    return camelizedRes.data.content;
  }
}

const recommendationAPI = new RecommendationAPI();

export default recommendationAPI;
