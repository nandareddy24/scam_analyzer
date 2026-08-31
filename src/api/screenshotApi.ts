import { apiClient, BackendAnalysisResponse } from './client';

export interface ScreenshotApiRequest {
  filename?: string;
  image_base64?: string;
}

export const screenshotApi = {
  analyzeScreenshot: async (request: ScreenshotApiRequest): Promise<BackendAnalysisResponse> => {
    return apiClient.post<BackendAnalysisResponse>('/analyze/screenshot', request);
  },
};
