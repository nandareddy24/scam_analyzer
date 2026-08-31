import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { useTheme } from '../hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  iconColor,
  subtitle,
}) => {
  const theme = useTheme();
  const activeIconColor = iconColor || theme.colors.primary;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconBg,
            { backgroundColor: `${activeIconColor}1A`, borderColor: `${activeIconColor}33` },
          ]}
        >
          <Ionicons name={iconName} size={20} color={activeIconColor} />
        </View>
        <Text style={[styles.title, { color: theme.colors.textSecondary, ...theme.typography.caption }]}>
          {title}
        </Text>
      </View>

      <Text style={[styles.value, { color: theme.colors.textPrimary, ...theme.typography.h2 }]}>
        {value}
      </Text>

      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted, ...theme.typography.caption }]}>
          {subtitle}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
  },
  title: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  value: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
  },
});
