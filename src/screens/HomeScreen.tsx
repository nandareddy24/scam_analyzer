import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { QuickActionButton } from '../components/QuickActionButton';
import { Badge } from '../components/Badge';
import { useTheme } from '../hooks/useTheme';
import { historyStorage } from '../storage/historyStorage';
import { ScanResultData } from '../types/scam.types';
import { APP_CONFIG } from '../constants/config';
import { formatTimestamp } from '../utils/formatters';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [recentScans, setRecentScans] = useState<ScanResultData[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      historyStorage.getHistory().then((data) => {
        setRecentScans(data.slice(0, 3));
      });
    });

    historyStorage.getHistory().then((data) => {
      setRecentScans(data.slice(0, 3));
    });

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
      {/* App Bar / Header */}
      <View style={styles.topHeader}>
        <View>
          <View style={styles.brandRow}>
            <Text style={[styles.appName, { color: theme.colors.textPrimary, ...theme.typography.h2 }]}>
              UPI ScamGuard
            </Text>
            <View style={[styles.liveShield, { backgroundColor: `${theme.colors.safe}1F` }]}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.safe }]} />
              <Text style={[styles.liveText, { color: theme.colors.safe }]}>GUARD ACTIVE</Text>
            </View>
          </View>
          <Text style={[styles.welcomeSub, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
            Real-Time AI Fraud Prevention Engine
          </Text>
        </View>

        <TouchableOpacity style={[styles.bellBtn, { backgroundColor: theme.colors.cardBackground }]}>
          <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
          <View style={[styles.badgeDot, { backgroundColor: theme.colors.primary }]} />
        </TouchableOpacity>
      </View>

      {/* Main Security Health Widget */}
      <Card variant="glowing" style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <View style={styles.shieldBox}>
            <Ionicons name="shield-checkmark" size={32} color={theme.colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.healthTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
              System Protection Active
            </Text>
            <Text style={[styles.healthSub, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
              Real-time heuristic & pattern checks operating at 98.4% accuracy
            </Text>
          </View>
        </View>

        <View style={styles.healthDivider} />

        <View style={styles.healthFooter}>
          <View style={styles.healthStatItem}>
            <Text style={[styles.healthStatVal, { color: theme.colors.safe }]}>SAFE</Text>
            <Text style={[styles.healthStatLbl, { color: theme.colors.textMuted }]}>SMS SHIELD</Text>
          </View>

          <View style={styles.healthStatItem}>
            <Text style={[styles.healthStatVal, { color: theme.colors.primary }]}>ACTIVE</Text>
            <Text style={[styles.healthStatLbl, { color: theme.colors.textMuted }]}>VPA VALIDATOR</Text>
          </View>

          <View style={styles.healthStatItem}>
            <Text style={[styles.healthStatVal, { color: theme.colors.safe }]}>ENABLED</Text>
            <Text style={[styles.healthStatLbl, { color: theme.colors.textMuted }]}>URL FILTER</Text>
          </View>
        </View>
      </Card>

      {/* Quick Metrics */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Scans Done"
          value="48"
          iconName="analytics-outline"
          iconColor={theme.colors.primary}
          subtitle="+12 this week"
        />
        <View style={{ width: 12 }} />
        <StatCard
          title="Threats Blocked"
          value="7"
          iconName="alert-circle-outline"
          iconColor={theme.colors.danger}
          subtitle="Saved ~₹42,000"
        />
      </View>

      {/* Section: Quick Scanners */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
        Instant Verification Tools
      </Text>

      <QuickActionButton
        title="Check UPI VPA / Handle"
        description="Verify recipient UPI ID before making payments"
        iconName="at-circle-outline"
        iconColor={theme.colors.primary}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'upi_vpa' })}
        badgeText="Popular"
      />

      <QuickActionButton
        title="Scan SMS & Reward Claims"
        description="Detect PIN theft traps and fake bank refund SMS"
        iconName="chatbox-ellipses-outline"
        iconColor={theme.colors.caution}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'sms' })}
      />

      <QuickActionButton
        title="Verify Phishing Link"
        description="Check suspicious web URLs in messages before clicking"
        iconName="link-outline"
        iconColor={theme.colors.secondary}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'url' })}
      />

      <QuickActionButton
        title="Payment Proof Screenshot"
        description="Analyze payment screenshots for font/UTR alterations"
        iconName="qr-code-outline"
        iconColor={theme.colors.accent}
        onPress={() => navigation.navigate('Analyze', { initialCategory: 'screenshot' })}
      />

      {/* Recent Scans */}
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3, marginBottom: 0 }]}>
          Recent Activity
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary, ...theme.typography.subtitle2 }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {recentScans.map((item) => (
        <Card key={item.id} style={styles.recentItem}>
          <View style={styles.recentRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.recentInput, { color: theme.colors.textPrimary, ...theme.typography.subtitle2 }]}
                numberOfLines={1}
              >
                {item.targetInput}
              </Text>
              <Text style={[styles.recentTime, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
                {formatTimestamp(item.timestamp)} • {item.category.toUpperCase()}
              </Text>
            </View>
            <Badge level={item.riskLevel} size="small" />
          </View>
        </Card>
      ))}

      {/* Cyber Crime Helpline Widget */}
      <TouchableOpacity style={styles.helplineBanner} onPress={handleHelplineCall} activeOpacity={0.85}>
        <View style={styles.helplineLeft}>
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.helplineTitle}>Cyber Financial Fraud Helpline</Text>
            <Text style={styles.helplineSub}>Dial 1930 instantly to freeze stolen funds</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  liveShield: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeSub: {
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthCard: {
    marginBottom: 16,
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(14, 165, 233, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  healthTitle: {
    fontWeight: '800',
  },
  healthSub: {
    marginTop: 2,
  },
  healthDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 14,
  },
  healthFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthStatItem: {
    alignItems: 'center',
  },
  healthStatVal: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  healthStatLbl: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  seeAllText: {
    fontWeight: '700',
  },
  recentItem: {
    marginBottom: 8,
    padding: 12,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentInput: {
    fontWeight: '600',
  },
  recentTime: {
    marginTop: 3,
  },
  helplineBanner: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
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
