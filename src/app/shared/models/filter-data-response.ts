import { FilterData } from "./filter-data.model";

export interface FilterDataResponse {
  statusCode: number;
  body: FilterData[]
  input: {
    minEpisodes: string;
    maxEpisodes: string;
    minPrize: string;
    maxPrize: string;
  };
  headers: object;
  total: number;
}
