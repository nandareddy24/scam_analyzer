import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { SecurityStatusCard } from '../components/SecurityStatusCard';
import { AnalyzerCard } from '../components/AnalyzerCard';
import { ScanHistoryCard } from '../components/ScanHistoryCard';
import { Card } from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { historyStorage } from '../storage/historyStorage';
import { ScanResultData } from '../types/scam.types';
import { APP_CONFIG } from '../constants/config';

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
    tip: 'Always verify the recipient name on your bank screen before authorizing payment.',
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
  const [recentScans, setRecentScans] = useState<ScanResultData[]>([]);

  const loadScans = async () => {
    const data = await historyStorage.getHistory();
    setRecentScans(data.slice(0, 3));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadScans();
    });
    loadScans();
    return unsubscribe;
  }, [navigation]);

  const handleHelplineCall = () => {
    Alert.alert(
      'National Cyber Helpline 1930',
      'Do you want to dial official Indian Cyber Crime Helpline 1930 to report financial fraud?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 1930', onPress: () => Linking.openURL(`tel:${APP_CONFIG.cyberHelplineNumber}`) },
      ],
    );
  };

  return (
    <ScreenWrapper scrollable>
      {/* 1. Header */}
      <AppHeader
        title="UPI ScamGuard"
        subtitle="Stay Safe from Digital Scams"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* 2. Security status card */}
      <SecurityStatusCard
        statusText="Protected"
        isProtected
        lastScanTime="12m ago"
        threatsBlockedCount={7}
        onScanNowPress={() => navigation.navigate('Analyze')}
      />

      {/* 3. Quick Analyze section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Quick Analyze
        </Text>
        <Text style={[styles.sectionSub, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
          Select a scanner mode to test for fraud
        </Text>
      </View>

      <AnalyzerCard
        mode="sms"
        title="Analyze SMS"
        subtitle="Detect PIN credit traps & fake bank rewards"
        iconName="chatbox-ellipses-outline"
        iconColor={theme.colors.caution}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'sms' })}
        badgeText="SMS Shield"
      />

      <AnalyzerCard
        mode="upi_vpa"
        title="Check UPI ID"
        subtitle="Verify recipient VPA handle before sending money"
        iconName="at-circle-outline"
        iconColor={theme.colors.primary}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'upi_vpa' })}
        badgeText="VPA Check"
      />

      <AnalyzerCard
        mode="url"
        title="Check URL"
        subtitle="Inspect web link for phishing domains & typosquatting"
        iconName="link-outline"
        iconColor={theme.colors.secondary}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'url' })}
      />

      <AnalyzerCard
        mode="screenshot"
        title="Analyze Screenshot"
        subtitle="Detect altered font metrics on fake GPay/Paytm proof"
        iconName="qr-code-outline"
        iconColor={theme.colors.accent}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'screenshot' })}
      />

      {/* 4. Recent Scans section */}
      <View style={styles.recentRow}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3, marginBottom: 0 }]}>
          Recent Scans
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary, ...theme.typography.subtitle2 }]}>
            View All ({recentScans.length})
          </Text>
        </TouchableOpacity>
      </View>

      {recentScans.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={{ color: theme.colors.textMuted, textAlign: 'center' }}>No recent audit records.</Text>
        </Card>
      ) : (
        recentScans.map((scan) => (
          <ScanHistoryCard
            key={scan.id}
            scanResult={scan}
            onPress={() => navigation.navigate('History')}
          />
        ))
      )}

      {/* 5. Safety Tips section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Essential Safety Tips
        </Text>
      </View>

      {SAFETY_TIPS.map((item) => (
        <Card key={item.id} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
              <Ionicons name={item.iconName} size={20} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.tipTitleRow}>
                <Text style={[styles.tipTitle, { color: theme.colors.textPrimary }]}>{item.title}</Text>
                <View style={[styles.tipBadge, { backgroundColor: `${theme.colors.danger}20` }]}>
                  <Text style={[styles.tipBadgeText, { color: theme.colors.danger }]}>{item.badge}</Text>
                </View>
              </View>
              <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>{item.tip}</Text>
            </View>
          </View>
        </Card>
      ))}

      {/* Cyber Crime Emergency Banner */}
      <TouchableOpacity style={styles.helplineBanner} onPress={handleHelplineCall} activeOpacity={0.85}>
        <View style={styles.helplineLeft}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.helplineTitle}>National Cyber Helpline 1930</Text>
            <Text style={styles.helplineSub}>Report financial fraud immediately to freeze stolen funds</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  sectionSub: {
    marginTop: 2,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  seeAllText: {
    fontWeight: '700',
  },
  emptyCard: {
    padding: 16,
    marginBottom: 10,
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
  helplineBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  helplineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helplineTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  helplineSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 2,
  },
});
