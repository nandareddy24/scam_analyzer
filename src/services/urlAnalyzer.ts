import {
  URLAnalysisRequest,
  URLAnalysisResult,
  URLIndicator,
  URLRiskLevel,
  URLVerdict,
} from '../types/url.types';
import { urlApi } from '../api/urlApi';

export class URLAnalyzerService {
  async analyzeURL(request: URLAnalysisRequest): Promise<URLAnalysisResult> {
    const rawInput = request.url?.trim() || '';

    if (!rawInput) {
      throw new Error('Please enter or paste a web URL to analyze.');
    }

    try {
      // 1. Call real FastAPI backend API endpoint
      const response = await urlApi.analyzeURL({ url: rawInput });

      const indicators: URLIndicator[] = (response.red_flags || []).map((rf) => ({
        id: rf.id,
        title: rf.title,
        description: rf.description,
        severity: (rf.severity as any) || 'medium',
      }));

      const domain = response.details?.domain || rawInput;
      const hasSSL = response.details?.has_ssl ?? rawInput.startsWith('https://');

      return {
        id: `url_api_${Date.now()}`,
        timestamp: new Date().toISOString(),
        url: request.url,
        domain,
        hasSSL,
        isShortened: false,
        subdomainCount: 1,
        tld: '.com',
        riskScore: response.risk_score,
        riskLevel: response.risk_level as URLRiskLevel,
        verdict: response.verdict as URLVerdict,
        confidencePercentage: Math.round(response.confidence * 100),
        detectedIndicators: indicators,
        explanation: response.explanation,
        recommendation: response.recommendations[0] || 'Avoid submitting sensitive passwords on unverified sites.',
        rawMetadata: response.details,
      };
    } catch (apiErr: any) {
      return this.fallbackLocalAnalysis(rawInput, apiErr.message);
    }
  }

  private fallbackLocalAnalysis(url: string, errNote?: string): URLAnalysisResult {
    const isSuspicious = url.toLowerCase().includes('.top') || url.toLowerCase().includes('reward');

    return {
      id: `url_local_${Date.now()}`,
      timestamp: new Date().toISOString(),
      url,
      domain: url,
      hasSSL: url.startsWith('https://'),
      isShortened: false,
      subdomainCount: 1,
      tld: '.top',
      riskScore: isSuspicious ? 80 : 15,
      riskLevel: isSuspicious ? 'HIGH' : 'LOW',
      verdict: isSuspicious ? 'SUSPICIOUS' : 'SAFE',
      confidencePercentage: 85,
      detectedIndicators: isSuspicious
        ? [
            {
              id: 'ind_off_url',
              title: 'High Risk Link (Offline Mode)',
              description: 'URL contains high-risk TLD or fraud keywords.',
              severity: 'high',
            },
          ]
        : [],
      explanation: 'OFFLINE MODE: Treat link analysis as a risk assessment rating, not absolute proof of fraud.',
      recommendation: 'Verify link domain directly before opening.',
      rawMetadata: { offlineMode: true, note: errNote },
    };
  }
}

export const urlAnalyzer = new URLAnalyzerService();
