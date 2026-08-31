export type ScamCategory = 'upi_vpa' | 'sms' | 'url' | 'screenshot';

export type RiskLevel = 'safe' | 'caution' | 'high_risk' | 'critical' | 'scanning';

export interface ThreatFactor {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface ScanResultData {
  id: string;
  timestamp: string;
  category: ScamCategory;
  targetInput: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictTitle: string;
  summary: string;
  threatFactors: ThreatFactor[];
  recommendedAction: string;
  rawDetails?: Record<string, any>;
}

export interface UPIAnalysisPayload {
  vpa: string;
}

export interface SMSAnalysisPayload {
  messageText: string;
  senderHeader?: string;
}

export interface URLAnalysisPayload {
  url: string;
}

export interface ScreenshotAnalysisPayload {
  imageUri: string;
}

export interface SafetyGuideItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  detailedSteps: string[];
  riskPattern: string;
  iconName: string;
}
