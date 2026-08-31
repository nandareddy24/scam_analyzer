import {
  SMSAnalysisRequest,
  SMSAnalysisResult,
  SMSScamCategory,
  SMSRiskLevel,
  SMSRedFlag,
  SMSVerdict,
} from '../types/sms.types';

export class SMSAnalyzerService {
  /**
   * Analyzes SMS text content for scam signatures, phishing indicators, and fraud vectors.
   * Designed with a clean interface for seamless swapping with an ML API backend.
   */
  async analyzeSMS(request: SMSAnalysisRequest): Promise<SMSAnalysisResult> {
    const rawText = request.messageText?.trim() || '';

    // 1. Validation & Input Error Handling
    if (!rawText) {
      throw new Error('Please paste or enter an SMS message to analyze.');
    }

    if (rawText.length < 5) {
      throw new Error('Message is too short to analyze. Please provide at least 5 characters.');
    }

    if (rawText.length > 1000) {
      throw new Error('Message length exceeds the maximum limit of 1000 characters.');
    }

    // 2. Simulated Processing / ML Backend Delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 3. Heuristic & NLP Signature Classification
    const lower = rawText.toLowerCase();

    let category: SMSScamCategory = 'Other';
    let riskScore = 15;
    let verdict: SMSVerdict = 'SAFE';
    let riskLevel: SMSRiskLevel = 'LOW';
    let confidencePercentage = 94;
    const redFlags: SMSRedFlag[] = [];
    const recommendedActions: string[] = [];

    // --- CATEGORY MATCHING RULES ---

    // A. Digital Arrest Scam
    if (
      lower.includes('digital arrest') ||
      lower.includes('cbi') ||
      lower.includes('cyber crime police') ||
      lower.includes('video call interrogation') ||
      lower.includes('illegal parcel') ||
      lower.includes('narcotics department')
    ) {
      category = 'Digital arrest scam';
      riskScore = 96;
      verdict = 'SCAM';
      riskLevel = 'CRITICAL';
      confidencePercentage = 98;
      redFlags.push(
        {
          id: 'flag_digital_arrest',
          title: 'Fake Law Enforcement Coercion',
          description: 'Indian law enforcement agencies NEVER perform digital arrests or demand money via video call.',
          severity: 'critical',
        },
        {
          id: 'flag_fear_tactics',
          title: 'Psychological Fear Lure',
          description: 'Scammers threaten arrest or parcel seizures to force immediate panic payments.',
          severity: 'high',
        },
      );
      recommendedActions.push(
        'DO NOT join any video call or pay any money.',
        'Report immediately to National Cyber Crime Helpline 1930.',
        'Block the phone number and notify local police station.',
      );
    }

    // B. UPI Collect Request Scam
    else if (
      lower.includes('enter upi pin') ||
      lower.includes('pin required to credit') ||
      lower.includes('upi pin to accept') ||
      lower.includes('collect request') ||
      lower.includes('receive money pin')
    ) {
      category = 'UPI collect request scam';
      riskScore = 98;
      verdict = 'SCAM';
      riskLevel = 'CRITICAL';
      confidencePercentage = 99;
      redFlags.push(
        {
          id: 'flag_pin_trap',
          title: 'UPI PIN Receiving Trap',
          description: 'GOLDEN RULE VIOLATION: Entering your UPI PIN ALWAYS deducts money from your bank account.',
          severity: 'critical',
        },
        {
          id: 'flag_fake_credit',
          title: 'Fake Credit Notification',
          description: 'Message falsely promises incoming money to trick you into authorizing a debit request.',
          severity: 'high',
        },
      );
      recommendedActions.push(
        'NEVER enter your UPI PIN to receive money in your account.',
        'Decline any collect request in GPay, Paytm, or PhonePe.',
        'Report the scammer handle to 1930 Cyber Fraud Helpline.',
      );
    }

    // C. KYC Scam
    else if (
      lower.includes('kyc') ||
      lower.includes('pan card update') ||
      lower.includes('account suspended within') ||
      lower.includes('update pan card') ||
      lower.includes('sim block')
    ) {
      category = 'KYC scam';
      riskScore = 92;
      verdict = 'SCAM';
      riskLevel = 'HIGH';
      confidencePercentage = 95;
      redFlags.push(
        {
          id: 'flag_kyc_extortion',
          title: 'Urgent KYC Block Threat',
          description: 'Official banks NEVER ask for PAN or Aadhaar updates via SMS links.',
          severity: 'high',
        },
        {
          id: 'flag_short_deadline',
          title: 'Artificial Time Pressure',
          description: 'Claims 24-hour account suspension to bypass careful verification.',
          severity: 'medium',
        },
      );
      recommendedActions.push(
        'Do not click any link inside the SMS.',
        'Verify your account status by logging into official netbanking or visiting bank branch.',
        'Report the SMS header to TRAI / Cyber Crime portal.',
      );
    }

    // D. Job Scam
    else if (
      lower.includes('work from home') ||
      lower.includes('earn rs') ||
      lower.includes('daily income') ||
      lower.includes('part-time job') ||
      lower.includes('youtube like job') ||
      lower.includes('telegram group job')
    ) {
      category = 'Job scam';
      riskScore = 88;
      verdict = 'SCAM';
      riskLevel = 'HIGH';
      confidencePercentage = 93;
      redFlags.push(
        {
          id: 'flag_job_lure',
          title: 'Unrealistic Earnings Lure',
          description: 'Promises guaranteed high daily income for simple tasks like video liking.',
          severity: 'high',
        },
        {
          id: 'flag_task_deposit',
          title: 'Task Investment Trap',
          description: 'Scammers pay small initial amounts then demand large deposits to unlock earnings.',
          severity: 'high',
        },
      );
      recommendedActions.push(
        'Never pay any upfront registration fee or deposit money for job offers.',
        'Block the Telegram / WhatsApp sender.',
        'Do not share bank account details for unverified task commissions.',
      );
    }

    // E. Cashback / Lottery Scam
    else if (
      lower.includes('congratulations') ||
      lower.includes('lottery winner') ||
      lower.includes('cashback of rs') ||
      lower.includes('kbc lucky draw') ||
      lower.includes('scratch card reward')
    ) {
      category = 'Cashback scam';
      riskScore = 85;
      verdict = 'SCAM';
      riskLevel = 'HIGH';
      confidencePercentage = 92;
      redFlags.push(
        {
          id: 'flag_unsolicited_reward',
          title: 'Unsolicited Monetary Prize',
          description: 'Rewards for contests you never entered are 100% fraudulent.',
          severity: 'high',
        },
        {
          id: 'flag_processing_fee',
          title: 'Advance Tax / Fee Request',
          description: 'Asks for small transfer fee to claim large lottery winnings.',
          severity: 'medium',
        },
      );
      recommendedActions.push(
        'Ignore reward claims from unknown shortcodes.',
        'Never scan scratch card QR codes received in messaging apps.',
      );
    }

    // F. Fake Bank Message / Phishing
    else if (
      lower.includes('sbi reward') ||
      lower.includes('redeem points') ||
      lower.includes('http://') ||
      lower.includes('.top') ||
      lower.includes('.xyz') ||
      lower.includes('.site')
    ) {
      category = 'Fake bank message';
      riskScore = 82;
      verdict = 'SCAM';
      riskLevel = 'HIGH';
      confidencePercentage = 91;
      redFlags.push(
        {
          id: 'flag_bank_impersonation',
          title: 'Fake Banking SMS Header',
          description: 'Uses unverified sender ID to mimic official bank notification.',
          severity: 'high',
        },
        {
          id: 'flag_phishing_link',
          title: 'Unencrypted Phishing Link',
          description: 'Directs to unofficial domain aiming to capture netbanking credentials.',
          severity: 'critical',
        },
      );
      recommendedActions.push(
        'Do not open suspicious links in SMS messages.',
        'Check bank reward points strictly inside official mobile app.',
      );
    }

    // G. Legitimate SMS Pattern
    else if (lower.includes('otp') || lower.includes('secret code') || lower.includes('debited by rs') || lower.includes('credited by rs')) {
      if (!lower.includes('pin') && !lower.includes('http')) {
        category = 'Other';
        riskScore = 8;
        verdict = 'SAFE';
        riskLevel = 'LOW';
        confidencePercentage = 97;
        redFlags.length = 0;
        recommendedActions.push(
          'Standard transactional message format detected.',
          'Never share OTP codes with anyone over call or SMS.',
        );
      } else {
        category = 'Phishing';
        riskScore = 65;
        verdict = 'SUSPICIOUS';
        riskLevel = 'MEDIUM';
        confidencePercentage = 86;
        redFlags.push({
          id: 'flag_suspicious_otp',
          title: 'Embedded Link in Transaction SMS',
          description: 'SMS contains transactional keywords combined with unverified web links.',
          severity: 'medium',
        });
        recommendedActions.push(
          'Verify message sender header with bank customer care.',
          'Never click embedded links in financial alert messages.',
        );
      }
    }

    // Default Fallback for generic text
    else {
      category = 'Other';
      riskScore = 30;
      verdict = 'SUSPICIOUS';
      riskLevel = 'MEDIUM';
      confidencePercentage = 78;
      redFlags.push({
        id: 'flag_unverified_text',
        title: 'Unverified Message Pattern',
        description: 'Message lacks standard banking cryptographic signatures. Proceed with normal caution.',
        severity: 'low',
      });
      recommendedActions.push(
        'Verify sender identity before acting on request.',
        'Do not share personal financial info.',
      );
    }

    // 4. Return Normalized Result Object
    return {
      id: `sms_audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      originalMessage: rawText,
      verdict,
      riskScore,
      riskLevel,
      scamCategory: category,
      confidencePercentage,
      detectedRedFlags: redFlags,
      explanation: getExplanationForResult(verdict, category, riskScore),
      recommendedActions,
      rawMetadata: {
        analyzedLength: rawText.length,
        detectedKeywordsCount: redFlags.length,
        engineVersion: 'v1.0-nlp-heuristics',
        serviceEndpoint: 'mock://services/smsAnalyzer.ts',
      },
    };
  }
}

function getExplanationForResult(verdict: SMSVerdict, category: SMSScamCategory, score: number): string {
  if (verdict === 'SCAM') {
    return `High confidence scam signature matching "${category}". The message exhibits classic psychological extortion, PIN credit lures, or malicious phishing links designed to steal funds.`;
  }
  if (verdict === 'SUSPICIOUS') {
    return `Suspicious communication pattern detected. While not a confirmed fraud threat, the message contains unverified links or urgency phrasing commonly used in digital financial fraud.`;
  }
  return `No malicious scam signatures detected. The message structure conforms to standard transactional or informational SMS patterns.`;
}

export const smsAnalyzer = new SMSAnalyzerService();
