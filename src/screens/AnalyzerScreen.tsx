import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScamCategory, ScanResultData } from '../types/scam.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { RiskIndicator } from '../components/RiskIndicator';
import { ErrorView } from '../components/ErrorView';
import { useScamAnalyzer } from '../hooks/useScamAnalyzer';
import { useTheme } from '../hooks/useTheme';
import { getCategoryLabel } from '../utils/formatters';

type Props = BottomTabScreenProps<MainTabParamList, 'Analyze'>;

const PRESETS = {
  sms: [
    {
      label: 'PIN Credit Trap',
      value: 'CONGRATS! Rs 25,000 credited to your UPI account. Enter your 6-digit UPI PIN to accept payment immediately.',
    },
    {
      label: 'Reward Points Trap',
      value: 'Dear Customer, your SBI reward points will expire today. Redeem now at http://sbi-rewards.top/claim',
    },
    {
      label: 'Legit OTP',
      value: '123456 is your secret OTP for login to SBI YONO. Do not share with anyone.',
    },
  ],
  upi_vpa: [
    { label: 'Fake Refund VPA', value: 'paytm-refund-desk@okaxis' },
    { label: 'Legit Merchant', value: 'merchant.zomato@icici' },
    { label: 'Suspicious Phone VPA', value: '9876543210.lottery@ybl' },
  ],
  url: [
    { label: 'Phishing Domain', value: 'http://sbi-reward-points.top/claim' },
    { label: 'Typosquatted Portal', value: 'https://electricity-bill-update-desk.site' },
    { label: 'Official Site', value: 'https://cybercrime.gov.in' },
  ],
  screenshot: [
    { label: 'Fake Paytm Receipt', value: 'fake_paytm_txn_receipt_5000.png' },
    { label: 'Authentic GPay Receipt', value: 'authentic_gpay_receipt_150.jpg' },
  ],
};

const MODE_TABS: { key: ScamCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'sms', label: 'SMS / Message', icon: 'chatbox-ellipses-outline' },
  { key: 'upi_vpa', label: 'UPI ID', icon: 'at-circle-outline' },
  { key: 'url', label: 'URL', icon: 'link-outline' },
  { key: 'screenshot', label: 'Screenshot', icon: 'qr-code-outline' },
];

export const AnalyzerScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { isAnalyzing, activeCategory, setActiveCategory, analyze, error, clearError } = useScamAnalyzer();

  const [inputVal, setInputVal] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<ScanResultData | null>(null);

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
    clearError();
  };

  const handleRunAnalysis = async () => {
    const target = activeCategory === 'screenshot' ? (selectedScreenshot || 'sample_qr_proof.png') : inputVal;
    const res = await analyze(activeCategory, target);
    if (res) {
      setActiveResult(res);
    }
  };

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

      {/* Main Analysis Form Card */}
      <Card style={styles.formCard}>
        <View style={styles.formHeader}>
          <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
            <Ionicons
              name={
                activeCategory === 'sms'
                  ? 'chatbox-outline'
                  : activeCategory === 'upi_vpa'
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
              {activeCategory === 'sms'
                ? 'Check for PIN credit lures and fake bank rewards'
                : activeCategory === 'upi_vpa'
                ? 'Check VPA handle against pattern rules & scam database'
                : activeCategory === 'url'
                ? 'Check domain age, SSL status, and typosquatting'
                : 'Extract receipt raster metrics to detect fake app screenshots'}
            </Text>
          </View>
        </View>

        {error && <ErrorView message={error} onRetry={clearError} />}

        {activeCategory === 'sms' && (
          <Input
            label="Paste SMS / Message Text"
            placeholder="Paste SMS content received on phone..."
            value={inputVal}
            onChangeText={setInputVal}
            iconName="chatbox-outline"
            multiline
            numberOfLines={4}
            containerStyle={{ height: 'auto' }}
            onClear={() => setInputVal('')}
            helperText="Detects PIN traps, urgent utility threats, and fake bank rewards"
          />
        )}

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

        {/* Quick Sample Presets */}
        <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
          TEST PRESETS:
        </Text>
        <View style={styles.presetsRow}>
          {PRESETS[activeCategory].map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.presetChip, { backgroundColor: `${theme.colors.primary}18`, borderColor: `${theme.colors.primary}30` }]}
              onPress={() => {
                if (activeCategory === 'screenshot') {
                  setSelectedScreenshot(p.value);
                } else {
                  setInputVal(p.value);
                }
              }}
            >
              <Text style={[styles.presetText, { color: theme.colors.primary }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <PrimaryButton
          title={isAnalyzing ? 'Analyzing Security Indicators...' : 'Run Security Audit'}
          onPress={handleRunAnalysis}
          variant="cyber"
          loading={isAnalyzing}
          style={{ marginTop: 16 }}
          icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
        />
      </Card>

      {/* Analysis Result Modal */}
      <Modal
        visible={!!activeResult}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveResult(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                AI Threat Assessment Report
              </Text>
              <TouchableOpacity onPress={() => setActiveResult(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {activeResult && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <RiskIndicator score={activeResult.riskScore} level={activeResult.riskLevel} />

                <Card variant={activeResult.riskScore > 50 ? 'danger' : 'bordered'} style={{ marginVertical: 12 }}>
                  <Text style={[styles.verdictTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                    {activeResult.verdictTitle}
                  </Text>
                  <Text style={[styles.summaryText, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
                    {activeResult.summary}
                  </Text>
                </Card>

                {/* Threat Factors List */}
                <Text style={[styles.factorHeader, { color: theme.colors.textPrimary, ...theme.typography.subtitle1 }]}>
                  Detected Risk Indicators ({activeResult.threatFactors.length})
                </Text>

                {activeResult.threatFactors.length === 0 ? (
                  <Text style={{ color: theme.colors.safe, marginVertical: 8, fontSize: 13 }}>
                    ✓ No anomalous keywords, fraudulent structures, or domain traps detected.
                  </Text>
                ) : (
                  activeResult.threatFactors.map((tf) => (
                    <View key={tf.id} style={[styles.factorItem, { backgroundColor: theme.colors.cardBackground }]}>
                      <View style={styles.factorTop}>
                        <Text style={[styles.factorName, { color: theme.colors.textPrimary }]}>{tf.name}</Text>
                        <RiskBadge
                          level={tf.severity === 'critical' ? 'critical' : tf.severity === 'high' ? 'high_risk' : 'caution'}
                          customText={tf.severity.toUpperCase()}
                          size="small"
                        />
                      </View>
                      <Text style={[styles.factorDesc, { color: theme.colors.textSecondary }]}>
                        {tf.description}
                      </Text>
                    </View>
                  ))
                )}

                {/* Recommended Guidance */}
                <View style={[styles.actionBox, { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}40` }]}>
                  <Ionicons name="shield-half-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.actionTitle, { color: theme.colors.primary }]}>RECOMMENDED SAFETY ACTION</Text>
                    <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>
                      {activeResult.recommendedAction}
                    </Text>
                  </View>
                </View>

                <PrimaryButton
                  title="Close Assessment"
                  onPress={() => setActiveResult(null)}
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
  presetHeader: {
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
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
  verdictTitle: {
    fontWeight: '800',
    marginBottom: 6,
  },
  summaryText: {
    lineHeight: 18,
  },
  factorHeader: {
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },
  factorItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  factorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factorName: {
    fontWeight: '700',
    fontSize: 13,
  },
  factorDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
