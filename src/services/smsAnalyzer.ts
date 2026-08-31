import {
  SMSAnalysisRequest,
  SMSAnalysisResult,
  SMSRedFlag,
  SMSScamCategory,
  SMSVerdict,
} from '../types/sms.types';
import { smsApi } from '../api/smsApi';

interface SMSValidationResult {
  isValid: boolean;
  message?: string;
}

export class SMSAnalyzerService {
  validateSMSInput(messageText: string): SMSValidationResult {
    const trimmed = messageText.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Message content cannot be empty. Please paste an SMS or WhatsApp message.' };
    }
    if (trimmed.length < 5) {
      return { isValid: false, message: 'Message is too short for meaningful scam detection. Enter at least 5 characters.' };
    }
    return { isValid: true };
  }

  async analyzeSMS(request: SMSAnalysisRequest): Promise<SMSAnalysisResult> {
    const validation = this.validateSMSInput(request.messageText);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    try {
      // 1. Call real FastAPI backend API endpoint
      const response = await smsApi.analyzeSMS({
        message_text: request.messageText,
        sender_header: request.senderHeader,
      });

      // Map backend response to SMSAnalysisResult
      const redFlags: SMSRedFlag[] = (response.red_flags || []).map((rf) => ({
        id: rf.id,
        title: rf.title,
        description: rf.description,
        severity: (rf.severity as any) || 'medium',
      }));

      const categoryMap: Record<string, SMSScamCategory> = {
        DIGITAL_ARREST: 'Digital arrest scam',
        UPI_COLLECT_TRAP: 'UPI collect request scam',
        KYC_SCAM: 'KYC scam',
        JOB_SCAM: 'Job scam',
        CASHBACK_LOTTERY: 'Cashback scam',
        REWARD_POINTS_TRAP: 'Fake bank message',
        PHISHING: 'Phishing',
      };

      const scamCategory: SMSScamCategory = categoryMap[response.category] || 'Other';
      const confidencePercentage = Math.round(response.confidence * 100);

      return {
        id: `sms_api_${Date.now()}`,
        timestamp: new Date().toISOString(),
        originalMessage: request.messageText,
        verdict: response.verdict as SMSVerdict,
        riskScore: response.risk_score,
        riskLevel: response.risk_level as any,
        scamCategory,
        confidencePercentage,
        detectedRedFlags: redFlags,
        explanation: response.explanation,
        recommendedActions: response.recommendations,
        rawMetadata: response.details,
      };
    } catch (apiErr: any) {
      // Fallback Heuristic Analysis if offline
      return this.fallbackLocalAnalysis(request.messageText, apiErr.message);
    }
  }

  private fallbackLocalAnalysis(text: string, errNote?: string): SMSAnalysisResult {
    const lower = text.toLowerCase();
    const isScam = lower.includes('pin') || lower.includes('digital arrest') || lower.includes('kyc') || lower.includes('won');
    
    return {
      id: `sms_local_${Date.now()}`,
      timestamp: new Date().toISOString(),
      originalMessage: text,
      verdict: isScam ? 'SCAM' : 'SAFE',
      riskScore: isScam ? 88 : 12,
      riskLevel: isScam ? 'HIGH' : 'LOW',
      scamCategory: isScam ? 'Phishing' : 'Other',
      confidencePercentage: 85,
      detectedRedFlags: isScam
        ? [
            {
              id: 'ind_offline',
              title: 'Offline Heuristic Detection',
              description: errNote || 'Backend offline. Local fallback heuristic identified high-risk keywords.',
              severity: 'high',
            },
          ]
        : [],
      explanation: isScam
        ? 'OFFLINE DETECTED: Message contains high-risk fraud keywords. Always verify link origins.'
        : 'OFFLINE DETECTED: No obvious scam indicators found in text.',
      recommendedActions: [
        'Never share OTP or enter your UPI PIN to receive money.',
      ],
      rawMetadata: { offlineMode: true, note: errNote },
    };
  }
}

export const smsAnalyzer = new SMSAnalyzerService();
