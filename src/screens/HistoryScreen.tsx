import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScanResultData } from '../types/scam.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { ScanHistoryCard } from '../components/ScanHistoryCard';
import { EmptyState } from '../components/EmptyState';
import { RiskIndicator } from '../components/RiskIndicator';
import { PrimaryButton } from '../components/PrimaryButton';
import { historyStorage } from '../storage/historyStorage';
import { useTheme } from '../hooks/useTheme';

type Props = BottomTabScreenProps<MainTabParamList, 'History'>;

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [historyItems, setHistoryItems] = useState<ScanResultData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'suspicious' | 'safe'>('all');
  const [selectedScan, setSelectedScan] = useState<ScanResultData | null>(null);

  const loadHistory = async () => {
    const data = await historyStorage.getHistory();
    setHistoryItems(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHistory();
    });
    loadHistory();
    return unsubscribe;
  }, [navigation]);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Scan History',
      'Are you sure you want to delete all past security audit records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await historyStorage.clearHistory();
            loadHistory();
          },
        },
      ],
    );
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.targetInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.verdictTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterLevel === 'suspicious') {
      return item.riskLevel === 'high_risk' || item.riskLevel === 'critical' || item.riskLevel === 'caution';
    }
    if (filterLevel === 'safe') {
      return item.riskLevel === 'safe';
    }
    return true;
  });

  return (
    <ScreenWrapper>
      {/* Header */}
      <AppHeader
        title="Security Audit Logs"
        subtitle="Saved scans, threat indicators and risk breakdown"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* Search Bar & Trash Action */}
      <View style={styles.searchRow}>
        <Input
          placeholder="Search logs by VPA, SMS or URL..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          iconName="search-outline"
          onClear={() => setSearchQuery('')}
          containerStyle={{ flex: 1, marginBottom: 0 }}
        />
        <TouchableOpacity
          onPress={handleClearHistory}
          style={[styles.trashBtn, { backgroundColor: `${theme.colors.danger}18`, borderColor: 'rgba(239, 68, 68, 0.4)' }]}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'suspicious', 'safe'] as const).map((filter) => {
          const isActive = filterLevel === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBackground,
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.cardBorder,
                },
              ]}
              onPress={() => setFilterLevel(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '800' : '500',
                  },
                ]}
              >
                {filter === 'all' ? 'All Logs' : filter === 'suspicious' ? 'Suspicious Only' : 'Safe Only'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List of Scan History Cards */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <EmptyState
            title="No Security Logs Found"
            description="Run a new scan on SMS, UPI VPA handles or phishing links to record audit history."
            iconName="shield-outline"
            actionTitle="Go to Analyzer"
            onActionPress={() => navigation.navigate('Analyze')}
          />
        }
        renderItem={({ item }) => (
          <ScanHistoryCard
            scanResult={item}
            onPress={() => setSelectedScan(item)}
          />
        )}
      />

      {/* Scan Detail Modal */}
      <Modal visible={!!selectedScan} animationType="slide" transparent onRequestClose={() => setSelectedScan(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                Scan Audit Report
              </Text>
              <TouchableOpacity onPress={() => setSelectedScan(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedScan && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <RiskIndicator score={selectedScan.riskScore} level={selectedScan.riskLevel} />

                <Card variant="bordered" style={{ marginVertical: 12 }}>
                  <Text style={[styles.detailTarget, { color: theme.colors.primary }]}>
                    {selectedScan.targetInput}
                  </Text>
                  <Text style={[styles.detailVerdict, { color: theme.colors.textPrimary }]}>
                    {selectedScan.verdictTitle}
                  </Text>
                  <Text style={[styles.detailSummary, { color: theme.colors.textSecondary }]}>
                    {selectedScan.summary}
                  </Text>
                </Card>

                <Text style={[styles.sectionHeading, { color: theme.colors.textPrimary }]}>
                  Recommended Action
                </Text>
                <View style={[styles.guideCard, { backgroundColor: theme.colors.cardBackground, borderColor: theme.colors.cardBorder }]}>
                  <Text style={[styles.guideText, { color: theme.colors.textPrimary }]}>
                    {selectedScan.recommendedAction}
                  </Text>
                </View>

                <PrimaryButton
                  title="Close Report"
                  onPress={() => setSelectedScan(null)}
                  variant="secondary"
                  style={{ marginTop: 16 }}
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trashBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  detailTarget: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  detailVerdict: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  detailSummary: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
  },
  guideCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  guideText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
