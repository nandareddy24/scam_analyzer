import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  onNotificationPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  hasUnreadNotifications?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'UPI ScamGuard',
  subtitle = 'Stay Safe from Digital Scams',
  onNotificationPress,
  showBack = false,
  onBackPress,
  hasUnreadNotifications = true,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.logoBox, { backgroundColor: 'rgba(14, 165, 233, 0.15)', borderColor: 'rgba(14, 165, 233, 0.3)' }]}>
            <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
          </View>
        )}

        <View style={styles.titleBox}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h2 }]}>
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.notificationBtn, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
        {hasUnreadNotifications && (
          <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  titleBox: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 12,
  },
  unreadDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0F172A',
  },
});
