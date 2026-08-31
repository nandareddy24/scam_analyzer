export type ScreenshotVerdict = 'GENUINE_PATTERN' | 'SUSPICIOUS_PROOF' | 'MANIPULATED_RECEIPT';

export type ScreenshotRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScreenshotIndicator {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ScreenshotExtractedData {
  transactionAmount: string | null;
  utrReferenceNumber: string | null;
  receiverPayeeName: string | null;
  detectedTimestamp: string | null;
  detectedPaymentApp: string | null; // e.g. "Paytm", "PhonePe", "Google Pay", "BHIM"
}

export interface ScreenshotAnalysisResult {
  id: string;
  timestamp: string;
  imageUri: string;
  extractedData: ScreenshotExtractedData;
  manipulationWarning: boolean;
  manipulationDetails?: string;
  riskScore: number; // 0 - 100
  riskLevel: ScreenshotRiskLevel;
  verdict: ScreenshotVerdict;
  confidencePercentage: number;
  suspiciousIndicators: ScreenshotIndicator[];
  explanation: string;
  disclaimer: string;
  recommendation: string;
  rawMetadata?: Record<string, any>;
}

export interface ScreenshotAnalysisRequest {
  imageUri: string;
  fileSize?: number; // in bytes
  fileType?: string; // e.g. "image/png" | "image/jpeg"
}
