import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../hooks/useTheme';

interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Analysis Failed',
  message,
  onRetry,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.errorBox, { backgroundColor: `${theme.colors.danger}15`, borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
        <Ionicons name="alert-circle-outline" size={32} color={theme.colors.danger} />
        <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.subtitle1 }]}>
          {title}
        </Text>
        <Text style={[styles.message, { color: theme.colors.textSecondary, ...theme.typography.body2 }]}>
          {message}
        </Text>

        {onRetry && (
          <PrimaryButton
            title="Retry Audit"
            onPress={onRetry}
            variant="danger"
            style={{ marginTop: 14, paddingVertical: 10, width: 'auto', paddingHorizontal: 20 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  errorBox: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  title: {
    marginTop: 8,
    fontWeight: '800',
  },
  message: {
    marginTop: 4,
    textAlign: 'center',
  },
});
