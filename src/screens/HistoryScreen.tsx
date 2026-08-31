import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { MainTabParamList } from '../types/navigation.types';
import { ScamCategory } from '../types/scam.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { EmptyState } from '../components/EmptyState';
import { AnalysisResultModal, AnalysisResultData } from '../components/AnalysisResultModal';
import { scanHistoryStorage, ScanHistoryItem } from '../storage/scanHistory';
import { useTheme } from '../hooks/useTheme';

type Props = BottomTabScreenProps<MainTabParamList, 'History'>;

type TypeFilter = 'all' | ScamCategory;
type RiskFilter = 'all' | 'scam' | 'suspicious' | 'safe';

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TypeFilter>('all');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskFilter>('all');

  // Modal State for Viewing Detailed Report
  const [activeModalItem, setActiveModalItem] = useState<AnalysisResultData | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await scanHistoryStorage.getHistory();
      setHistoryItems(data);
    } catch (err) {
      console.warn('Failed to fetch history:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const handleDeleteItem = (id: string, summary: string) => {
    Alert.alert(
      'Delete History Log',
      `Remove "${summary}" from your local history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await scanHistoryStorage.deleteScan(id);
            await loadHistory();
          },
        },
      ],
    );
  };

  const handleClearAllHistory = () => {
    Alert.alert(
      'Clear Complete Scan History',
      'Are you sure you want to permanently delete all scan history logs? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await scanHistoryStorage.clearHistory();
            await loadHistory();
          },
        },
      ],
    );
  };

  const mapHistoryToModalData = (item: ScanHistoryItem): AnalysisResultData => ({
    id: item.id,
    verdict: item.verdict,
    riskScore: item.riskScore,
    riskLevel: item.riskLevel,
    category: item.category,
    confidencePercentage: item.confidencePercentage,
    explanation: item.explanation,
    redFlags: item.redFlags,
    recommendedActions: item.recommendations,
    extractedMetrics: item.extractedMetrics,
  });

  // Filter items
  const filteredItems = historyItems.filter((item) => {
    if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) {
      return false;
    }
    if (selectedRiskFilter === 'scam' && item.verdict !== 'SCAM' && item.verdict !== 'CRITICAL') {
      return false;
    }
    if (selectedRiskFilter === 'suspicious' && item.verdict !== 'SUSPICIOUS') {
      return false;
    }
    if (selectedRiskFilter === 'safe' && item.verdict !== 'SAFE') {
      return false;
    }
    return true;
  });

  const getTypeIcon = (type: ScamCategory): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'sms':
        return 'chatbox-ellipses-outline';
      case 'upi_vpa':
        return 'at-circle-outline';
      case 'url':
        return 'link-outline';
      case 'screenshot':
        return 'qr-code-outline';
      default:
        return 'shield-checkmark-outline';
    }
  };

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <ScreenWrapper>
      {/* App Header with Notification Icon */}
      <AppHeader
        title="Audit History"
        subtitle="Saved scan assessments & threat logs"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* Top Header Bar with Clear All History */}
      <View style={styles.topHeaderSubBar}>
        <Text style={[styles.historyCountText, { color: theme.colors.textSecondary }]}>
          {filteredItems.length} Logs Saved
        </Text>
        {historyItems.length > 0 && (
          <TouchableOpacity onPress={handleClearAllHistory} style={styles.clearHeaderBtn}>
            <Ionicons name="trash-bin-outline" size={14} color={theme.colors.danger} />
            <Text style={[styles.clearHeaderBtnText, { color: theme.colors.danger }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Privacy Guarantee Banner */}
      <View style={[styles.privacyBanner, { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}30` }]}>
        <Ionicons name="lock-closed" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.privacyBannerText, { color: theme.colors.textSecondary }]}>
          Privacy Protection: Sensitive credentials (UPI PIN, OTP, Passwords, Card numbers) are never stored in history logs.
        </Text>
      </View>

      {/* Type Filters Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {[
          { key: 'all', label: 'All Types' },
          { key: 'sms', label: 'SMS Messages' },
          { key: 'upi_vpa', label: 'UPI IDs' },
          { key: 'url', label: 'URL Links' },
          { key: 'screenshot', label: 'Screenshots' },
        ].map((tab) => {
          const isActive = selectedTypeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.typeFilterChip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.cardBackground,
                  borderColor: isActive ? theme.colors.primaryLight : theme.colors.cardBorder,
                },
              ]}
              onPress={() => setSelectedTypeFilter(tab.key as TypeFilter)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: isActive ? '#0B1120' : theme.colors.textSecondary,
                    fontWeight: isActive ? '800' : '600',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Risk Filter Chips */}
      <View style={styles.riskFilterRow}>
        {[
          { key: 'all', label: 'All Risks' },
          { key: 'scam', label: 'Scams / Critical' },
          { key: 'suspicious', label: 'Suspicious' },
          { key: 'safe', label: 'Safe' },
        ].map((chip) => {
          const isActive = selectedRiskFilter === chip.key;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[
                styles.riskChip,
                {
                  backgroundColor: isActive ? `${theme.colors.primary}20` : 'transparent',
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedRiskFilter(chip.key as RiskFilter)}
            >
              <Text
                style={[
                  styles.riskChipText,
                  { color: isActive ? theme.colors.primary : theme.colors.textMuted },
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* History Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          iconName="time-outline"
          title="No History Logs Found"
          description="Scan results for SMS, UPI IDs, Web URLs, and Payment Screenshots will automatically appear here."
          actionTitle="Analyze Threat Now"
          onActionPress={() => navigation.navigate('Analyze', {})}
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.colors.primary} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setActiveModalItem(mapHistoryToModalData(item))}>
              <Card style={styles.historyCard} variant="bordered">
                <View style={styles.historyCardHeader}>
                  <View style={styles.typeBadgeRow}>
                    <View style={[styles.typeIconBox, { backgroundColor: `${theme.colors.primary}18` }]}>
                      <Ionicons name={getTypeIcon(item.type)} size={16} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.categoryTitleText, { color: theme.colors.textPrimary }]}>
                      {item.category}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteItem(item.id, item.inputSummary)}
                    style={styles.deleteIconBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.inputSummaryText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {item.inputSummary}
                </Text>

                <View style={styles.historyCardFooter}>
                  <RiskBadge
                    level={
                      item.riskLevel === 'CRITICAL'
                        ? 'critical'
                        : item.riskLevel === 'HIGH'
                        ? 'high_risk'
                        : item.riskLevel === 'MEDIUM'
                        ? 'caution'
                        : 'safe'
                    }
                    customText={`${item.verdict} (${item.riskScore}/100)`}
                    size="small"
                  />
                  <Text style={[styles.timestampText, { color: theme.colors.textMuted }]}>
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Detailed Analysis Result Modal */}
      <AnalysisResultModal
        visible={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        result={activeModalItem}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  topHeaderSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  clearHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  clearHeaderBtnText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  privacyBannerText: {
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 11,
  },
  riskFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  riskChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  riskChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  historyCard: {
    padding: 14,
    marginBottom: 10,
  },
  historyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryTitleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  deleteIconBtn: {
    padding: 4,
  },
  inputSummaryText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  historyCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  timestampText: {
    fontSize: 11,
  },
});
