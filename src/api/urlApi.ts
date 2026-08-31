import { apiClient, BackendAnalysisResponse } from './client';

export interface URLApiRequest {
  url: string;
}

export const urlApi = {
  analyzeURL: async (request: URLApiRequest): Promise<BackendAnalysisResponse> => {
    return apiClient.post<BackendAnalysisResponse>('/analyze/url', request);
  },
};
