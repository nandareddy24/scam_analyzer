import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { AppHeader } from '../components/AppHeader';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { RiskBadge } from '../components/RiskBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  SCAM_ARTICLES,
  QUICK_SAFETY_RULES,
  ScamArticle,
} from '../constants/scamEducationData';
import { useTheme } from '../hooks/useTheme';

type Props = BottomTabScreenProps<MainTabParamList, 'Safety'>;

export const SafetyScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<ScamArticle | null>(null);

  // Filter articles based on search query
  const filteredArticles = SCAM_ARTICLES.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  });

  const handleCallHelpline = () => {
    Linking.openURL('tel:1930');
  };

  const handleOpenPortal = () => {
    Linking.openURL('https://cybercrime.gov.in');
  };

  return (
    <ScreenWrapper scrollable>
      {/* App Header */}
      <AppHeader
        title="Scam Awareness"
        subtitle="Cybersecurity education & threat guides"
        onNotificationPress={() => navigation.navigate('Settings')}
      />

      {/* Emergency Cyber Helpline Card */}
      <Card style={[styles.helplineCard, { backgroundColor: 'rgba(239, 68, 68, 0.14)', borderColor: theme.colors.danger }]}>
        <View style={styles.helplineHeaderRow}>
          <View style={[styles.helplineIconBox, { backgroundColor: theme.colors.danger }]}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.helplineTitle, { color: theme.colors.textPrimary }]}>
              Victim of Cyber Fraud? Call 1930
            </Text>
            <Text style={[styles.helplineSub, { color: theme.colors.textSecondary }]}>
              National Cyber Crime Reporting Helpline (Govt of India)
            </Text>
          </View>
        </View>

        <View style={styles.helplineActionRow}>
          <TouchableOpacity style={[styles.callBtn, { backgroundColor: theme.colors.danger }]} onPress={handleCallHelpline}>
            <Ionicons name="call-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.callBtnText}>Call 1930 Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.portalBtn, { backgroundColor: `${theme.colors.primary}20`, borderColor: theme.colors.primary }]}
            onPress={handleOpenPortal}
          >
            <Ionicons name="globe-outline" size={16} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.portalBtnText, { color: theme.colors.primary }]}>cybercrime.gov.in</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Quick Safety Rules Section */}
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="shield-checkmark" size={20} color={theme.colors.safe} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Quick Golden Safety Rules
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rulesScroll}>
        {QUICK_SAFETY_RULES.map((rule) => (
          <Card key={rule.id} style={styles.ruleCard} variant="bordered">
            <View style={[styles.ruleIconCircle, { backgroundColor: `${rule.color}1E`, borderColor: `${rule.color}40` }]}>
              <Ionicons name={rule.icon as any} size={22} color={rule.color} />
            </View>
            <Text style={[styles.ruleTitle, { color: theme.colors.textPrimary }]}>{rule.title}</Text>
            <Text style={[styles.ruleDesc, { color: theme.colors.textSecondary }]} numberOfLines={3}>
              {rule.description}
            </Text>
          </Card>
        ))}
      </ScrollView>

      {/* Search Input for Scam Guides */}
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="book-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
          Scam Threat Library ({SCAM_ARTICLES.length} Guides)
        </Text>
      </View>

      <Input
        placeholder="Search scam types (e.g. KYC, Digital Arrest, PIN, QR Code)..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        iconName="search-outline"
        onClear={() => setSearchQuery('')}
        containerStyle={{ marginBottom: 16 }}
      />

      {/* Educational Articles List */}
      <View style={styles.articlesGrid}>
        {filteredArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            activeOpacity={0.85}
            onPress={() => setSelectedArticle(article)}
          >
            <Card style={styles.articleCard} variant="bordered">
              <View style={styles.articleHeaderRow}>
                <View style={[styles.articleIconBox, { backgroundColor: `${theme.colors.primary}1A` }]}>
                  <Ionicons name={article.icon as any} size={22} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.articleTitle, { color: theme.colors.textPrimary }]}>
                    {article.title}
                  </Text>
                  <Text style={[styles.articleCategory, { color: theme.colors.primary }]}>
                    {article.category}
                  </Text>
                </View>
                <RiskBadge
                  level={article.severity === 'critical' ? 'critical' : article.severity === 'high' ? 'high_risk' : 'caution'}
                  size="small"
                />
              </View>

              <Text style={[styles.articleSummary, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                {article.summary}
              </Text>

              <View style={styles.readMoreRow}>
                <Text style={[styles.readMoreText, { color: theme.colors.primary }]}>Read Full Guide</Text>
                <Ionicons name="arrow-forward" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Full Article Reader Modal */}
      <Modal
        visible={!!selectedArticle}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedArticle(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.modalArticleTitle, { color: theme.colors.textPrimary, ...theme.typography.h3 }]}>
                  {selectedArticle?.title}
                </Text>
                <Text style={[styles.articleCategory, { color: theme.colors.primary }]}>
                  {selectedArticle?.category}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedArticle(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {selectedArticle && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                {/* 1. What is the scam? */}
                <Card variant="bordered" style={styles.guideSectionCard}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="help-circle-outline" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                    <Text style={[styles.guideHeading, { color: theme.colors.textPrimary }]}>
                      1. What is the Scam?
                    </Text>
                  </View>
                  <Text style={[styles.guideText, { color: theme.colors.textSecondary }]}>
                    {selectedArticle.whatIsIt}
                  </Text>
                </Card>

                {/* 2. How it works */}
                <Card variant="bordered" style={styles.guideSectionCard}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="git-network-outline" size={20} color={theme.colors.caution} style={{ marginRight: 8 }} />
                    <Text style={[styles.guideHeading, { color: theme.colors.textPrimary }]}>
                      2. How It Works
                    </Text>
                  </View>
                  {selectedArticle.howItWorks.map((step, idx) => (
                    <View key={idx} style={styles.listStepRow}>
                      <View style={[styles.stepNumberBadge, { backgroundColor: `${theme.colors.primary}20` }]}>
                        <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>{idx + 1}</Text>
                      </View>
                      <Text style={[styles.guideListText, { color: theme.colors.textSecondary }]}>{step}</Text>
                    </View>
                  ))}
                </Card>

                {/* 3. Warning signs */}
                <Card variant="bordered" style={styles.guideSectionCard}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="warning-outline" size={20} color={theme.colors.caution} style={{ marginRight: 8 }} />
                    <Text style={[styles.guideHeading, { color: theme.colors.textPrimary }]}>
                      3. Key Warning Signs
                    </Text>
                  </View>
                  {selectedArticle.warningSigns.map((sign, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Ionicons name="alert-circle" size={16} color={theme.colors.caution} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[styles.guideListText, { color: theme.colors.textSecondary }]}>{sign}</Text>
                    </View>
                  ))}
                </Card>

                {/* 4. What NOT to do */}
                <Card variant="bordered" style={[styles.guideSectionCard, { borderColor: 'rgba(239, 68, 68, 0.4)' }]}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="ban-outline" size={20} color={theme.colors.danger} style={{ marginRight: 8 }} />
                    <Text style={[styles.guideHeading, { color: theme.colors.danger }]}>
                      4. What NOT to Do
                    </Text>
                  </View>
                  {selectedArticle.whatNotToDo.map((item, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={styles.noSymbol}>🛑</Text>
                      <Text style={[styles.guideListText, { color: theme.colors.textPrimary, fontWeight: '700' }]}>{item}</Text>
                    </View>
                  ))}
                </Card>

                {/* 5. What to do if targeted */}
                <Card variant="bordered" style={[styles.guideSectionCard, { borderColor: 'rgba(16, 185, 129, 0.4)' }]}>
                  <View style={styles.guideHeaderRow}>
                    <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.safe} style={{ marginRight: 8 }} />
                    <Text style={[styles.guideHeading, { color: theme.colors.safe }]}>
                      5. What to Do If Targeted
                    </Text>
                  </View>
                  {selectedArticle.whatToDoIfTargeted.map((item, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Ionicons name="checkmark-circle" size={16} color={theme.colors.safe} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[styles.guideListText, { color: theme.colors.textPrimary }]}>{item}</Text>
                    </View>
                  ))}
                </Card>

                <PrimaryButton
                  title="Close Guide"
                  onPress={() => setSelectedArticle(null)}
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
  helplineCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  helplineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helplineIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  helplineTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  helplineSub: {
    fontSize: 11,
    marginTop: 2,
  },
  helplineActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  portalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  portalBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontWeight: '800',
  },
  rulesScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ruleCard: {
    width: 210,
    padding: 14,
    borderRadius: 14,
    marginRight: 10,
  },
  ruleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 10,
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  articlesGrid: {
    marginBottom: 20,
  },
  articleCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  articleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  articleCategory: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  articleSummary: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalArticleTitle: {
    fontWeight: '900',
  },
  closeBtn: {
    padding: 4,
  },
  guideSectionCard: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  guideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  guideText: {
    fontSize: 13,
    lineHeight: 19,
  },
  listStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '900',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noSymbol: {
    marginRight: 8,
    fontSize: 13,
  },
  guideListText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
