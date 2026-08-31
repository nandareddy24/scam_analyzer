import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../hooks/useTheme';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  iconName = 'shield-outline',
  actionTitle,
  onActionPress,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}30` }]}>
        <Ionicons name={iconName} size={48} color={theme.colors.primary} />
      </View>
      <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
        {description}
      </Text>

      {actionTitle && onActionPress && (
        <PrimaryButton
          title={actionTitle}
          onPress={onActionPress}
          variant="secondary"
          style={{ marginTop: 16, width: 'auto', paddingHorizontal: 24 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%',
  },
});
