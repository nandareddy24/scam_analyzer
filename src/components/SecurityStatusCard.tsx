import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { useTheme } from '../hooks/useTheme';

interface SecurityStatusCardProps {
  statusText?: string;
  isProtected?: boolean;
  lastScanTime?: string;
  threatsBlockedCount?: number;
  onScanNowPress?: () => void;
}

export const SecurityStatusCard: React.FC<SecurityStatusCardProps> = ({
  statusText = 'Protected',
  isProtected = true,
  lastScanTime = '12m ago',
  threatsBlockedCount = 7,
  onScanNowPress,
}) => {
  const theme = useTheme();

  return (
    <Card variant="glowing" style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.headerTitleBox}>
          <Text style={[styles.cardLabel, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
            YOUR PROTECTION STATUS
          </Text>
          <View style={styles.statusPillRow}>
            <View style={[styles.pulseDot, { backgroundColor: isProtected ? theme.colors.safe : theme.colors.danger }]} />
            <Text style={[styles.statusText, { color: isProtected ? theme.colors.safe : theme.colors.danger }]}>
              {isProtected ? statusText : 'Action Needed'}
            </Text>
          </View>
        </View>

        <View style={[styles.shieldIconBox, { backgroundColor: `${theme.colors.primary}1A`, borderColor: `${theme.colors.primary}40` }]}>
          <Ionicons name="shield-checkmark" size={28} color={theme.colors.primary} />
        </View>
      </View>

      <Text style={[styles.subText, { color: theme.colors.textPrimary, ...theme.typography.body2 }]}>
        Real-time heuristics monitoring SMS messages, UPI handles, and payment URLs.
      </Text>

      <View style={styles.divider} />

      <View style={styles.infoFooter}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Last Scan: <Text style={{ color: theme.colors.textPrimary, fontWeight: '700' }}>{lastScanTime}</Text>
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="shield-outline" size={14} color={theme.colors.safe} style={{ marginRight: 4 }} />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Blocked: <Text style={{ color: theme.colors.safe, fontWeight: '700' }}>{threatsBlockedCount} Threats</Text>
          </Text>
        </View>
      </View>

      {onScanNowPress && (
        <TouchableOpacity
          style={[styles.quickScanBtn, { backgroundColor: `${theme.colors.primary}15`, borderColor: `${theme.colors.primary}35` }]}
          onPress={onScanNowPress}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={[styles.quickScanBtnText, { color: theme.colors.primary }]}>Run System Audit</Text>
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleBox: {
    flex: 1,
  },
  cardLabel: {
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  statusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  shieldIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  subText: {
    marginTop: 10,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 12,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
  },
  quickScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
  },
  quickScanBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
