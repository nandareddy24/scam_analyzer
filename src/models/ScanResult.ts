import { RiskLevel, ScamCategory, ScanResultData, ThreatFactor } from '../types/scam.types';

export class ScanResult {
  id: string;
  timestamp: string;
  category: ScamCategory;
  targetInput: string;
  riskScore: number;
  riskLevel: RiskLevel;
  verdictTitle: string;
  summary: string;
  threatFactors: ThreatFactor[];
  recommendedAction: string;
  rawDetails?: Record<string, any>;

  constructor(data: ScanResultData) {
    this.id = data.id;
    this.timestamp = data.timestamp;
    this.category = data.category;
    this.targetInput = data.targetInput;
    this.riskScore = data.riskScore;
    this.riskLevel = data.riskLevel;
    this.verdictTitle = data.verdictTitle;
    this.summary = data.summary;
    this.threatFactors = data.threatFactors;
    this.recommendedAction = data.recommendedAction;
    this.rawDetails = data.rawDetails;
  }

  isHighRisk(): boolean {
    return this.riskLevel === 'high_risk' || this.riskLevel === 'critical';
  }

  isSafe(): boolean {
    return this.riskLevel === 'safe';
  }

  formattedPercentage(): string {
    return `${Math.round(this.riskScore)}%`;
  }
}
