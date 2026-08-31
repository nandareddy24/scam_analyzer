import { apiClient } from '../api/apiClient';
import { ScanResultData, URLAnalysisPayload } from '../types/scam.types';
import { analyzeURLHeuristics } from '../utils/scamDetectorUtils';

export class URLAnalysisService {
  /**
   * Placeholder service for Phishing URL Analysis.
   */
  async analyzeURL(payload: URLAnalysisPayload): Promise<ScanResultData> {
    await apiClient.mockPost('/analyze/url', payload);

    const { score, level, factors } = analyzeURLHeuristics(payload.url);

    let verdictTitle = 'Safe Web Link';
    let summary = 'Target domain uses trusted TLD and valid security protocol.';
    let recommendedAction = 'Always ensure HTTPS lock icon is active before entering credentials.';

    if (level === 'critical' || level === 'high_risk') {
      verdictTitle = 'MALICIOUS PHISHING URL DETECTED';
      summary = 'Domain is impersonating official bank portal to steal netbanking logins and UPI MPIN.';
      recommendedAction = 'DO NOT OPEN OR ENTER DETAILS. Close browser immediately.';
    } else if (level === 'caution') {
      verdictTitle = 'Unverified Web Domain';
      summary = 'Domain exhibits suspicious metrics or uses unencrypted connection.';
      recommendedAction = 'Avoid making payments or submitting sensitive personal info on this page.';
    }

    return {
      id: `scan_url_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'url',
      targetInput: payload.url,
      riskScore: score,
      riskLevel: level,
      verdictTitle,
      summary,
      threatFactors: factors,
      recommendedAction,
      rawDetails: {
        domainAgeDays: 4,
        sslValid: !payload.url.startsWith('http://'),
        modelEndpoint: '/api/v1/ml/phishing-url-classifier',
      },
    };
  }
}

export const urlAnalysisService = new URLAnalysisService();
