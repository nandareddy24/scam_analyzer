import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { RiskBadge } from './RiskBadge';
import { PrimaryButton } from './PrimaryButton';

export interface ThreatSignal {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalysisResultData {
  id: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'CRITICAL' | 'PHISHING_SCAM' | 'MANIPULATED_RECEIPT' | 'GENUINE_PATTERN';
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  confidencePercentage: number;
  explanation: string;
  redFlags: ThreatSignal[];
  recommendedActions: string[];
  extractedMetrics?: Record<string, any>;
  disclaimer?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  result: AnalysisResultData | null;
}

export const AnalysisResultModal: React.FC<Props> = ({ visible, onClose, result }) => {
  const theme = useTheme();
  const [isWhyFlaggedExpanded, setIsWhyFlaggedExpanded] = useState(true);

  if (!result) return null;

  // Standardize Verdict visual state
  const rawVerdict = result.verdict.toUpperCase();
  let normalizedState: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'CRITICAL' = 'SAFE';

  if (rawVerdict.includes('CRITICAL') || result.riskScore >= 85) {
    normalizedState = 'CRITICAL';
  } else if (rawVerdict.includes('SCAM') || rawVerdict.includes('MANIPULATED') || result.riskScore >= 65) {
    normalizedState = 'SCAM';
  } else if (rawVerdict.includes('SUSPICIOUS') || result.riskScore >= 35) {
    normalizedState = 'SUSPICIOUS';
  } else {
    normalizedState = 'SAFE';
  }

  // Theme styling based on visual state
  const stateTheme = {
    SAFE: {
      color: theme.colors.safe,
      background: 'rgba(16, 185, 129, 0.12)',
      border: theme.colors.safe,
      icon: 'shield-checkmark' as keyof typeof Ionicons.glyphMap,
      title: 'VERDICT: SAFE',
    },
    SUSPICIOUS: {
      color: theme.colors.caution,
      background: 'rgba(245, 158, 11, 0.12)',
      border: theme.colors.caution,
      icon: 'warning' as keyof typeof Ionicons.glyphMap,
      title: 'VERDICT: SUSPICIOUS',
    },
    SCAM: {
      color: theme.colors.danger,
      background: 'rgba(239, 68, 68, 0.12)',
      border: theme.colors.danger,
      icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
      title: 'VERDICT: SCAM THREAT',
    },
    CRITICAL: {
      color: '#DC2626',
      background: 'rgba(220, 38, 38, 0.20)',
      border: '#DC2626',
      icon: 'nuclear' as keyof typeof Ionicons.glyphMap,
      title: 'VERDICT: CRITICAL FRAUD',
    },
  }[normalizedState];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.modalCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
          {/* Modal Top Header Bar */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitleText, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                AI Threat Assessment Report
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Top Verdict Banner */}
            <View
              style={[
                styles.verdictBanner,
                { backgroundColor: stateTheme.background, borderColor: stateTheme.border },
              ]}
            >
              <View style={styles.verdictLeft}>
                <Ionicons name={stateTheme.icon} size={28} color={stateTheme.color} style={{ marginRight: 10 }} />
                <View>
                  <Text style={[styles.verdictTitle, { color: stateTheme.color }]}>{stateTheme.title}</Text>
                  <Text style={[styles.categorySubtitle, { color: theme.colors.textPrimary }]}>
                    Category: {result.category}
                  </Text>
                </View>
              </View>

              <View style={[styles.confidenceBadge, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Text style={[styles.confidenceText, { color: theme.colors.primary }]}>
                  {result.confidencePercentage}% Confidence
                </Text>
              </View>
            </View>

            {/* Large Circular Risk Score Gauge */}
            <View style={[styles.scoreGaugeBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
              <View style={[styles.circleOuter, { borderColor: stateTheme.color }]}>
                <View style={styles.circleInner}>
                  <Text style={[styles.scoreNumber, { color: stateTheme.color }]}>{result.riskScore}</Text>
                  <Text style={[styles.scoreMaxText, { color: theme.colors.textMuted }]}>/ 100</Text>
                </View>
              </View>

              <View style={styles.gaugeMetaRow}>
                <View style={styles.gaugeMetaItem}>
                  <Text style={[styles.gaugeMetaLabel, { color: theme.colors.textMuted }]}>Threat Level</Text>
                  <RiskBadge
                    level={
                      result.riskLevel === 'CRITICAL'
                        ? 'critical'
                        : result.riskLevel === 'HIGH'
                        ? 'high_risk'
                        : result.riskLevel === 'MEDIUM'
                        ? 'caution'
                        : 'safe'
                    }
                    customText={result.riskLevel}
                  />
                </View>
                <View style={styles.gaugeMetaItem}>
                  <Text style={[styles.gaugeMetaLabel, { color: theme.colors.textMuted }]}>Category</Text>
                  <Text style={[styles.gaugeMetaVal, { color: theme.colors.primary }]}>{result.category}</Text>
                </View>
              </View>
            </View>

            {/* Extracted Metrics Grid (if available) */}
            {result.extractedMetrics && Object.keys(result.extractedMetrics).length > 0 && (
              <View style={[styles.metricsGridCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
                <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
                  Extracted Analysis Details
                </Text>
                {Object.entries(result.extractedMetrics).map(([key, val], idx) => (
                  <View key={idx} style={styles.metricRow}>
                    <Text style={[styles.metricKey, { color: theme.colors.textSecondary }]}>{key}</Text>
                    <Text style={[styles.metricVal, { color: theme.colors.textPrimary }]}>{String(val)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* AI Analysis Explanation */}
            <View style={[styles.explanationCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
                AI Risk Explanation
              </Text>
              <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                {result.explanation}
              </Text>
            </View>

            {/* Expandable "Why was this flagged?" Section */}
            <View style={[styles.expandableSection, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
              <TouchableOpacity
                style={styles.expandableHeader}
                onPress={() => setIsWhyFlaggedExpanded(!isWhyFlaggedExpanded)}
                activeOpacity={0.8}
              >
                <View style={styles.expandableHeaderLeft}>
                  <Ionicons name="finger-print-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary, marginBottom: 0 }]}>
                    Why was this flagged? ({result.redFlags.length} Signals)
                  </Text>
                </View>
                <Ionicons
                  name={isWhyFlaggedExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>

              {isWhyFlaggedExpanded && (
                <View style={styles.signalsContainer}>
                  {result.redFlags.length === 0 ? (
                    <View style={styles.noSignalsRow}>
                      <Ionicons name="checkmark-circle" size={18} color={theme.colors.safe} style={{ marginRight: 6 }} />
                      <Text style={[styles.noSignalsText, { color: theme.colors.safe }]}>
                        No high-risk threat signals or malicious patterns detected.
                      </Text>
                    </View>
                  ) : (
                    result.redFlags.map((signal) => (
                      <View key={signal.id} style={[styles.signalCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
                        <View style={styles.signalTopRow}>
                          <Ionicons name="checkmark-done" size={16} color={stateTheme.color} style={{ marginRight: 6 }} />
                          <Text style={[styles.signalTitle, { color: theme.colors.textPrimary }]}>{signal.title}</Text>
                          <RiskBadge
                            level={
                              signal.severity === 'critical'
                                ? 'critical'
                                : signal.severity === 'high'
                                ? 'high_risk'
                                : 'caution'
                            }
                            customText={signal.severity.toUpperCase()}
                            size="small"
                          />
                        </View>
                        <Text style={[styles.signalDesc, { color: theme.colors.textSecondary }]}>
                          {signal.description}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </View>

            {/* "Recommended next steps" Section */}
            <View style={[styles.recommendationsCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
              <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
                Recommended Next Steps
              </Text>
              {normalizedState !== 'SAFE' && (
                <View style={styles.scamMandatoryStepsBox}>
                  <View style={styles.stepItemRow}>
                    <Text style={styles.stepBullet}>🛑</Text>
                    <Text style={[styles.stepItemText, { color: theme.colors.danger, fontWeight: '800' }]}>
                      Do not send money or approve collect requests.
                    </Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <Text style={styles.stepBullet}>🔒</Text>
                    <Text style={[styles.stepItemText, { color: theme.colors.danger, fontWeight: '800' }]}>
                      Do not share your 6-digit UPI PIN or SMS OTP with anyone.
                    </Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <Text style={styles.stepBullet}>🚫</Text>
                    <Text style={[styles.stepItemText, { color: theme.colors.textPrimary }]}>
                      Block & report sender on WhatsApp/SMS or UPI application.
                    </Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <Text style={styles.stepBullet}>🏦</Text>
                    <Text style={[styles.stepItemText, { color: theme.colors.textPrimary }]}>
                      Contact your bank customer care immediately if money was deducted.
                    </Text>
                  </View>
                  <View style={styles.stepItemRow}>
                    <Text style={styles.stepBullet}>🚨</Text>
                    <Text style={[styles.stepItemText, { color: theme.colors.primary, fontWeight: '700' }]}>
                      Report Cyber Fraud to National Cyber Helpline 1930 or www.cybercrime.gov.in.
                    </Text>
                  </View>
                </View>
              )}

              {result.recommendedActions.map((action, idx) => (
                <View key={idx} style={styles.actionRow}>
                  <Ionicons name="shield-checkmark" size={16} color={theme.colors.safe} style={{ marginRight: 8, marginTop: 2 }} />
                  <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>{action}</Text>
                </View>
              ))}
            </View>

            {/* AI Risk Assessment Disclaimer Banner */}
            <View style={[styles.disclaimerCard, { backgroundColor: 'rgba(245, 158, 11, 0.12)', borderColor: theme.colors.caution }]}>
              <Ionicons name="information-circle" size={20} color={theme.colors.caution} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={[styles.disclaimerText, { color: theme.colors.caution }]}>
                {result.disclaimer ||
                  'AI-assisted risk assessment model. This system provides probability-based threat ratings and is not a guaranteed fraud determination. Always verify transactions independently.'}
              </Text>
            </View>

            <PrimaryButton
              title="Dismiss Assessment Report"
              onPress={onClose}
              variant="secondary"
              style={{ marginTop: 16 }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  verdictLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verdictTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  categorySubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '800',
  },
  scoreGaugeBox: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
  },
  circleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  scoreMaxText: {
    fontSize: 11,
    fontWeight: '600',
  },
  gaugeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  gaugeMetaItem: {
    alignItems: 'center',
  },
  gaugeMetaLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  gaugeMetaVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  metricsGridCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricKey: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  explanationCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  expandableSection: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expandableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalsContainer: {
    marginTop: 12,
  },
  noSignalsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  noSignalsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signalCard: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  signalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  signalTitle: {
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  signalDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  recommendationsCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  scamMandatoryStepsBox: {
    marginBottom: 10,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepBullet: {
    marginRight: 6,
    fontSize: 13,
  },
  stepItemText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  actionText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    flex: 1,
  },
});
