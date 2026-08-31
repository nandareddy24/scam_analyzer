export type URLVerdict = 'SAFE' | 'SUSPICIOUS' | 'PHISHING_SCAM';

export type URLRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface URLIndicator {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface URLAnalysisResult {
  id: string;
  timestamp: string;
  url: string;
  domain: string;
  hasSSL: boolean;
  isShortened: boolean;
  subdomainCount: number;
  tld: string;
  riskScore: number; // 0 - 100
  riskLevel: URLRiskLevel;
  verdict: URLVerdict;
  confidencePercentage: number;
  detectedIndicators: URLIndicator[];
  explanation: string;
  recommendation: string;
  rawMetadata?: Record<string, any>;
}

export interface URLAnalysisRequest {
  url: string;
}
