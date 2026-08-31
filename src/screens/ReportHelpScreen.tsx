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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportHelp'>;

interface BankHelpline {
  name: string;
  number: string;
  icon: string;
}

const BANK_HELPLINES: BankHelpline[] = [
  { name: 'State Bank of India (SBI)', number: '18001234', icon: 'business-outline' },
  { name: 'HDFC Bank', number: '18001600', icon: 'card-outline' },
  { name: 'ICICI Bank', number: '18001080', icon: 'wallet-outline' },
  { name: 'Axis Bank', number: '18604195555', icon: 'cash-outline' },
  { name: 'Paytm Payments Bank', number: '01204456456', icon: 'at-circle-outline' },
  { name: 'PhonePe Support', number: '08068727374', icon: 'phone-portrait-outline' },
  { name: 'Google Pay Support', number: '18004190157', icon: 'globe-outline' },
];

export const ReportHelpScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<'helpline' | 'bank' | 'portal' | 'number' | 'steps'>('helpline');

  const handleDialNumber = (num: string, label: string) => {
    Alert.alert(
      `Call ${label}`,
      `Do you want to dial ${num} on your phone?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => Linking.openURL(`tel:${num}`) },
      ],
    );
  };

  const handleOpenURL = (url: string, label: string) => {
    Alert.alert(
      `Open Official Resource`,
      `You will be redirected to official website:\n${url}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Website', onPress: () => Linking.openURL(url) },
      ],
    );
  };

  return (
    <ScreenWrapper scrollable>
      {/* App Header */}
      <AppHeader
        title="Report / Get Help"
        subtitle="Emergency cyber fraud assistance & bank helplines"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Prominent Critical Safety Warning Banner */}
      <View style={[styles.criticalWarningCard, { backgroundColor: 'rgba(239, 68, 68, 0.18)', borderColor: theme.colors.danger }]}>
        <Ionicons name="warning" size={24} color={theme.colors.danger} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.criticalWarningTitle, { color: theme.colors.danger }]}>
            NEVER SHARE CREDENTIALS WHILE SEEKING HELP
          </Text>
          <Text style={[styles.criticalWarningText, { color: theme.colors.textPrimary }]}>
            Never share your OTP, UPI PIN, CVV, password, or banking credentials. Official bank or police helpline agents will NEVER ask for your secret PIN or passwords.
          </Text>
        </View>
      </View>

      {/* Navigation Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {[
          { key: 'helpline', label: '1930 Helpline', icon: 'call' },
          { key: 'bank', label: 'Contact Bank', icon: 'business' },
          { key: 'portal', label: 'Cyber Portal', icon: 'globe' },
          { key: 'number', label: 'Report Number', icon: 'megaphone' },
          { key: 'steps', label: 'Safety Steps', icon: 'list-circle' },
        ].map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabChip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBackground,
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.cardBorder,
                },
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={isActive ? '#0B1120' : theme.colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabChipText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* OPTION 1: 1930 CYBER CRIME HELPLINE */}
      {(selectedTab === 'helpline' || selectedTab === 'steps') && (
        <Card style={styles.emergencyCard} variant="bordered">
          <View style={styles.emergencyCardHeader}>
            <View style={[styles.emergencyIconBox, { backgroundColor: theme.colors.danger }]}>
              <Ionicons name="call" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.emergencyCardTitle, { color: theme.colors.textPrimary }]}>
                1930 – National Cyber Crime Helpline
              </Text>
              <Text style={[styles.emergencyCardSub, { color: theme.colors.textMuted }]}>
                Ministry of Home Affairs, Govt of India (24x7 Emergency)
              </Text>
            </View>
          </View>

          <Text style={[styles.emergencyDescription, { color: theme.colors.textSecondary }]}>
            Call immediately within the first "Golden Hour" of fraud to freeze stolen funds in transit before scammers withdraw cash.
          </Text>

          <PrimaryButton
            title="Call 1930 Helpline Now"
            onPress={() => handleDialNumber('1930', 'National Cyber Crime Helpline 1930')}
            variant="cyber"
            style={{ backgroundColor: theme.colors.danger, marginTop: 12 }}
            icon={<Ionicons name="call-outline" size={20} color="#FFFFFF" />}
          />
        </Card>
      )}

      {/* OPTION 2: CONTACT BANK */}
      {(selectedTab === 'bank' || selectedTab === 'helpline') && (
        <Card style={styles.sectionCard} variant="bordered">
          <View style={styles.sectionTitleRow}>
            <Ionicons name="business-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
              Contact Your Bank Helpline Immediately
            </Text>
          </View>
          <Text style={[styles.sectionSubtitleText, { color: theme.colors.textMuted }]}>
            Call your bank to freeze your netbanking, block your debit/credit card, and register a fraud chargeback ticket.
          </Text>

          {BANK_HELPLINES.map((bank, idx) => (
            <View key={idx} style={[styles.bankItemRow, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={[styles.bankIconBox, { backgroundColor: `${theme.colors.primary}18` }]}>
                <Ionicons name={bank.icon as any} size={18} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bankNameText, { color: theme.colors.textPrimary }]}>{bank.name}</Text>
                <Text style={[styles.bankNumberText, { color: theme.colors.primary }]}>{bank.number}</Text>
              </View>
              <TouchableOpacity
                style={[styles.dialBtn, { backgroundColor: `${theme.colors.primary}20`, borderColor: theme.colors.primary }]}
                onPress={() => handleDialNumber(bank.number, bank.name)}
              >
                <Ionicons name="call" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
                <Text style={[styles.dialBtnText, { color: theme.colors.primary }]}>Call</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      )}

      {/* OPTION 3: CYBER CRIME PORTAL */}
      {(selectedTab === 'portal' || selectedTab === 'helpline') && (
        <Card style={styles.sectionCard} variant="bordered">
          <View style={styles.sectionTitleRow}>
            <Ionicons name="globe-outline" size={20} color={theme.colors.secondary} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
              Official Cyber Crime Reporting Portal
            </Text>
          </View>
          <Text style={[styles.sectionSubtitleText, { color: theme.colors.textMuted }]}>
            Lodge a formal digital complaint directly with the Government of India portal.
          </Text>

          <View style={[styles.portalInfoBox, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.portalDomainText, { color: theme.colors.secondary }]}>
              https://cybercrime.gov.in
            </Text>
            <Text style={[styles.portalDescText, { color: theme.colors.textSecondary }]}>
              Upload transaction details, bank reference UTR numbers, SMS screenshots, and fraud VPAs to generate an official FIR complaint number.
            </Text>

            <TouchableOpacity
              style={[styles.portalActionBtn, { backgroundColor: theme.colors.secondary }]}
              onPress={() => handleOpenURL('https://cybercrime.gov.in', 'National Cyber Crime Reporting Portal')}
            >
              <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.portalActionBtnText}>Open cybercrime.gov.in Portal</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* OPTION 4: REPORT SUSPICIOUS NUMBER / MESSAGE */}
      {(selectedTab === 'number' || selectedTab === 'helpline') && (
        <Card style={styles.sectionCard} variant="bordered">
          <View style={styles.sectionTitleRow}>
            <Ionicons name="megaphone-outline" size={20} color={theme.colors.caution} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
              Report Fraud Mobile Number / SMS Header
            </Text>
          </View>
          <Text style={[styles.sectionSubtitleText, { color: theme.colors.textMuted }]}>
            Report suspicious calls, phishing links, or SMS headers to Department of Telecommunications (DoT).
          </Text>

          <View style={[styles.portalInfoBox, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.portalDomainText, { color: theme.colors.caution }]}>
              Chakshu – Sanchar Saathi Portal
            </Text>
            <Text style={[styles.portalDescText, { color: theme.colors.textSecondary }]}>
              Report suspect mobile numbers, WhatsApp numbers, or fake bank SMS headers to block spam telecom connections across India.
            </Text>

            <TouchableOpacity
              style={[styles.portalActionBtn, { backgroundColor: theme.colors.caution }]}
              onPress={() => handleOpenURL('https://sancharsaathi.gov.in/sfc/', 'DoT Chakshu Fraud Reporter')}
            >
              <Ionicons name="shield-outline" size={16} color="#0B1120" style={{ marginRight: 6 }} />
              <Text style={[styles.portalActionBtnText, { color: '#0B1120' }]}>Report on Chakshu Portal</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* OPTION 5: EMERGENCY SAFETY INSTRUCTIONS */}
      {(selectedTab === 'steps' || selectedTab === 'helpline') && (
        <Card style={styles.sectionCard} variant="bordered">
          <View style={styles.sectionTitleRow}>
            <Ionicons name="list-circle-outline" size={20} color={theme.colors.safe} style={{ marginRight: 8 }} />
            <Text style={[styles.sectionTitleText, { color: theme.colors.textPrimary }]}>
              Step-by-Step Emergency Recovery Plan
            </Text>
          </View>

          {[
            {
              step: '1',
              title: 'Freeze Account & Block Cards Immediately',
              desc: 'Call your bank helpline (numbers listed above) to freeze netbanking access and block your debit card.',
            },
            {
              step: '2',
              title: 'Call 1930 Within the Golden Hour',
              desc: 'Dial National Cyber Crime Helpline 1930 to trigger money-hold alerts on scammers bank accounts.',
            },
            {
              step: '3',
              title: 'Lodge Complaint on cybercrime.gov.in',
              desc: 'Submit bank reference numbers (UTR), SMS receipts, and fraud VPA handles on the government portal.',
            },
            {
              step: '4',
              title: 'File Written Complaint at Local Police Station',
              desc: 'Submit printed copy of cyber portal acknowledgement and bank statement to your nearest cyber cell.',
            },
          ].map((item) => (
            <View key={item.step} style={[styles.stepCardRow, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={[styles.stepBadge, { backgroundColor: `${theme.colors.safe}20` }]}>
                <Text style={[styles.stepBadgeText, { color: theme.colors.safe }]}>{item.step}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitleText, { color: theme.colors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.stepDescText, { color: theme.colors.textSecondary }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </Card>
      )}

      {/* Honest Transparency Disclaimer */}
      <View style={[styles.disclaimerBox, { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
        <Ionicons name="information-circle-outline" size={18} color={theme.colors.textMuted} style={{ marginRight: 8 }} />
        <Text style={[styles.disclaimerText, { color: theme.colors.textMuted }]}>
          Integrity Note: This app provides official emergency contact channels and guidance. Formal police complaints must be lodged directly with National Cyber Crime Helpline 1930 or www.cybercrime.gov.in.
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  criticalWarningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  criticalWarningTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  criticalWarningText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  tabScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  tabChipText: {
    fontSize: 11,
  },
  emergencyCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  emergencyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyCardTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  emergencyCardSub: {
    fontSize: 11,
    marginTop: 2,
  },
  emergencyDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 6,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionSubtitleText: {
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  bankItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  bankIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  bankNameText: {
    fontSize: 12,
    fontWeight: '800',
  },
  bankNumberText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  dialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  dialBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  portalInfoBox: {
    padding: 14,
    borderRadius: 12,
  },
  portalDomainText: {
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },
  portalDescText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  portalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  portalActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  stepTitleText: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  stepDescText: {
    fontSize: 11,
    lineHeight: 16,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
