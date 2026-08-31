import React, { useState } from 'react';
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
import { MainTabParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../hooks/useTheme';
import { APP_CONFIG } from '../constants/config';

type Props = BottomTabScreenProps<MainTabParamList, 'Safety'>;

interface ScamPattern {
  id: string;
  title: string;
  category: string;
  iconName: keyof typeof Ionicons.glyphMap;
  goldenRule: string;
  explanation: string;
}

const FRAUD_PATTERNS: ScamPattern[] = [
  {
    id: 'pattern_1',
    title: 'The UPI PIN "Receive Money" Trap',
    category: 'Collect Request Fraud',
    iconName: 'key-outline',
    goldenRule: 'UPI PIN is ONLY required to DEDUCT money from your bank account!',
    explanation:
      'Fraudsters send a collect request or money request with text like "Receiving Rs 10,000". When you enter your UPI MPIN, money is instantly transferred OUT of your bank account to the scammer.',
  },
  {
    id: 'pattern_2',
    title: 'Fake Payment Receipt Generators',
    category: 'Merchant & Seller Fraud',
    iconName: 'image-outline',
    goldenRule: 'Always verify bank statement balance inside your official banking app!',
    explanation:
      'Scammers use fake payment screenshot generator apps (FakePay, Spoof Paytm) to show realistic "Payment Successful" screens without actually transferring funds.',
  },
  {
    id: 'pattern_3',
    title: 'Remote Screen Sharing Apps',
    category: 'Technical Support Scam',
    iconName: 'phone-portrait-outline',
    goldenRule: 'NEVER install AnyDesk, TeamViewer, or QuickSupport on request of strangers!',
    explanation:
      'Fraudsters pose as bank customer care or electricity board agents and ask you to install remote access apps. Once granted access, they view your bank OTPs in real time.',
  },
  {
    id: 'pattern_4',
    title: 'QR Code "Scan to Receive" Trap',
    category: 'Marketplace Fraud (OLX/FB)',
    iconName: 'qr-code-outline',
    goldenRule: 'Scanning a QR code ALWAYS sends money; you NEVER scan a QR code to receive money.',
    explanation:
      'On buying/selling platforms, scammers claim to pay an advance deposit by sending a QR code. Scanning it initiates a debit transaction from your account.',
  },
];

export const SafetyScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>('pattern_1');

  const handleCall1930 = () => {
    Alert.alert(
      'Call National Cyber Crime Helpline',
      'Do you want to dial official Indian Cyber Crime Helpline 1930?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Dial 1930', onPress: () => Linking.openURL(`tel:${APP_CONFIG.cyberHelplineNumber}`) },
      ],
    );
  };

  const handleOpenPortal = () => {
    Linking.openURL(APP_CONFIG.officialPortalUrl);
  };

  return (
    <ScreenWrapper scrollable>
      <Header
        title="UPI Safety Hub"
        subtitle="Cyber crime prevention guide & emergency response"
      />

      {/* Emergency Response Card */}
      <Card style={styles.emergencyCard}>
        <View style={styles.emergencyRow}>
          <View style={[styles.emergencyIconBox, { backgroundColor: '#DC2626' }]}>
            <Ionicons name="shield-alert" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>Reported Financial Fraud?</Text>
            <Text style={styles.emergencySub}>
              Act within the "Golden Hour" (first 2 hours) to freeze fraudulently transferred funds.
            </Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall1930} activeOpacity={0.8}>
            <Ionicons name="call" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.callBtnText}>Call Helpline 1930</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.portalBtn, { borderColor: theme.colors.primary }]} onPress={handleOpenPortal} activeOpacity={0.8}>
            <Ionicons name="open-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.portalBtnText, { color: theme.colors.primary }]}>cybercrime.gov.in</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Safety Checklist */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
        5 Golden Rules of UPI Safety
      </Text>

      <Card style={styles.checklistCard}>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.safe} style={styles.checkIcon} />
          <Text style={[styles.checkText, { color: theme.colors.textPrimary }]}>
            <Text style={{ fontWeight: '800' }}>Rule 1:</Text> PIN is for paying, not receiving.
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.safe} style={styles.checkIcon} />
          <Text style={[styles.checkText, { color: theme.colors.textPrimary }]}>
            <Text style={{ fontWeight: '800' }}>Rule 2:</Text> Check recipient name on bank screen before authorizing.
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.safe} style={styles.checkIcon} />
          <Text style={[styles.checkText, { color: theme.colors.textPrimary }]}>
            <Text style={{ fontWeight: '800' }}>Rule 3:</Text> Never share SMS OTPs or UPI PIN with bank customer care.
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.safe} style={styles.checkIcon} />
          <Text style={[styles.checkText, { color: theme.colors.textPrimary }]}>
            <Text style={{ fontWeight: '800' }}>Rule 4:</Text> Ignore SMS claiming electricity/SIM disconnection.
          </Text>
        </View>
        <View style={styles.checkItem}>
          <Ionicons name="checkmark-circle" size={20} color={theme.colors.safe} style={styles.checkIcon} />
          <Text style={[styles.checkText, { color: theme.colors.textPrimary }]}>
            <Text style={{ fontWeight: '800' }}>Rule 5:</Text> Do not download screen sharing apps (AnyDesk).
          </Text>
        </View>
      </Card>

      {/* Fraud Anatomy Cards */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3, marginTop: 12 }]}>
        Common UPI Scam Vectors
      </Text>

      {FRAUD_PATTERNS.map((p) => {
        const isExpanded = expandedId === p.id;
        return (
          <Card key={p.id} style={styles.patternCard}>
            <TouchableOpacity
              style={styles.patternHeader}
              onPress={() => setExpandedId(isExpanded ? null : p.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.patternIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
                <Ionicons name={p.iconName} size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.patternCategory, { color: theme.colors.primary }]}>
                  {p.category.toUpperCase()}
                </Text>
                <Text style={[styles.patternTitle, { color: theme.colors.textPrimary }]}>
                  {p.title}
                </Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <View style={[styles.ruleBox, { backgroundColor: `${theme.colors.danger}18`, borderColor: `${theme.colors.danger}40` }]}>
                  <Ionicons name="alert-circle" size={18} color={theme.colors.danger} style={{ marginRight: 6 }} />
                  <Text style={[styles.ruleText, { color: theme.colors.danger }]}>{p.goldenRule}</Text>
                </View>

                <Text style={[styles.explanationText, { color: theme.colors.textSecondary }]}>
                  {p.explanation}
                </Text>
              </View>
            )}
          </Card>
        );
      })}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  emergencyCard: {
    backgroundColor: '#1E1B2E',
    borderColor: '#7F1D1D',
    marginBottom: 20,
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  emergencyIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emergencySub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  btnRow: {
    flexDirection: 'row',
  },
  callBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  portalBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  portalBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 12,
  },
  checklistCard: {
    marginBottom: 20,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  checkText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  patternCard: {
    marginBottom: 10,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patternCategory: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  ruleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  ruleText: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
