import { apiClient, BackendAnalysisResponse } from './client';

export interface UPIApiRequest {
  upi_id: string;
}

export const upiApi = {
  analyzeUPI: async (request: UPIApiRequest): Promise<BackendAnalysisResponse> => {
    return apiClient.post<BackendAnalysisResponse>('/analyze/upi', request);
  },
};
