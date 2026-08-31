export type SMSVerdict = 'SAFE' | 'SUSPICIOUS' | 'SCAM';

export type SMSRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SMSScamCategory =
  | 'KYC scam'
  | 'Cashback scam'
  | 'Lottery scam'
  | 'Job scam'
  | 'Digital arrest scam'
  | 'Phishing'
  | 'Fake bank message'
  | 'UPI collect request scam'
  | 'Impersonation'
  | 'Other';

export interface SMSRedFlag {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SMSAnalysisResult {
  id: string;
  timestamp: string;
  originalMessage: string;
  verdict: SMSVerdict;
  riskScore: number; // 0 - 100
  riskLevel: SMSRiskLevel;
  scamCategory: SMSScamCategory;
  confidencePercentage: number; // 0 - 100
  detectedRedFlags: SMSRedFlag[];
  explanation: string;
  recommendedActions: string[];
  rawMetadata?: Record<string, any>;
}

export interface SMSAnalysisRequest {
  messageText: string;
  senderHeader?: string;
}
