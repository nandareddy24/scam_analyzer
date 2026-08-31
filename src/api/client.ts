import { API_CONFIG } from './config';

export interface BackendRedFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BackendAnalysisResponse {
  verdict: string;
  risk_score: number;
  risk_level: string;
  category: string;
  confidence: number;
  red_flags: BackendRedFlag[];
  explanation: string;
  recommendations: string[];
  details?: Record<string, any>;
}

export class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor() {
    self_url: this.baseUrl = API_CONFIG.BASE_URL;
    this.timeoutMs = API_CONFIG.TIMEOUT_MS;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `Server error (${response.status})`;
        try {
          const errJson = await response.json();
          if (errJson.detail) {
            errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
          } else if (errJson.message) {
            errorMsg = errJson.message;
          }
        } catch {
          // Fallback to HTTP error
        }
        throw new Error(errorMsg);
      }

      const json = await response.json();
      return json as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Request timeout: Backend server at ${this.baseUrl} did not respond within ${this.timeoutMs / 1000}s.`);
      }
      if (err.message && err.message.includes('Network request failed')) {
        throw new Error(`Network failure: Unable to connect to FastAPI backend at ${this.baseUrl}. Ensure backend server is running.`);
      }
      throw err;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check server error (${response.status})`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const apiClient = new ApiClient();
