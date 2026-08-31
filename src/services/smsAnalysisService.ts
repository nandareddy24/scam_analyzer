import { apiClient } from '../api/apiClient';
import { ScanResultData, SMSAnalysisPayload } from '../types/scam.types';
import { analyzeSMSHeuristics } from '../utils/scamDetectorUtils';

export class SMSAnalysisService {
  /**
   * Placeholder service for SMS scam detection.
   * Parses SMS body and sender header (e.g. AD-SBIBNK).
   */
  async analyzeSMS(payload: SMSAnalysisPayload): Promise<ScanResultData> {
    await apiClient.mockPost('/analyze/sms', payload);

    const { score, level, factors } = analyzeSMSHeuristics(payload.messageText);

    let verdictTitle = 'Legitimate SMS Pattern';
    let summary = 'No urgent financial extortion phrases or malicious link traps found.';
    let recommendedAction = 'Standard caution applies. Never share OTP or PIN with anyone.';

    if (level === 'critical') {
      verdictTitle = 'CRITICAL UPI PIN EXTORTION TRAP';
      summary = 'Message lures you to enter UPI PIN to RECEIVE funds. Entering PIN will DEDUCT money!';
      recommendedAction = 'NEVER ENTER YOUR UPI PIN TO RECEIVE MONEY. Block sender immediately and report on 1930.';
    } else if (level === 'high_risk') {
      verdictTitle = 'Phishing Financial SMS Warning';
      summary = 'Contains classic scam triggers (KYC suspension, urgent disconnect, or reward links).';
      recommendedAction = 'Do not click embedded links. Call official bank branch number directly.';
    } else if (level === 'caution') {
      verdictTitle = 'Suspicious Marketing / Unverified SMS';
      summary = 'Message uses promotional urgency tone with unverified short links.';
      recommendedAction = 'Exercise care. Avoid downloading attachments or third-party remote apps.';
    }

    return {
      id: `scan_sms_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'sms',
      targetInput: payload.messageText,
      riskScore: score,
      riskLevel: level,
      verdictTitle,
      summary,
      threatFactors: factors,
      recommendedAction,
      rawDetails: {
        senderHeader: payload.senderHeader || 'UNKNOWN',
        modelEndpoint: '/api/v1/ml/nlp-sms-classifier',
      },
    };
  }
}

export const smsAnalysisService = new SMSAnalysisService();
