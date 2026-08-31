import { apiClient, BackendAnalysisResponse } from './client';

export interface SMSApiRequest {
  message_text: string;
  sender_header?: string;
}

export const smsApi = {
  analyzeSMS: async (request: SMSApiRequest): Promise<BackendAnalysisResponse> => {
    return apiClient.post<BackendAnalysisResponse>('/analyze/sms', request);
  },
};
