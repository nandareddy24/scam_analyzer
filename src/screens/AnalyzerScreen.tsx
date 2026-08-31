import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScamCategory } from '../types/scam.types';
import { SMSAnalysisResult, SMSScamCategory } from '../types/sms.types';
import { UPIAnalysisResult } from '../types/upi.types';
import { URLAnalysisResult } from '../types/url.types';
import { ScreenshotAnalysisResult } from '../types/screenshot.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { Card } from '../components/Card';
import { ErrorView } from '../components/ErrorView';
import { AnalysisResultModal, AnalysisResultData } from '../components/AnalysisResultModal';
import { smsAnalyzer } from '../services/smsAnalyzer';
import { upiAnalyzer } from '../services/upiAnalyzer';
import { urlAnalyzer } from '../services/urlAnalyzer';
import { screenshotAnalyzer } from '../services/screenshotAnalyzer';
import { useTheme } from '../hooks/useTheme';

type Props = BottomTabScreenProps<MainTabParamList, 'Analyze'>;

interface SMSPresetExample {
  category: SMSScamCategory;
  label: string;
  text: string;
}

const SMS_PRESETS: SMSPresetExample[] = [
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
];

const UPI_PRESETS = [
  { label: 'Fake Refund Desk', value: 'paytm-refund-desk@okaxis' },
  { label: 'Legit Merchant', value: 'merchant.zomato@icici' },
  { label: 'Suspicious Phone VPA', value: '9876543210.lottery@ybl' },
  { label: 'Malformed VPA', value: 'invalid-vpa-format-no-at' },
];

const URL_PRESETS = [
  { label: 'Phishing TLD (.top)', value: 'http://sbi-reward-points.top/claim' },
  { label: 'Typosquatted Portal', value: 'https://electricity-bill-update-desk.site' },
  { label: 'Shortened Link', value: 'https://bit.ly/sbi-kyc-update-now' },
  { label: 'Official Portal', value: 'https://cybercrime.gov.in' },
];

const SCREENSHOT_PRESETS = [
  { label: 'Fake Paytm Proof (Manipulated)', value: 'fake_paytm_txn_receipt_5000.png' },
  { label: 'Authentic GPay Receipt', value: 'authentic_gpay_receipt_150.jpg' },
];

const MODE_TABS: { key: ScamCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'sms', label: 'SMS / Message', icon: 'chatbox-ellipses-outline' },
  { key: 'upi_vpa', label: 'UPI ID', icon: 'at-circle-outline' },
  { key: 'url', label: 'URL', icon: 'link-outline' },
  { key: 'screenshot', label: 'Screenshot', icon: 'qr-code-outline' },
];

export const AnalyzerScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const [activeCategory, setActiveCategory] = useState<ScamCategory>('sms');
  const [inputVal, setInputVal] = useState('');

  // Unified Result Modal State
  const [activeResult, setActiveResult] = useState<AnalysisResultData | null>(null);

  // Analyzer Loading & Error States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dedicated Screenshot State
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

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
    setErrorMsg(null);
    setActiveResult(null);
  };

  const handleAnalyzeSMS = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    try {
      const res: SMSAnalysisResult = await smsAnalyzer.analyzeSMS({ messageText: inputVal });
      setActiveResult({
        id: res.id,
        verdict: res.verdict as any,
        riskScore: res.riskScore,
        riskLevel: res.riskLevel as any,
        category: res.scamCategory,
        confidencePercentage: res.confidencePercentage,
        explanation: res.explanation,
        redFlags: res.detectedRedFlags,
        recommendedActions: res.recommendedActions,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze SMS content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeUPI = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    try {
      const res: UPIAnalysisResult = await upiAnalyzer.analyzeUPI({ upiId: inputVal });
      setActiveResult({
        id: res.id,
        verdict: res.verdict as any,
        riskScore: res.riskScore,
        riskLevel: res.riskLevel as any,
        category: 'UPI VPA Handle',
        confidencePercentage: res.confidencePercentage || 92,
        explanation: res.explanation,
        redFlags: res.suspiciousIndicators.map((ind, idx) => ({
          id: `upi_flag_${idx}`,
          title: 'VPA Handle Anomaly',
          description: ind,
          severity: 'high',
        })),
        recommendedActions: [res.recommendedAction],
        extractedMetrics: {
          'Target UPI VPA': res.upiId,
          'Format Syntax Status': res.formatValidationMessage,
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze UPI ID');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeURL = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    try {
      const res: URLAnalysisResult = await urlAnalyzer.analyzeURL({ url: inputVal });
      setActiveResult({
        id: res.id,
        verdict: res.verdict as any,
        riskScore: res.riskScore,
        riskLevel: res.riskLevel as any,
        category: 'Web Link Phishing',
        confidencePercentage: res.confidencePercentage,
        explanation: res.explanation,
        redFlags: res.detectedIndicators,
        recommendedActions: [res.recommendation],
        extractedMetrics: {
          'Analyzed URL': res.url,
          'Domain Host': res.domain,
          'SSL Encryption': res.hasSSL ? '✓ HTTPS Encrypted' : '❌ Unencrypted (HTTP)',
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze URL link');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeScreenshot = async () => {
    setErrorMsg(null);
    setIsAnalyzing(true);
    try {
      const targetUri = selectedScreenshot || 'fake_paytm_txn_receipt_5000.png';
      const res: ScreenshotAnalysisResult = await screenshotAnalyzer.analyzeScreenshot({ imageUri: targetUri });
      setActiveResult({
        id: res.id,
        verdict: res.verdict as any,
        riskScore: res.riskScore,
        riskLevel: res.riskLevel as any,
        category: 'Payment Proof Receipt',
        confidencePercentage: res.confidencePercentage,
        explanation: res.explanation,
        redFlags: res.suspiciousIndicators,
        recommendedActions: [res.recommendation],
        disclaimer: res.disclaimer,
        extractedMetrics: {
          'Amount': res.extractedData.transactionAmount || 'N/A',
          'UTR / Ref #': res.extractedData.utrReferenceNumber || 'N/A',
          'Payee Name': res.extractedData.receiverPayeeName || 'N/A',
          'Payment App': res.extractedData.detectedPaymentApp || 'N/A',
          'Timestamp': res.extractedData.detectedTimestamp || 'N/A',
        },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze payment screenshot');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePickImage = () => {
    Alert.alert(
      'Select Image Source',
      'Choose a payment screenshot to analyze OCR text & font raster metrics.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sample Fake Proof', onPress: () => setSelectedScreenshot('fake_paytm_txn_receipt_5000.png') },
        { text: 'Sample Authentic Proof', onPress: () => setSelectedScreenshot('authentic_gpay_receipt_150.jpg') },
      ],
    );
  };

  const handlePasteURL = () => {
    setInputVal('http://sbi-reward-points.top/claim');
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

      {/* MODE 1: SMS SCAM ANALYZER */}
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

          {errorMsg && <ErrorView message={errorMsg} onRetry={() => setErrorMsg(null)} />}

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

          <View style={styles.charCounterRow}>
            <Text style={[styles.charCounterText, { color: charCount > 900 ? theme.colors.danger : theme.colors.textMuted }]}>
              {charCount} / {maxCharLimit} characters
            </Text>
          </View>

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

          <PrimaryButton
            title={isAnalyzing ? 'Analyzing SMS Content...' : 'Analyze SMS Threat Level'}
            onPress={handleAnalyzeSMS}
            variant="cyber"
            loading={isAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* MODE 2: UPI ID SCAM ANALYZER */}
      {activeCategory === 'upi_vpa' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
              <Ionicons name="at-circle" size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                UPI ID (VPA) Scam Analyzer
              </Text>
              <Text style={[styles.formSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                Evaluates format validity & reputation risk (e.g. example@upi)
              </Text>
            </View>
          </View>

          {errorMsg && <ErrorView message={errorMsg} onRetry={() => setErrorMsg(null)} />}

          <Input
            label="Enter Recipient UPI ID (VPA)"
            placeholder="e.g. example@upi or paytm-refund-desk@okaxis"
            value={inputVal}
            onChangeText={setInputVal}
            iconName="at-outline"
            onClear={() => setInputVal('')}
            helperText="Separates syntax format validation from handle reputational risk assessment"
          />

          <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            TEST UPI PRESETS:
          </Text>
          <View style={styles.presetsRow}>
            {UPI_PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetChip, { backgroundColor: `${theme.colors.primary}18`, borderColor: `${theme.colors.primary}30` }]}
                onPress={() => setInputVal(p.value)}
              >
                <Text style={[styles.presetText, { color: theme.colors.primary }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton
            title={isAnalyzing ? 'Analyzing UPI Handle...' : 'Analyze UPI ID Threat Level'}
            onPress={handleAnalyzeUPI}
            variant="cyber"
            loading={isAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* MODE 3: URL PHISHING ANALYZER */}
      {activeCategory === 'url' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.secondary}1A` }]}>
              <Ionicons name="globe-outline" size={22} color={theme.colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                Phishing Link / URL Analyzer
              </Text>
              <Text style={[styles.formSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                Inspects domain SSL, URL shorteners, subdomains & typosquatting
              </Text>
            </View>
          </View>

          {errorMsg && <ErrorView message={errorMsg} onRetry={() => setErrorMsg(null)} />}

          <View style={styles.inputWithPasteRow}>
            <View style={{ flex: 1 }}>
              <Input
                label="Paste Website URL / Link"
                placeholder="e.g. http://sbi-reward-points.top/claim"
                value={inputVal}
                onChangeText={setInputVal}
                iconName="globe-outline"
                onClear={() => setInputVal('')}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <TouchableOpacity
              style={[styles.pasteBtn, { backgroundColor: `${theme.colors.primary}1A`, borderColor: `${theme.colors.primary}35` }]}
              onPress={handlePasteURL}
              activeOpacity={0.8}
            >
              <Ionicons name="clipboard-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.pasteBtnText, { color: theme.colors.primary }]}>Paste</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.inputHelperText, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
            Safe Inspection: Does NOT automatically open or navigate to submitted link.
          </Text>

          <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption, marginTop: 10 }]}>
            TEST URL PRESETS:
          </Text>
          <View style={styles.presetsRow}>
            {URL_PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetChip, { backgroundColor: `${theme.colors.secondary}18`, borderColor: `${theme.colors.secondary}30` }]}
                onPress={() => setInputVal(p.value)}
              >
                <Text style={[styles.presetText, { color: theme.colors.secondary }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton
            title={isAnalyzing ? 'Analyzing Web Link...' : 'Analyze URL Threat Level'}
            onPress={handleAnalyzeURL}
            variant="cyber"
            loading={isAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* MODE 4: SCREENSHOT SCAM ANALYZER */}
      {activeCategory === 'screenshot' && (
        <Card style={styles.formCard}>
          <View style={styles.formHeader}>
            <View style={[styles.modeIconBox, { backgroundColor: `${theme.colors.accent}1A` }]}>
              <Ionicons name="image-outline" size={22} color={theme.colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.formTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                Screenshot Proof Analyzer
              </Text>
              <Text style={[styles.formSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                OCR text extraction & font metric analysis to detect fake receipts
              </Text>
            </View>
          </View>

          {errorMsg && <ErrorView message={errorMsg} onRetry={() => setErrorMsg(null)} />}

          <View style={styles.uploadArea}>
            {selectedScreenshot ? (
              <View style={[styles.imagePreviewBox, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.primary }]}>
                <View style={styles.imagePreviewHeader}>
                  <Ionicons name="image" size={24} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.imagePreviewTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                      {selectedScreenshot}
                    </Text>
                    <Text style={[styles.imagePreviewSub, { color: theme.colors.textMuted }]}>
                      Ready for OCR raster & font metric analysis
                    </Text>
                  </View>
                </View>

                <View style={styles.imagePreviewActionRow}>
                  <TouchableOpacity
                    style={[styles.imageActionBtn, { backgroundColor: `${theme.colors.primary}18`, borderColor: `${theme.colors.primary}30` }]}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="swap-horizontal" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                    <Text style={[styles.imageActionText, { color: theme.colors.primary }]}>Change Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.imageActionBtn, { backgroundColor: `${theme.colors.danger}18`, borderColor: 'rgba(239, 68, 68, 0.4)' }]}
                    onPress={() => setSelectedScreenshot(null)}
                  >
                    <Ionicons name="trash-outline" size={14} color={theme.colors.danger} style={{ marginRight: 4 }} />
                    <Text style={[styles.imageActionText, { color: theme.colors.danger }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.dropzone,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.background,
                  },
                ]}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={42} color={theme.colors.textMuted} />
                <Text style={[styles.uploadTitle, { color: theme.colors.textPrimary }]}>
                  Select Payment Screenshot from Gallery
                </Text>
                <Text style={[styles.uploadSub, { color: theme.colors.textMuted }]}>
                  Supports PNG, JPG, WEBP (Max size 10MB)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.presetHeader, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            TEST RECEIPT PRESETS:
          </Text>
          <View style={styles.presetsRow}>
            {SCREENSHOT_PRESETS.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.presetChip, { backgroundColor: `${theme.colors.accent}18`, borderColor: `${theme.colors.accent}30` }]}
                onPress={() => setSelectedScreenshot(p.value)}
              >
                <Text style={[styles.presetText, { color: theme.colors.accent }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton
            title={isAnalyzing ? 'Running OCR & Font Analysis...' : 'Analyze Payment Proof'}
            onPress={handleAnalyzeScreenshot}
            variant="cyber"
            loading={isAnalyzing}
            style={{ marginTop: 16 }}
            icon={<Ionicons name="sparkles" size={18} color="#0B1120" />}
          />
        </Card>
      )}

      {/* UNIFIED PROFESSIONAL ANALYSIS RESULT MODAL */}
      <AnalysisResultModal
        visible={!!activeResult}
        onClose={() => setActiveResult(null)}
        result={activeResult}
      />
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
  inputWithPasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pasteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 8,
    marginTop: 18,
  },
  pasteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 4,
  },
  inputHelperText: {
    marginTop: 4,
    marginBottom: 6,
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
    marginTop: 6,
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
  imagePreviewBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePreviewTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  imagePreviewSub: {
    fontSize: 11,
    marginTop: 2,
  },
  imagePreviewActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  imageActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
