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
import { ScanResultData, RiskLevel } from '../types/scam.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { RiskIndicator } from '../components/RiskIndicator';
import { historyStorage } from '../storage/historyStorage';
import { useTheme } from '../hooks/useTheme';
import { formatTimestamp, getCategoryIconName } from '../utils/formatters';

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
      <Header
        title="Audit Logs & History"
        subtitle="Saved scans, threat indicators and risk breakdown"
        rightAction={
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearHeaderBtn}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        }
      />

      {/* Search Input */}
      <Input
        placeholder="Search scan logs by VPA, SMS or URL..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        iconName="search-outline"
        onClear={() => setSearchQuery('')}
        containerStyle={{ marginBottom: 10 }}
      />

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
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.border,
                },
              ]}
              onPress={() => setFilterLevel(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {filter === 'all' ? 'All Logs' : filter === 'suspicious' ? 'Suspicious Only' : 'Safe Only'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="documents-outline" size={48} color={theme.colors.textMuted} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No security audit logs found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            style={styles.historyCard}
            onPress={() => setSelectedScan(item)}
            variant={item.riskScore > 60 ? 'danger' : 'bordered'}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={getCategoryIconName(item.category) as any}
                  size={18}
                  color={theme.colors.primary}
                />
              </View>

              <View style={styles.cardTitleBox}>
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                  {item.targetInput}
                </Text>
                <Text style={[styles.cardTime, { color: theme.colors.textMuted }]}>
                  {formatTimestamp(item.timestamp)} • {item.category.toUpperCase()}
                </Text>
              </View>

              <Badge level={item.riskLevel} size="small" />
            </View>
          </Card>
        )}
      />

      {/* History Detail Modal */}
      <Modal visible={!!selectedScan} animationType="slide" transparent onRequestClose={() => setSelectedScan(null)}>
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                Scan Details
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
                  Recommended Guidance
                </Text>
                <View style={[styles.guideCard, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.guideText, { color: theme.colors.textPrimary }]}>
                    {selectedScan.recommendedAction}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  clearHeaderBtn: {
    padding: 6,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
  },
  historyCard: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitleBox: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  cardTime: {
    fontSize: 11,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
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
  },
  guideText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
