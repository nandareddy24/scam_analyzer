import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { MainTabParamList } from '../types/navigation.types';
import { ScamCategory } from '../types/scam.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { SecurityStatusCard } from '../components/SecurityStatusCard';
import { AnalyzerCard } from '../components/AnalyzerCard';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { AnalysisResultModal, AnalysisResultData } from '../components/AnalysisResultModal';
import { scanHistoryStorage, ScanHistoryItem } from '../storage/scanHistory';
import { useTheme } from '../hooks/useTheme';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

interface SafetyTip {
  id: string;
  title: string;
  tip: string;
  iconName: keyof typeof Ionicons.glyphMap;
  badge: string;
}

const SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'tip_1',
    title: 'UPI PIN Golden Rule',
    tip: 'You NEVER enter your UPI PIN to receive money in your bank account.',
    iconName: 'key-outline',
    badge: 'CRITICAL',
  },
  {
    id: 'tip_2',
    title: 'Beneficiary Check',
    tip: 'Always verify recipient name on bank screen before authorizing payment.',
    iconName: 'person-circle-outline',
    badge: 'MUST KNOW',
  },
  {
    id: 'tip_3',
    title: 'Remote App Warning',
    tip: 'Never download AnyDesk or TeamViewer on request of unknown support calls.',
    iconName: 'alert-circle-outline',
    badge: 'WARNING',
  },
];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<AnalysisResultData | null>(null);

  const loadHistoryData = useCallback(async () => {
    try {
      const data = await scanHistoryStorage.getHistory();
      setHistoryItems(data);
    } catch (err) {
      console.warn('Failed to load home scan metrics:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [loadHistoryData]),
  );

  // Calculate REAL Statistics (Zero fake statistics)
  const totalScans = historyItems.length;
  const scamsDetected = historyItems.filter((i) => i.verdict === 'SCAM' || i.verdict === 'CRITICAL').length;
  const suspiciousCount = historyItems.filter((i) => i.verdict === 'SUSPICIOUS').length;
  const safeMessages = historyItems.filter((i) => i.verdict === 'SAFE').length;

  const avgRiskScore = totalScans > 0
    ? Math.round(historyItems.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans)
    : 0;

  // Percentage calculations for chart
  const safePct = totalScans > 0 ? Math.round((safeMessages / totalScans) * 100) : 0;
  const suspiciousPct = totalScans > 0 ? Math.round((suspiciousCount / totalScans) * 100) : 0;
  const scamPct = totalScans > 0 ? Math.round((scamsDetected / totalScans) * 100) : 0;

  const mapHistoryToModalData = (item: ScanHistoryItem): AnalysisResultData => ({
    id: item.id,
    verdict: item.verdict,
    riskScore: item.riskScore,
    riskLevel: item.riskLevel,
    category: item.category,
    confidencePercentage: item.confidencePercentage,
    explanation: item.explanation,
    redFlags: item.redFlags,
    recommendedActions: item.recommendations,
    extractedMetrics: item.extractedMetrics,
  });

  const getTypeIcon = (type: ScamCategory): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'sms':
        return 'chatbox-ellipses-outline';
      case 'upi_vpa':
        return 'at-circle-outline';
      case 'url':
        return 'link-outline';
      case 'screenshot':
        return 'qr-code-outline';
      default:
        return 'shield-checkmark-outline';
    }
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <ScreenWrapper scrollable>
      {/* App Header with Notification & About Project Trigger */}
      <AppHeader
        title="UPI ScamGuard"
        subtitle="Stay Safe from Digital Scams"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* Project Review Panel Banner */}
      <View style={[styles.projectBadgeBar, { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}30` }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Ionicons name="school" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.projectBadgeText, { color: theme.colors.textPrimary }]}>
            Final Year Capstone Project
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.aboutProjectBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => (navigation.getParent() as any)?.navigate('About')}
        >
          <Text style={styles.aboutProjectBtnText}>About Project</Text>
          <Ionicons name="information-circle-outline" size={14} color="#0B1120" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* 1. Security Protection Status Card */}
      <SecurityStatusCard
        statusText={scamsDetected > 0 ? 'Threats Identified' : 'System Protected'}
        isProtected={scamsDetected === 0}
        lastScanTime={totalScans > 0 ? formatTimestamp(historyItems[0].timestamp) : 'No scans yet'}
        threatsBlockedCount={scamsDetected}
        onScanNowPress={() => navigation.navigate('Analyze', {})}
      />

      {/* 2. REAL Security Statistics Dashboard */}
      <Card style={styles.metricsCard} variant="bordered">
        <Text style={[styles.metricsTitle, { color: theme.colors.textPrimary }]}>
          Security Audit Statistics
        </Text>

        {totalScans === 0 ? (
          <View style={styles.emptyMetricsBox}>
            <Ionicons name="stats-chart-outline" size={36} color={theme.colors.textMuted} />
            <Text style={[styles.emptyMetricsText, { color: theme.colors.textSecondary }]}>
              Start analyzing to build your security statistics.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricTile, { backgroundColor: theme.colors.cardBackground }]}>
                <Text style={[styles.metricNumber, { color: theme.colors.primary }]}>{totalScans}</Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Total Scans</Text>
              </View>

              <View style={[styles.metricTile, { backgroundColor: theme.colors.cardBackground }]}>
                <Text style={[styles.metricNumber, { color: theme.colors.danger }]}>{scamsDetected}</Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Scams Detected</Text>
              </View>

              <View style={[styles.metricTile, { backgroundColor: theme.colors.cardBackground }]}>
                <Text style={[styles.metricNumber, { color: theme.colors.safe }]}>{safeMessages}</Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Safe Messages</Text>
              </View>

              <View style={[styles.metricTile, { backgroundColor: theme.colors.cardBackground }]}>
                <Text style={[styles.metricNumber, { color: avgRiskScore > 50 ? theme.colors.danger : theme.colors.primary }]}>
                  {avgRiskScore}
                </Text>
                <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>Avg Risk Score</Text>
              </View>
            </View>

            {/* Custom Visual Distribution Analytics Chart */}
            <View style={styles.chartContainer}>
              <View style={styles.chartHeaderRow}>
                <Text style={[styles.chartTitle, { color: theme.colors.textSecondary }]}>
                  Threat Distribution Breakdown
                </Text>
                <Text style={[styles.chartLegend, { color: theme.colors.textMuted }]}>
                  {safePct}% Safe | {suspiciousPct}% Suspicious | {scamPct}% Scam
                </Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressSegment, { width: `${safePct}%`, backgroundColor: theme.colors.safe }]} />
                <View style={[styles.progressSegment, { width: `${suspiciousPct}%`, backgroundColor: theme.colors.caution }]} />
                <View style={[styles.progressSegment, { width: `${scamPct}%`, backgroundColor: theme.colors.danger }]} />
              </View>

              <View style={styles.chartLegendRow}>
                <View style={styles.legendDotRow}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.safe }]} />
                  <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Safe ({safeMessages})</Text>
                </View>
                <View style={styles.legendDotRow}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.caution }]} />
                  <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Suspicious ({suspiciousCount})</Text>
                </View>
                <View style={styles.legendDotRow}>
                  <View style={[styles.legendDot, { backgroundColor: theme.colors.danger }]} />
                  <Text style={[styles.legendText, { color: theme.colors.textMuted }]}>Scams ({scamsDetected})</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </Card>

      {/* Emergency Report / Get Help Module Trigger */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => (navigation.getParent() as any)?.navigate('ReportHelp')}
      >
        <Card style={[styles.emergencyBanner, { backgroundColor: 'rgba(239, 68, 68, 0.16)', borderColor: theme.colors.danger }]}>
          <View style={styles.emergencyBannerLeft}>
            <View style={[styles.emergencyBadgeBox, { backgroundColor: theme.colors.danger }]}>
              <Ionicons name="shield-half-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.emergencyBannerTitle, { color: theme.colors.textPrimary }]}>
                Report Fraud / Get Emergency Help
              </Text>
              <Text style={[styles.emergencyBannerSub, { color: theme.colors.textSecondary }]}>
                1930 Helpline, Bank Numbers, Cyber Crime Portal & Recovery Plan
              </Text>
            </View>
          </View>

          <View style={[styles.emergencyBannerActionBtn, { backgroundColor: theme.colors.danger }]}>
            <Text style={styles.emergencyBannerActionText}>Get Help</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
          </View>
        </Card>
      </TouchableOpacity>

      {/* 3. Quick Analyzer Section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="flash-outline" size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
        <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Quick Threat Analyzer
        </Text>
      </View>

      <View style={styles.analyzerGrid}>
        <AnalyzerCard
          mode="sms"
          title="Analyze SMS"
          subtitle="Detect PIN traps & lures"
          iconName="chatbox-ellipses-outline"
          onPress={() => navigation.navigate('Analyze', { initialCategory: 'sms' })}
        />
        <AnalyzerCard
          mode="upi_vpa"
          title="Check UPI ID"
          subtitle="Verify VPA handle reputation"
          iconName="at-circle-outline"
          onPress={() => navigation.navigate('Analyze', { initialCategory: 'upi_vpa' })}
        />
        <AnalyzerCard
          mode="url"
          title="Check URL"
          subtitle="Inspect phishing links"
          iconName="link-outline"
          onPress={() => navigation.navigate('Analyze', { initialCategory: 'url' })}
        />
        <AnalyzerCard
          mode="screenshot"
          title="Analyze Screenshot"
          subtitle="Inspect payment receipts"
          iconName="qr-code-outline"
          onPress={() => navigation.navigate('Analyze', { initialCategory: 'screenshot' })}
        />
      </View>

      {/* 4. Recent Activity Section */}
      <View style={styles.recentRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time-outline" size={18} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
            Recent Threat Assessments
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary, ...theme.typography.caption }]}>
            View All History →
          </Text>
        </TouchableOpacity>
      </View>

      {historyItems.length === 0 ? (
        <Card style={styles.emptyCard} variant="bordered">
          <Text style={[{ color: theme.colors.textSecondary, textAlign: 'center' }, theme.typography.body2]}>
            No scans performed yet. Select an analyzer above to begin audit.
          </Text>
        </Card>
      ) : (
        historyItems.slice(0, 3).map((item) => (
          <TouchableOpacity key={item.id} activeOpacity={0.85} onPress={() => setActiveModalItem(mapHistoryToModalData(item))}>
            <Card style={styles.historyCardItem} variant="bordered">
              <View style={styles.historyItemHeader}>
                <View style={styles.historyTypeRow}>
                  <View style={[styles.typeIconSmallBox, { backgroundColor: `${theme.colors.primary}18` }]}>
                    <Ionicons name={getTypeIcon(item.type)} size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.historyCategoryText, { color: theme.colors.textPrimary }]}>
                    {item.category}
                  </Text>
                </View>
                <RiskBadge
                  level={
                    item.riskLevel === 'CRITICAL'
                      ? 'critical'
                      : item.riskLevel === 'HIGH'
                      ? 'high_risk'
                      : item.riskLevel === 'MEDIUM'
                      ? 'caution'
                      : 'safe'
                  }
                  customText={`${item.verdict} (${item.riskScore}/100)`}
                  size="small"
                />
              </View>

              <Text style={[styles.historySummaryText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {item.inputSummary}
              </Text>

              <View style={styles.historyCardItemFooter}>
                <Text style={[styles.historyTimestampText, { color: theme.colors.textMuted }]}>
                  {formatTimestamp(item.timestamp)}
                </Text>
                <Text style={[styles.tapInspectText, { color: theme.colors.primary }]}>Tap to Inspect →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      )}

      {/* 5. Safety Tips Section */}
      <View style={styles.sectionHeader}>
        <Ionicons name="bulb-outline" size={18} color={theme.colors.caution} style={{ marginRight: 6 }} />
        <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Essential Security Guidelines
        </Text>
      </View>

      {SAFETY_TIPS.map((tip) => (
        <Card key={tip.id} style={styles.tipCard} variant="bordered">
          <View style={styles.tipHeader}>
            <View style={[styles.tipIconBox, { backgroundColor: `${theme.colors.primary}18` }]}>
              <Ionicons name={tip.iconName} size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.tipTitleRow}>
                <Text style={[styles.tipTitle, { color: theme.colors.textPrimary }]}>{tip.title}</Text>
                <View style={[styles.tipBadge, { backgroundColor: `${theme.colors.caution}20` }]}>
                  <Text style={[styles.tipBadgeText, { color: theme.colors.caution }]}>{tip.badge}</Text>
                </View>
              </View>
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{tip.tip}</Text>
            </View>
          </View>
        </Card>
      ))}

      {/* Detailed Analysis Result Modal */}
      <AnalysisResultModal
        visible={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        result={activeModalItem}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  projectBadgeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  projectBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  aboutProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  aboutProjectBtnText: {
    color: '#0B1120',
    fontSize: 10,
    fontWeight: '900',
  },
  metricsCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
  },
  emptyMetricsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyMetricsText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricTile: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  chartContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  chartLegend: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressBarTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressSegment: {
    height: '100%',
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  legendDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
  },
  emergencyBanner: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emergencyBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  emergencyBadgeBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emergencyBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  emergencyBannerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  emergencyBannerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emergencyBannerActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitleText: {
    fontWeight: '800',
  },
  analyzerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
  },
  seeAllText: {
    fontWeight: '700',
  },
  emptyCard: {
    padding: 16,
    marginBottom: 14,
  },
  historyCardItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconSmallBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  historyCategoryText: {
    fontSize: 12,
    fontWeight: '800',
  },
  historySummaryText: {
    fontSize: 11,
    marginBottom: 8,
  },
  historyCardItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 6,
  },
  historyTimestampText: {
    fontSize: 10,
  },
  tapInspectText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tipCard: {
    marginBottom: 10,
    padding: 14,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  tipBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tipBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tipText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
});
