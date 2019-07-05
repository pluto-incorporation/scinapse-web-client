import { CancelToken } from 'axios';
import PlutoAxios from './pluto';
import { PaginationResponseV2, PageObjectV2 } from './types/common';
import { Paper } from '../model/paper';
import { AggregationData } from '../model/aggregation';
import { Suggestion } from '../model/suggestion';
import { BasePaperAuthor } from '../model/author';
import { Affiliation } from '../model/affiliation';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { Author } from '../model/author/author';
import { NewFOS } from '../model/fos';

export interface BaseSearchParams {
  query: string;
  sort: string;
  page?: number;
  cancelToken?: CancelToken;
  yearDetect?: boolean;
}

export interface PaperSearchParams extends BaseSearchParams {
  filter: string;
}

export interface MatchEntityAuthor extends BasePaperAuthor {
  lastKnownAffiliation: Affiliation | null;
  fosList: NewFOS[];
  paperCount: number;
  citationCount: number;
  profileImageUrl: string | null;
  representativePapers: Paper[];
  topPapers: Paper[] | null;
}

export interface MatchAuthor {
  content: MatchEntityAuthor[];
  totalElements: number;
}

export interface SearchResult extends PaginationResponseV2<Paper[]> {
  data: {
    content: Paper[];
    page: PageObjectV2 | null;
    doi: string | null;
    doiPatternMatched: boolean;
    aggregation: AggregationData | null;
    matchedAuthor: MatchAuthor;
    resultModified: boolean;
    suggestion: Suggestion | null;
    topRefAuthors: MatchEntityAuthor[] | null;
    detectedYear: number | null;
  };
}

export interface AuthorSearchResult extends PaginationResponseV2<Author[]> {
  data: {
    content: Author[];
    page: PageObjectV2 | null;
  };
}

class SearchAPI extends PlutoAxios {
  public async search({ query, sort, filter, page = 0, cancelToken, yearDetect }: PaperSearchParams) {
    const res = await this.get('/search', {
      params: {
        q: query,
        sort,
        filter,
        page,
        yd: yearDetect,
      },
      cancelToken,
    });
    const camelizedRes = camelCaseKeys(res.data);
    const searchRes: SearchResult = camelizedRes;

    return {
      ...searchRes,
      data: {
        ...searchRes.data,
        page: {
          ...searchRes.data.page,
          page: searchRes.data.page ? searchRes.data.page.page + 1 : 1,
        },
      },
    };
  }

  public async searchAuthor({ query, sort, page = 0, cancelToken }: BaseSearchParams) {
    const res = await this.get('/search/authors', {
      params: {
        q: query,
        sort,
        page,
      },
      cancelToken,
    });
    const camelizedRes = camelCaseKeys(res.data);
    const searchRes: AuthorSearchResult = camelizedRes;

    return {
      ...searchRes,
      data: {
        ...searchRes.data,
        page: {
          ...searchRes.data.page,
          page: searchRes.data.page ? searchRes.data.page.page + 1 : 1,
        },
      },
    };
  }
}

const searchAPI = new SearchAPI();

export default searchAPI;
