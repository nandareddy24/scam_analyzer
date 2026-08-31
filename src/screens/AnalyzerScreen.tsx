import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScamCategory, ScanResultData } from '../types/scam.types';
import { SMSAnalysisResult, SMSScamCategory } from '../types/sms.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { RiskIndicator } from '../components/RiskIndicator';
import { LoadingView } from '../components/LoadingView';
import { ErrorView } from '../components/ErrorView';
import { smsAnalyzer } from '../services/smsAnalyzer';
import { useScamAnalyzer } from '../hooks/useScamAnalyzer';
import { useTheme } from '../hooks/useTheme';
import { getCategoryLabel } from '../utils/formatters';

type Props = BottomTabScreenProps<MainTabParamList, 'Analyze'>;

interface PresetExample {
  category: SMSScamCategory;
  label: string;
  text: string;
}

const SMS_PRESETS: PresetExample[] = [
  {
    category: 'Digital arrest scam',
    label: 'Digital Arrest Scam',
    text: 'URGENT NOTICE: CBI & Cyber Police have issued a Digital Arrest Warrant against your Aadhaar for illegal narcotics parcel. Join video call immediately or police force will reach your home.',
  },
  {
    category: 'UPI collect request scam',
    label: 'UPI PIN Trap Scam',
    text: 'CONGRATS! Rs 25,000 credited to your GPay account. Enter your 6-digit UPI PIN to accept payment immediately.',
  },
  {
    category: 'KYC scam',
    label: 'KYC Suspension Scam',
    text: 'Dear customer, your SBI bank account will be blocked within 24 hours due to pending KYC. Update PAN card immediately at http://sbi-kyc-verify.top',
  },
  {
    category: 'Job scam',
    label: 'Part-Time Job Scam',
    text: 'Work from home job offer! Earn Rs 5,000 per day by simply liking YouTube videos. No experience required. Join Telegram: t.me/work_earn_daily',
  },
  {
    category: 'Cashback scam',
    label: 'Cashback / Lottery Scam',
    text: 'Congratulations! You won KBC Lucky Draw prize of Rs 25 Lakhs. Contact Manager Ramesh Sharma on WhatsApp 9876543210 to claim prize.',
  },
  {
    category: 'Fake bank message',
    label: 'Fake Bank Points',
    text: 'Dear Customer, your 8,500 SBI Reward Points worth Rs 4,250 expire today. Redeem now to your account at http://sbi-rewards-points.site',
  },
];

const MODE_TABS: { key: ScamCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'sms', label: 'SMS / Message', icon: 'chatbox-ellipses-outline' },
  { key: 'upi_vpa', label: 'UPI ID', icon: 'at-circle-outline' },
  { key: 'url', label: 'URL', icon: 'link-outline' },
  { key: 'screenshot', label: 'Screenshot', icon: 'qr-code-outline' },
];

export const AnalyzerScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { isAnalyzing: isGeneralAnalyzing, activeCategory, setActiveCategory, analyze, error: generalError, clearError: clearGeneralError } = useScamAnalyzer();

  const [inputVal, setInputVal] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Dedicated SMS Scam Analyzer States
  const [isSMSAnalyzing, setIsSMSAnalyzing] = useState(false);
  const [smsResult, setSMSResult] = useState<SMSAnalysisResult | null>(null);
  const [smsError, setSMSError] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.initialCategory) {
      setActiveCategory(route.params.initialCategory);
    }
    if (route.params?.initialInput) {
      setInputVal(route.params.initialInput);
    }
  }, [route.params]);

  const handleTabChange = (cat: ScamCategory) => {
    setActiveCategory(cat);
    setInputVal('');
    setSelectedScreenshot(null);
    setSMSError(null);
    clearGeneralError();
  };

  const handleAnalyzeSMS = async () => {
    setSMSError(null);
    setIsSMSAnalyzing(true);

    try {
      const result = await smsAnalyzer.analyzeSMS({ messageText: inputVal });
      setSMSResult(result);
    } catch (err: any) {
      setSMSError(err.message || 'Failed to analyze SMS message');
    } finally {
      setIsSMSAnalyzing(false);
    }
  };

  const handleGeneralAnalysis = async () => {
    if (activeCategory === 'sms') {
      await handleAnalyzeSMS();
      return;
    }
    const target = activeCategory === 'screenshot' ? (selectedScreenshot || 'sample_qr_proof.png') : inputVal;
    await analyze(activeCategory, target);
  };

  const charCount = inputVal.length;
  const maxCharLimit = 1000;

  return (
    <ScreenWrapper scrollable>
      {/* App Header */}
      <AppHeader
        title="AI Scam Analyzer"
        subtitle="Multi-modal threat detector & heuristic analysis"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* 4 Mode Selector Tabs */}
      <View style={styles.tabContainer}>
        {MODE_TABS.map((tab) => {
          const isActive = activeCategory === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBackground,
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.cardBorder,
                },
              ]}
              onPress={() => handleTabChange(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={isActive ? '#0B1120' : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '800' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SMS SCAM ANALYZER MODE */}
      {activeCategory === 'sms' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.caution}1A` }]}>
              <Ionicons name="chatbox-ellipses" size={22} color={theme.colors.caution} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                SMS & WhatsApp Scam Analyzer
              </Text>
              <Text style={[styles.formSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                Detects Digital Arrest, KYC traps, Job scams, and UPI PIN lures
              </Text>
            </View>
          </View>

          {smsError && (
            <ErrorView message={smsError} onRetry={() => setSMSError(null)} />
          )}

          {/* Large Text Area Input */}
          <Input
            label="Paste suspicious SMS or WhatsApp message"
            placeholder="Paste SMS or WhatsApp content received on phone..."
            value={inputVal}
            onChangeText={(txt) => {
              if (txt.length <= maxCharLimit) setInputVal(txt);
            }}
            iconName="chatbox-outline"
            multiline
            numberOfLines={5}
            containerStyle={{ height: 'auto' }}
            onClear={() => setInputVal('')}
          />

          {/* Character Counter */}
          <View style={styles.charCounterRow}>
            <Text style={[styles.charCounterText, { color: charCount > 900 ? theme.colors.danger : theme.colors.textMuted }]}>
              {charCount} / {maxCharLimit} characters
            </Text>
          </View>

          {/* Example Scam Messages Presets */}
          <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            EXAMPLE SCAM MESSAGES (TAP TO TEST):
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {SMS_PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
                onPress={() => setInputVal(p.text)}
                activeOpacity={0.8}
              >
                <View style={styles.presetCategoryPill}>
                  <Text style={[styles.presetCategoryText, { color: theme.colors.primary }]}>{p.label}</Text>
                </View>
                <Text style={[styles.presetPreviewText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {p.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Analyze SMS Button */}
          <PrimaryButton
            title={isSMSAnalyzing ? 'Analyzing SMS Content...' : 'Analyze SMS Threat Level'}
            onPress={handleAnalyzeSMS}
            variant="cyber"
            loading={isSMSAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* OTHER SCAM ANALYZER MODES (UPI ID, URL, SCREENSHOT) */}
      {activeCategory !== 'sms' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
              <Ionicons
                name={
                  activeCategory === 'upi_vpa'
                    ? 'at-outline'
                    : activeCategory === 'url'
                    ? 'globe-outline'
                    : 'image-outline'
                }
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                {getCategoryLabel(activeCategory)} Scanner
              </Text>
              <Text style={[styles.formSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                {activeCategory === 'upi_vpa'
                  ? 'Check VPA handle against pattern rules & scam database'
                  : activeCategory === 'url'
                  ? 'Check domain age, SSL status, and typosquatting'
                  : 'Extract receipt raster metrics to detect fake app screenshots'}
              </Text>
            </View>
          </View>

          {generalError && <ErrorView message={generalError} onRetry={clearGeneralError} />}

          {activeCategory === 'upi_vpa' && (
            <Input
              label="Enter UPI ID / VPA Handle"
              placeholder="e.g. paytm-refund-desk@okaxis or merchant@icici"
              value={inputVal}
              onChangeText={setInputVal}
              iconName="at-outline"
              onClear={() => setInputVal('')}
              helperText="Check handles before confirming payment collect requests"
            />
          )}

          {activeCategory === 'url' && (
            <Input
              label="Paste Website URL / Link"
              placeholder="e.g. http://sbi-reward-points.top/claim"
              value={inputVal}
              onChangeText={setInputVal}
              iconName="globe-outline"
              onClear={() => setInputVal('')}
              helperText="Inspects domain SSL, typosquatting, and malicious top-level domains"
            />
          )}

          {activeCategory === 'screenshot' && (
            <View style={styles.uploadArea}>
              <TouchableOpacity
                style={[
                  styles.dropzone,
                  {
                    borderColor: selectedScreenshot ? theme.colors.primary : theme.colors.border,
                    backgroundColor: selectedScreenshot ? `${theme.colors.primary}10` : theme.colors.background,
                  },
                ]}
                onPress={() => setSelectedScreenshot('fake_paytm_txn_receipt_5000.png')}
              >
                <Ionicons
                  name={selectedScreenshot ? 'document-attach' : 'cloud-upload-outline'}
                  size={40}
                  color={selectedScreenshot ? theme.colors.primary : theme.colors.textMuted}
                />
                <Text
                  style={[
                    styles.uploadTitle,
                    { color: selectedScreenshot ? theme.colors.primary : theme.colors.textPrimary },
                  ]}
                >
                  {selectedScreenshot ? selectedScreenshot : 'Select / Drag Payment Proof Screenshot'}
                </Text>
                <Text style={[styles.uploadSub, { color: theme.colors.textMuted }]}>
                  Supports PNG, JPG (Simulated OCR font metric inspection)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <PrimaryButton
            title={isGeneralAnalyzing ? 'Analyzing Security Indicators...' : 'Run Security Audit'}
            onPress={handleGeneralAnalysis}
            variant="cyber"
            loading={isGeneralAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* SMS RESULT MODAL / CARD */}
      <Modal
        visible={!!smsResult}
        animationType="slide"
        transparent
        onRequestClose={() => setSMSResult(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                SMS Scam Analysis Assessment
              </Text>
              <TouchableOpacity onPress={() => setSMSResult(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {smsResult && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* 1. Verdict Banner & Risk Score */}
                <View
                  style={[
                    styles.verdictBanner,
                    {
                      backgroundColor:
                        smsResult.verdict === 'SCAM'
                          ? 'rgba(220, 38, 38, 0.18)'
                          : smsResult.verdict === 'SUSPICIOUS'
                          ? 'rgba(245, 158, 11, 0.18)'
                          : 'rgba(16, 185, 129, 0.18)',
                      borderColor:
                        smsResult.verdict === 'SCAM'
                          ? theme.colors.danger
                          : smsResult.verdict === 'SUSPICIOUS'
                          ? theme.colors.caution
                          : theme.colors.safe,
                    },
                  ]}
                >
                  <View style={styles.verdictLeft}>
                    <Text style={styles.verdictLabelText}>VERDICT</Text>
                    <Text
                      style={[
                        styles.verdictValueText,
                        {
                          color:
                            smsResult.verdict === 'SCAM'
                              ? theme.colors.danger
                              : smsResult.verdict === 'SUSPICIOUS'
                              ? theme.colors.caution
                              : theme.colors.safe,
                        },
                      ]}
                    >
                      {smsResult.verdict}
                    </Text>
                  </View>

                  <View style={styles.confidencePill}>
                    <Ionicons name="analytics" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                    <Text style={[styles.confidenceText, { color: theme.colors.primary }]}>
                      {smsResult.confidencePercentage}% AI Confidence
                    </Text>
                  </View>
                </View>

                {/* 2. Risk Meter Gauge */}
                <RiskIndicator
                  score={smsResult.riskScore}
                  level={
                    smsResult.riskLevel === 'CRITICAL'
                      ? 'critical'
                      : smsResult.riskLevel === 'HIGH'
                      ? 'high_risk'
                      : smsResult.riskLevel === 'MEDIUM'
                      ? 'caution'
                      : 'safe'
                  }
                />

                {/* 3. Scam Category & Risk Level Badges */}
                <Card variant="bordered" style={styles.metaBadgeCard}>
                  <View style={styles.metaRow}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>Scam Category</Text>
                    <View style={[styles.categoryBadgePill, { backgroundColor: `${theme.colors.primary}20` }]}>
                      <Text style={[styles.categoryBadgeText, { color: theme.colors.primary }]}>
                        {smsResult.scamCategory}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.metaRow}>
                    <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>Severity Level</Text>
                    <RiskBadge
                      level={
                        smsResult.riskLevel === 'CRITICAL'
                          ? 'critical'
                          : smsResult.riskLevel === 'HIGH'
                          ? 'high_risk'
                          : smsResult.riskLevel === 'MEDIUM'
                          ? 'caution'
                          : 'safe'
                      }
                      customText={smsResult.riskLevel}
                      size="small"
                    />
                  </View>
                </Card>

                {/* 4. Explanation */}
                <Card variant="bordered" style={{ marginBottom: 12 }}>
                  <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>
                    AI Analysis Summary
                  </Text>
                  <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                    {smsResult.explanation}
                  </Text>
                </Card>

                {/* 5. Detected Red Flags */}
                <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary, marginBottom: 8 }]}>
                  Detected Red Flags ({smsResult.detectedRedFlags.length})
                </Text>

                {smsResult.detectedRedFlags.length === 0 ? (
                  <Text style={{ color: theme.colors.safe, marginBottom: 12, fontSize: 13 }}>
                    ✓ No anomalous keywords, PIN extortion lures, or phishing links detected.
                  </Text>
                ) : (
                  smsResult.detectedRedFlags.map((flag) => (
                    <View key={flag.id} style={[styles.flagItem, { backgroundColor: theme.colors.cardBackground }]}>
                      <View style={styles.flagTop}>
                        <Ionicons name="alert-circle" size={16} color={theme.colors.danger} style={{ marginRight: 6 }} />
                        <Text style={[styles.flagTitle, { color: theme.colors.textPrimary }]}>{flag.title}</Text>
                        <RiskBadge
                          level={flag.severity === 'critical' ? 'critical' : flag.severity === 'high' ? 'high_risk' : 'caution'}
                          customText={flag.severity.toUpperCase()}
                          size="small"
                        />
                      </View>
                      <Text style={[styles.flagDesc, { color: theme.colors.textSecondary }]}>
                        {flag.description}
                      </Text>
                    </View>
                  ))
                )}

                {/* 6. Recommended Actions */}
                <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary, marginTop: 8, marginBottom: 8 }]}>
                  Recommended Guidance
                </Text>
                <View style={[styles.actionListBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
                  {smsResult.recommendedActions.map((action, idx) => (
                    <View key={idx} style={styles.actionItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color={theme.colors.safe} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[styles.actionItemText, { color: theme.colors.textPrimary }]}>{action}</Text>
                    </View>
                  ))}
                </View>

                <PrimaryButton
                  title="Close SMS Assessment"
                  onPress={() => setSMSResult(null)}
                  variant="secondary"
                  style={{ marginTop: 16 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 10,
    marginLeft: 3,
  },
  formCard: {
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  formTitle: {
    fontWeight: '800',
  },
  formSub: {
    marginTop: 1,
  },
  charCounterRow: {
    alignItems: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
  },
  charCounterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  presetHeader: {
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  presetScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  presetCard: {
    width: 220,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 10,
  },
  presetCategoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    marginBottom: 6,
  },
  presetCategoryText: {
    fontSize: 10,
    fontWeight: '800',
  },
  presetPreviewText: {
    fontSize: 11,
    lineHeight: 16,
  },
  uploadArea: {
    marginBottom: 16,
  },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadSub: {
    fontSize: 11,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  verdictBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  verdictLeft: {
    flex: 1,
  },
  verdictLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  verdictValueText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '800',
  },
  metaBadgeCard: {
    marginBottom: 12,
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metaLabel: {
    fontSize: 13,
  },
  categoryBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 6,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  flagItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  flagTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flagTitle: {
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
    marginRight: 6,
  },
  flagDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionListBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  actionItemText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
