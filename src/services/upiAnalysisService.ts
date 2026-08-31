import { apiClient } from '../api/apiClient';
import { ScanResultData, UPIAnalysisPayload } from '../types/scam.types';
import { analyzeVPAHeuristics } from '../utils/scamDetectorUtils';

export class UPIAnalysisService {
  /**
   * Placeholder service for UPI VPA analysis.
   * Integrates heuristic checks locally, structured for ML / microservice connection.
   */
  async analyzeVPA(payload: UPIAnalysisPayload): Promise<ScanResultData> {
    // 1. Simulate API payload handoff
    await apiClient.mockPost('/analyze/upi', payload);

    // 2. Perform client-side heuristic inspection
    const { score, level, factors } = analyzeVPAHeuristics(payload.vpa);

    let verdictTitle = 'Safe UPI Address';
    let summary = 'This VPA structure conforms to standard banking PSP handles with no flagged keywords.';
    let recommendedAction = 'Proceed with normal verification. Double check recipient name on payment confirmation screen.';

    if (level === 'high_risk' || level === 'critical') {
      verdictTitle = 'Potential Fraudulent UPI Handle';
      summary = 'High probability of impersonation or fake support desk scam VPA.';
      recommendedAction = 'DO NOT SEND MONEY or enter your UPI PIN. Verify official handle from bank website.';
    } else if (level === 'caution') {
      verdictTitle = 'Unverified UPI Handle';
      summary = 'Contains suspicious terms or phone handle unlinked to merchant registry.';
      recommendedAction = 'Verify beneficiary identity through direct phone call before transferring funds.';
    }

    return {
      id: `scan_upi_${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'upi_vpa',
      targetInput: payload.vpa,
      riskScore: score,
      riskLevel: level,
      verdictTitle,
      summary,
      threatFactors: factors,
      recommendedAction,
      rawDetails: {
        apiStatus: 'placeholder_ready',
        modelEndpoint: '/api/v1/ml/predict-vpa',
      },
    };
  }
}

export const upiAnalysisService = new UPIAnalysisService();
