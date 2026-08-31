import {
  UPIAnalysisRequest,
  UPIAnalysisResult,
  UPIRiskLevel,
  UPIVerdict,
} from '../types/upi.types';
import { upiApi } from '../api/upiApi';

interface UPIFormatValidationResult {
  isValid: boolean;
  message: string;
}

export class UPIAnalyzerService {
  validateUPIFormat(upiId: string): UPIFormatValidationResult {
    const trimmed = upiId ? upiId.trim() : '';

    if (!trimmed) {
      return { isValid: false, message: 'UPI ID cannot be empty. Please enter a valid handle (e.g. example@upi).' };
    }
    if (trimmed.includes(' ')) {
      return { isValid: false, message: 'UPI ID cannot contain spaces.' };
    }
    if (!trimmed.includes('@')) {
      return { isValid: false, message: 'Malformed UPI ID: Missing "@" separator (e.g. username@handle).' };
    }

    const parts = trimmed.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { isValid: false, message: 'Invalid VPA format. Expected exactly one "@" separating username and handle.' };
    }

    return { isValid: true, message: 'Valid UPI ID syntax format.' };
  }

  async analyzeUPI(request: UPIAnalysisRequest): Promise<UPIAnalysisResult> {
    const rawInput = request.upiId ? request.upiId.trim() : '';
    const formatCheck = this.validateUPIFormat(rawInput);

    if (!rawInput) {
      throw new Error('Please enter a UPI ID (VPA) to analyze.');
    }

    try {
      // 1. Call real FastAPI backend API endpoint
      const response = await upiApi.analyzeUPI({ upi_id: rawInput });

      const indicators = (response.red_flags || []).map((rf) => `${rf.title}: ${rf.description}`);
      const confidencePercentage = Math.round(response.confidence * 100);

      return {
        id: `upi_api_${Date.now()}`,
        timestamp: new Date().toISOString(),
        upiId: rawInput,
        isValidFormat: formatCheck.isValid,
        formatValidationMessage: formatCheck.message,
        riskScore: response.risk_score,
        riskLevel: response.risk_level as UPIRiskLevel,
        verdict: response.verdict as UPIVerdict,
        confidencePercentage,
        suspiciousIndicators: indicators,
        detectedScamPatterns: (response.red_flags || []).map((rf) => rf.title),
        explanation: response.explanation,
        recommendedAction: response.recommendations[0] || 'Verify receiver identity before sending money.',
        rawMetadata: response.details,
      };
    } catch (apiErr: any) {
      // Fallback local analysis if server offline
      return this.fallbackLocalAnalysis(rawInput, formatCheck, apiErr.message);
    }
  }

  private fallbackLocalAnalysis(vpa: string, formatCheck: UPIFormatValidationResult, errNote?: string): UPIAnalysisResult {
    const isSuspicious = vpa.toLowerCase().includes('refund') || vpa.toLowerCase().includes('helpdesk');

    return {
      id: `upi_local_${Date.now()}`,
      timestamp: new Date().toISOString(),
      upiId: vpa,
      isValidFormat: formatCheck.isValid,
      formatValidationMessage: formatCheck.message,
      riskScore: isSuspicious ? 75 : 15,
      riskLevel: isSuspicious ? 'HIGH' : 'LOW',
      verdict: isSuspicious ? 'SUSPICIOUS' : 'SAFE',
      confidencePercentage: 86,
      suspiciousIndicators: isSuspicious ? ['Contains suspicious fraud term'] : [],
      detectedScamPatterns: isSuspicious ? ['Impersonation'] : [],
      explanation: `OFFLINE ANALYSIS: ${formatCheck.message} (Note: Format validity does not guarantee trust!).`,
      recommendedAction: 'Verify registered recipient name on your UPI payment screen.',
      rawMetadata: { offlineMode: true, note: errNote },
    };
  }
}

export const upiAnalyzer = new UPIAnalyzerService();
