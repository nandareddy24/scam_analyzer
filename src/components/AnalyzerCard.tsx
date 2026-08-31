import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export type AnalyzerMode = 'sms' | 'upi_vpa' | 'url' | 'screenshot';

interface AnalyzerCardProps {
  mode: AnalyzerMode;
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress: () => void;
  badgeText?: string;
}

export const AnalyzerCard: React.FC<AnalyzerCardProps> = ({
  title,
  subtitle,
  iconName,
  iconColor,
  onPress,
  badgeText,
}) => {
  const theme = useTheme();
  const activeColor = iconColor || theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${activeColor}1F`, borderColor: `${activeColor}3A` }]}>
        <Ionicons name={iconName} size={22} color={activeColor} />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.subtitle1 }]}>
            {title}
          </Text>
          {badgeText && (
            <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{badgeText}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, ...theme.typography.body2 }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subtitle: {
    marginTop: 2,
  },
});
