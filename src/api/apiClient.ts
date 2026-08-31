import { APP_CONFIG } from '../constants/config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.upiscamguard.internal/v1') {
    this.baseUrl = baseUrl;
  }

  /**
   * Simulated API request wrapper for academic placeholder architecture
   */
  async mockPost<T>(endpoint: string, payload: any, customDelayMs?: number): Promise<ApiResponse<T>> {
    const delay = customDelayMs ?? APP_CONFIG.defaultSimulatedDelayMs;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: payload,
          timestamp: new Date().toISOString(),
        });
      }, delay);
    });
  }
}

export const apiClient = new ApiClient();
