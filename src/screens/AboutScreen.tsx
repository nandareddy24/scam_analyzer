import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'About'>;

export const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleOpenGitHub = () => {
    Linking.openURL('https://github.com/nandareddy24/scam_analyzer');
  };

  return (
    <ScreenWrapper scrollable>
      {/* App Header */}
      <AppHeader
        title="About UPI ScamGuard"
        subtitle="Final Year Project & AI System Documentation"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {/* Hero Capstone Badge Card */}
      <Card variant="glowing" style={styles.heroCard}>
        <View style={styles.heroHeaderRow}>
          <View style={[styles.heroIconBox, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="school" size={28} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroTitle, { color: theme.colors.textPrimary }]}>
              UPI ScamGuard Engine
            </Text>
            <Text style={[styles.heroSub, { color: theme.colors.primary }]}>
              Final Year Capstone Project (AI & Cybersecurity)
            </Text>
          </View>
        </View>

        <Text style={[styles.heroDesc, { color: theme.colors.textSecondary }]}>
          An AI-powered multi-modal threat analysis ecosystem designed to protect digital payment users in India against UPI scams, phishing links, fake payment screenshots, and cyber extortion.
        </Text>

        <TouchableOpacity style={[styles.githubBtn, { backgroundColor: `${theme.colors.primary}18`, borderColor: theme.colors.primary }]} onPress={handleOpenGitHub}>
          <Ionicons name="logo-github" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.githubBtnText, { color: theme.colors.primary }]}>View Source on GitHub</Text>
        </TouchableOpacity>
      </Card>

      {/* 1. Problem Statement */}
      <Card variant="bordered" style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.danger} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            1. Problem Statement
          </Text>
        </View>
        <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
          With over 13 Billion monthly transactions on Unified Payments Interface (UPI), digital financial fraud has surged exponentially across India. Non-technical citizens are frequently targeted by:
        </Text>
        {[
          'UPI PIN Traps: Tricking users into entering their PIN to "receive" money.',
          'Digital Arrest Extortion: Fake police/CBI video calls threatening fake warrants.',
          'Phishing Links: Spoofed bank URLs (.top, .xyz) harvesting OTPs and credentials.',
          'Fake Payment Proofs: Generator apps producing fake Paytm/GPay screenshots.',
        ].map((item, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </Card>

      {/* 2. Project Objective */}
      <Card variant="bordered" style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="flag" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            2. System Objective
          </Text>
        </View>
        <Text style={[styles.bodyText, { color: theme.colors.textSecondary }]}>
          To construct a privacy-first, non-intrusive mobile security assistant that allows users to instantly evaluate suspicious text messages, UPI ID handles, web links, and payment screenshots before sending money or entering secret credentials.
        </Text>
      </Card>

      {/* 3. Technology Stack */}
      <Card variant="bordered" style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="hardware-chip-outline" size={20} color={theme.colors.secondary} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            3. Technology Stack
          </Text>
        </View>

        {[
          { label: 'Mobile Application', tech: 'React Native 0.74, Expo SDK 51, TypeScript' },
          { label: 'Navigation & UI', tech: 'React Navigation v6, Vanilla CSS Design System' },
          { label: 'Local Persistent Storage', tech: '@react-native-async-storage/async-storage' },
          { label: 'Backend API Framework', tech: 'Python 3.12, FastAPI, Pydantic, Uvicorn' },
          { label: 'Machine Learning Pipelines', tech: 'scikit-learn, Random Forest Classifiers, TF-IDF, joblib' },
        ].map((item, idx) => (
          <View key={idx} style={styles.techRow}>
            <Text style={[styles.techLabel, { color: theme.colors.secondary }]}>{item.label}:</Text>
            <Text style={[styles.techVal, { color: theme.colors.textPrimary }]}>{item.tech}</Text>
          </View>
        ))}
      </Card>

      {/* 4. AI / ML Architecture */}
      <Card variant="bordered" style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="sparkles" size={20} color={theme.colors.caution} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            4. AI / Machine Learning Approach
          </Text>
        </View>

        {[
          {
            title: 'SMS Scam Classifier',
            desc: 'TF-IDF word vectorization + Random Forest model evaluating urgency keywords, OTP lures, and threat signals.',
          },
          {
            title: 'UPI VPA Reputation Engine',
            desc: 'Character n-gram TF-IDF model identifying brand impersonation patterns in handles (e.g., paytm-refund@okaxis).',
          },
          {
            title: 'URL Phishing Classifier',
            desc: 'Lexical feature extraction evaluating SSL protocol, domain TLD risk (.top), subdomains, and typosquatting.',
          },
          {
            title: 'Payment Screenshot OCR',
            desc: 'Regex data extraction (Amount, UTR #, Payee, App) combined with font metric distortion heuristic check.',
          },
        ].map((ml, idx) => (
          <View key={idx} style={[styles.mlCard, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.mlTitle, { color: theme.colors.caution }]}>{ml.title}</Text>
            <Text style={[styles.mlDesc, { color: theme.colors.textSecondary }]}>{ml.desc}</Text>
          </View>
        ))}
      </Card>

      {/* 5. Key System Features */}
      <Card variant="bordered" style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="star" size={20} color={theme.colors.safe} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            5. Key Features Implemented
          </Text>
        </View>
        {[
          'Multi-modal Threat Analyzer (SMS, UPI ID, URL, Screenshot).',
          'Unified Risk Report Modal with 0-100 Circular Gauge & State Themes.',
          'Privacy-First Persistent History with automatic credential sanitization.',
          '10-Topic Interactive Scam Awareness & Education Library.',
          'Emergency Scam Response Module with 1930 Helpline & Bank Contacts.',
        ].map((feat, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.safe} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={[styles.bulletText, { color: theme.colors.textPrimary }]}>{feat}</Text>
          </View>
        ))}
      </Card>

      {/* 6. System Limitations */}
      <Card variant="bordered" style={[styles.sectionCard, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="information-circle" size={20} color={theme.colors.danger} style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { color: theme.colors.danger }]}>
            6. Known System Limitations
          </Text>
        </View>
        {[
          'Risk Assessment vs Legal Proof: ML risk scores represent probability estimates and do not constitute legal proof of fraud.',
          'Format vs Reputation: Valid UPI VPA syntax does not guarantee seller trustworthiness; bank statement verification remains required.',
          'Screenshot Verification: OCR font metric checks evaluate receipt template authenticity but cannot query live interbank ledger balances.',
        ].map((lim, idx) => (
          <View key={idx} style={styles.bulletRow}>
            <Text style={{ marginRight: 8 }}>⚠️</Text>
            <Text style={[styles.bulletText, { color: theme.colors.textSecondary }]}>{lim}</Text>
          </View>
        ))}
      </Card>

      <PrimaryButton
        title="Return to Dashboard"
        onPress={() => navigation.goBack()}
        variant="secondary"
        style={{ marginTop: 12, marginBottom: 24 }}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  heroSub: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  githubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  githubBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    color: '#0EA5E9',
    fontSize: 14,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
  techRow: {
    marginBottom: 8,
  },
  techLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  techVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  mlCard: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  mlTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  mlDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
});
