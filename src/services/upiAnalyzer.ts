import {
  UPIAnalysisRequest,
  UPIAnalysisResult,
  UPIRiskLevel,
  UPIVerdict,
} from '../types/upi.types';

const SUSPICIOUS_KEYWORDS = [
  { keyword: 'refund', label: 'Fake Refund Desk Keyword' },
  { keyword: 'cashback', label: 'Cashback Claim Lure' },
  { keyword: 'reward', label: 'Fake Bank Reward Lure' },
  { keyword: 'lottery', label: 'Lottery Prize Keyword' },
  { keyword: 'winner', label: 'Contest Winner Lure' },
  { keyword: 'lucky', label: 'Lucky Draw Fraud' },
  { keyword: 'support', label: 'Customer Support Impersonation' },
  { keyword: 'helpdesk', label: 'Helpdesk Impersonation' },
  { keyword: 'customer-care', label: 'Customer Care Impersonation' },
  { keyword: 'kyc', label: 'KYC Block Threat' },
  { keyword: 'claim', label: 'Unsolicited Claim Keyword' },
  { keyword: 'verify', label: 'Verification Trap' },
];

const KNOWN_SAFE_MERCHANTS = [
  'merchant.zomato@icici',
  'swiggy@hdfcbank',
  'uber@axisbank',
  'bookmyshow@ybl',
  'amazon@apl',
  'flipkart@axisbank',
];

export class UPIAnalyzerService {
  /**
   * Analyzes a UPI ID (Virtual Payment Address / VPA).
   * Strictly separates Format Validation from Risk Assessment.
   * Interface is prepared for seamless handoff to a Python/FastAPI ML backend.
   */
  async analyzeUPI(request: UPIAnalysisRequest): Promise<UPIAnalysisResult> {
    const rawInput = request.upiId?.trim() || '';

    // 1. Basic Local Validation for Empty Input
    if (!rawInput) {
      throw new Error('Please enter a UPI ID (e.g. example@upi) to analyze.');
    }

    // Simulated API / FastAPI backend latency
    await new Promise((resolve) => setTimeout(resolve, 750));

    // 2. Format Validation Checks
    const formatValidation = this.validateUPIFormat(rawInput);

    // 3. Risk Assessment (Runs regardless of format validity)
    const riskAssessment = this.evaluateUPIRisk(rawInput, formatValidation.isValid);

    // 4. Return Normalized Analysis Result
    return {
      id: `upi_audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      upiId: rawInput,
      isValidFormat: formatValidation.isValid,
      formatValidationMessage: formatValidation.message,
      riskScore: riskAssessment.riskScore,
      riskLevel: riskAssessment.riskLevel,
      verdict: riskAssessment.verdict,
      confidencePercentage: riskAssessment.confidencePercentage,
      suspiciousIndicators: riskAssessment.suspiciousIndicators,
      detectedScamPatterns: riskAssessment.detectedScamPatterns,
      explanation: riskAssessment.explanation,
      recommendedAction: riskAssessment.recommendedAction,
      rawMetadata: {
        apiEndpoint: 'mock://services/upiAnalyzer.ts',
        fastApiTarget: 'http://localhost:8000/api/v1/analyze/vpa',
        formatValid: formatValidation.isValid,
      },
    };
  }

  /**
   * Local Format Validation rules
   */
  private validateUPIFormat(vpa: string): { isValid: boolean; message: string } {
    // Check spaces
    if (/\s/.test(vpa)) {
      return { isValid: false, message: 'Invalid Format: UPI IDs cannot contain spaces.' };
    }

    // Check invalid characters (emojis, symbols)
    if (/[#$%^&*()=+[\]{}|\\:;"'<>,?/]/.test(vpa)) {
      return { isValid: false, message: 'Invalid Format: Contains forbidden special characters.' };
    }

    // Check @ separator presence
    const parts = vpa.split('@');
    if (parts.length !== 2) {
      return { isValid: false, message: 'Invalid Format: Must contain exactly one "@" separator (username@handle).' };
    }

    const [username, handle] = parts;

    if (!username || username.trim().length === 0) {
      return { isValid: false, message: 'Malformed VPA: Username section before "@" is empty.' };
    }

    if (!handle || handle.trim().length === 0) {
      return { isValid: false, message: 'Malformed VPA: PSP Handle section after "@" is empty.' };
    }

    return { isValid: true, message: 'Valid UPI VPA Format (username@handle).' };
  }

  /**
   * Risk Assessment Evaluation (Independent of Format Validation)
   */
  private evaluateUPIRisk(vpa: string, isValidFormat: boolean) {
    const lower = vpa.toLowerCase();
    const suspiciousIndicators: string[] = [];
    const detectedScamPatterns: string[] = [];
    let riskScore = 10;
    let verdict: UPIVerdict = 'SAFE';
    let riskLevel: UPIRiskLevel = 'LOW';
    let confidencePercentage = 95;

    // Check format invalidity contribution to risk
    if (!isValidFormat) {
      riskScore += 40;
      suspiciousIndicators.push('Malformed VPA string format.');
      detectedScamPatterns.push('Non-standard UPI ID Syntax');
    }

    // Check Known Safe Merchants
    if (KNOWN_SAFE_MERCHANTS.includes(lower)) {
      return {
        riskScore: 5,
        verdict: 'SAFE' as UPIVerdict,
        riskLevel: 'LOW' as UPIRiskLevel,
        confidencePercentage: 99,
        suspiciousIndicators: [],
        detectedScamPatterns: [],
        explanation: 'This handle matches a verified corporate merchant PSP account with clean transaction history.',
        recommendedAction: 'Safe to proceed with payment. Confirm merchant name on payment authorization screen.',
      };
    }

    // Check Suspicious Keywords in VPA Username or Handle
    SUSPICIOUS_KEYWORDS.forEach((item) => {
      if (lower.includes(item.keyword)) {
        riskScore += 35;
        suspiciousIndicators.push(`VPA handle contains suspicious term "${item.keyword}".`);
        detectedScamPatterns.push(item.label);
      }
    });

    // Check Raw Phone Number Handle
    const [userSection] = lower.split('@');
    if (/^\d{10}$/.test(userSection)) {
      riskScore += 20;
      suspiciousIndicators.push('VPA uses raw phone number handle unlinked to merchant registry.');
      detectedScamPatterns.push('Unverified P2P Phone Handle');
    }

    // Check Long auto-generated string
    if (userSection && userSection.length > 20) {
      riskScore += 15;
      suspiciousIndicators.push('Unusually long username string commonly generated by automated scam scripts.');
      detectedScamPatterns.push('Randomized Scripted Handle');
    }

    // Normalize Score
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Determine Verdict & Risk Level
    if (riskScore >= 75) {
      verdict = 'SCAM';
      riskLevel = 'CRITICAL';
      confidencePercentage = 96;
    } else if (riskScore >= 45) {
      verdict = 'SUSPICIOUS';
      riskLevel = 'HIGH';
      confidencePercentage = 90;
    } else if (riskScore >= 25) {
      verdict = 'SUSPICIOUS';
      riskLevel = 'MEDIUM';
      confidencePercentage = 85;
    } else {
      verdict = 'SAFE';
      riskLevel = 'LOW';
      confidencePercentage = 92;
    }

    // Build Explanation emphasizing that format validity does NOT equal safety!
    const formatNotice = isValidFormat
      ? 'Note: While the UPI ID format is syntactically valid, risk assessment evaluates handle reputational patterns.'
      : 'Warning: The UPI ID format is invalid and contains syntax errors.';

    let explanation = '';
    if (verdict === 'SCAM') {
      explanation = `CRITICAL FRAUD THREAT: High probability of impersonation or fake support desk scam VPA. ${formatNotice}`;
    } else if (verdict === 'SUSPICIOUS') {
      explanation = `SUSPICIOUS HANDLE: Contains terms or structure frequently associated with refund/cashback lures. ${formatNotice}`;
    } else {
      explanation = `No flagged scam terms or suspicious impersonation patterns detected in VPA handle. ${formatNotice}`;
    }

    // Recommended Actions
    const recommendedAction =
      verdict === 'SCAM'
        ? 'DO NOT TRANSFER FUNDS or enter your UPI PIN. Verify official payment details directly on bank portal.'
        : verdict === 'SUSPICIOUS'
        ? 'Exercise caution. Call the beneficiary directly to verify identity before initiating transfer.'
        : 'Proceed with normal verification. Always double-check beneficiary name on payment confirmation screen.';

    return {
      riskScore,
      verdict,
      riskLevel,
      confidencePercentage,
      suspiciousIndicators,
      detectedScamPatterns,
      explanation,
      recommendedAction,
    };
  }
}

export const upiAnalyzer = new UPIAnalyzerService();
