import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface QuickActionButtonProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onPress: () => void;
  badgeText?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  description,
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
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.cardBorder,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: `${activeColor}1F`, borderColor: `${activeColor}40` },
        ]}
      >
        <Ionicons name={iconName} size={24} color={activeColor} />
      </View>

      <View style={styles.textColumn}>
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

        <Text
          style={[styles.description, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}
          numberOfLines={1}
        >
          {description}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  textColumn: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    marginTop: 2,
  },
});
