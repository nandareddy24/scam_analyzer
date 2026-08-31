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
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { RiskIndicator } from '../components/RiskIndicator';
import { useScamAnalyzer } from '../hooks/useScamAnalyzer';
import { useTheme } from '../hooks/useTheme';
import { getCategoryLabel } from '../utils/formatters';

type Props = BottomTabScreenProps<MainTabParamList, 'Analyze'>;

const PRESETS = {
  upi_vpa: [
    { label: 'Fake Refund VPA', value: 'paytm-refund-desk@okaxis' },
    { label: 'Legit Merchant', value: 'merchant.zomato@icici' },
    { label: 'Suspicious Phone VPA', value: '9876543210.lottery@ybl' },
  ],
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
  url: [
    { label: 'Phishing Domain', value: 'http://sbi-reward-points.top/claim' },
    { label: 'Typosquatted Portal', value: 'https://electricity-bill-update-desk.site' },
    { label: 'Official Site', value: 'https://cybercrime.gov.in' },
  ],
  screenshot: [
    { label: 'Sample Fake Paytm Receipt', value: 'fake_paytm_txn_receipt_5000.png' },
    { label: 'Sample Authentic Receipt', value: 'authentic_gpay_receipt_150.jpg' },
  ],
};

export const AnalyzerScreen: React.FC<Props> = ({ route }) => {
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
      <Header
        title="AI Scam Analyzer"
        subtitle="Multi-modal threat detector & heuristic analysis"
      />

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {(['upi_vpa', 'sms', 'url', 'screenshot'] as ScamCategory[]).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBackground,
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.border,
                },
              ]}
              onPress={() => handleTabChange(cat)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={
                  cat === 'upi_vpa'
                    ? 'at-circle-outline'
                    : cat === 'sms'
                    ? 'chatbox-ellipses-outline'
                    : cat === 'url'
                    ? 'link-outline'
                    : 'qr-code-outline'
                }
                size={16}
                color={isActive ? '#0B1120' : theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {cat === 'upi_vpa' ? 'UPI VPA' : cat === 'sms' ? 'SMS' : cat === 'url' ? 'Link' : 'Screenshot'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Input Form */}
      <Card style={styles.formCard}>
        <View style={styles.formHeader}>
          <Ionicons name="shield-search" size={24} color={theme.colors.primary} />
          <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
            {getCategoryLabel(activeCategory)} Inspection
          </Text>
        </View>

        {activeCategory === 'upi_vpa' && (
          <Input
            label="Enter Recipient UPI ID / VPA"
            placeholder="e.g. merchant@upi or refund-desk@okaxis"
            value={inputVal}
            onChangeText={setInputVal}
            iconName="at-outline"
            onClear={() => setInputVal('')}
            error={error}
            helperText="Check handles before scanning QR codes or clicking payment links"
          />
        )}

        {activeCategory === 'sms' && (
          <Input
            label="Paste Suspicious SMS Message Text"
            placeholder="Paste SMS content received on phone..."
            value={inputVal}
            onChangeText={setInputVal}
            iconName="chatbox-text-outline"
            multiline
            numberOfLines={4}
            containerStyle={{ height: 'auto' }}
            onClear={() => setInputVal('')}
            error={error}
            helperText="Detects PIN traps, urgent utility threats, and fake bank rewards"
          />
        )}

        {activeCategory === 'url' && (
          <Input
            label="Paste Web Link / URL"
            placeholder="e.g. http://sbi-reward-points.top/claim"
            value={inputVal}
            onChangeText={setInputVal}
            iconName="globe-outline"
            onClear={() => setInputVal('')}
            error={error}
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
                size={36}
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
                Supports PNG, JPG (Simulated OCR rasterization)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Presets */}
        <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
          TRY SAMPLE TEST CASES:
        </Text>
        <View style={styles.presetsRow}>
          {PRESETS[activeCategory].map((p, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.presetChip, { backgroundColor: `${theme.colors.primary}18` }]}
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

        <Button
          title={isAnalyzing ? 'Running AI Detection Model...' : 'Analyze Threat Level'}
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

                {/* Threat Factors */}
                <Text style={[styles.factorHeader, { color: theme.colors.textPrimary, ...theme.typography.subtitle1 }]}>
                  Detected Risk Indicators ({activeResult.threatFactors.length})
                </Text>

                {activeResult.threatFactors.length === 0 ? (
                  <Text style={{ color: theme.colors.safe, marginVertical: 8 }}>
                    ✓ No anomalous keywords, fraudulent structures, or domain traps detected.
                  </Text>
                ) : (
                  activeResult.threatFactors.map((tf) => (
                    <View key={tf.id} style={[styles.factorItem, { backgroundColor: theme.colors.cardBackground }]}>
                      <View style={styles.factorTop}>
                        <Text style={[styles.factorName, { color: theme.colors.textPrimary }]}>{tf.name}</Text>
                        <Badge
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

                {/* Recommended Action */}
                <View style={[styles.actionBox, { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}40` }]}>
                  <Ionicons name="shield-alert-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.actionTitle, { color: theme.colors.primary }]}>RECOMMENDED SAFETY ACTION</Text>
                    <Text style={[styles.actionText, { color: theme.colors.textPrimary }]}>
                      {activeResult.recommendedAction}
                    </Text>
                  </View>
                </View>

                <Button
                  title="Close Report"
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
    marginHorizontal: 3,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 11,
    marginLeft: 4,
  },
  formCard: {
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    marginLeft: 10,
    fontWeight: '800',
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
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadSub: {
    fontSize: 11,
    marginTop: 4,
  },
  presetHeader: {
    fontWeight: '700',
    letterSpacing: 0.5,
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
    marginRight: 6,
    marginBottom: 6,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
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
