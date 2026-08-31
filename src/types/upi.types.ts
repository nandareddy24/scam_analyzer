export type UPIVerdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM';

export type UPIRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UPIAnalysisResult {
  id: string;
  timestamp: string;
  upiId: string;
  isValidFormat: boolean;
  formatValidationMessage: string;
  riskScore: number; // 0 - 100
  riskLevel: UPIRiskLevel;
  verdict: UPIVerdict;
  confidencePercentage: number;
  suspiciousIndicators: string[];
  detectedScamPatterns: string[];
  explanation: string;
  recommendedAction: string;
  rawMetadata?: Record<string, any>;
}

export interface UPIAnalysisRequest {
  upiId: string;
}
