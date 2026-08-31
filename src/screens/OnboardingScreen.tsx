import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.types';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { PrimaryButton } from '../components/PrimaryButton';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

interface SlideItem {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  highlightText: string;
}

const ONBOARDING_SLIDES: SlideItem[] = [
  {
    id: 'slide_1',
    iconName: 'scan-circle-outline',
    title: 'Instant UPI ID & VPA Verification',
    description: 'Check suspicious payment handles before confirming transfers. Detect impersonation and fake support desk accounts.',
    highlightText: 'Never pay unverified VPAs',
  },
  {
    id: 'slide_2',
    iconName: 'chatbox-ellipses-outline',
    title: 'SMS Fraud & PIN Trap Scanner',
    description: 'Detect phishing SMS messages luring you to enter your UPI PIN to receive money or claim fake bank reward points.',
    highlightText: 'PIN is ONLY entered to deduct money',
  },
  {
    id: 'slide_3',
    iconName: 'link-outline',
    title: 'Phishing Link & Domain Defense',
    description: 'Inspect suspicious URLs in SMS and WhatsApp. Catch typosquatted bank domains and fraudulent utility payment portals.',
    highlightText: 'Real-time domain reputation check',
  },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('MainTabs', { screen: 'Home' });
    }
  };

  const slide = ONBOARDING_SLIDES[currentIndex];

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.topRow}>
        <Text style={[styles.brandText, { color: theme.colors.primary, ...theme.typography.subtitle1 }]}>
          UPI ScamGuard
        </Text>
        <TouchableOpacity
          onPress={() => navigation.replace('MainTabs', { screen: 'Home' })}
          style={styles.skipBtn}
        >
          <Text style={[styles.skipText, { color: theme.colors.textMuted, ...theme.typography.body2 }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContent}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${theme.colors.primary}12`, borderColor: `${theme.colors.primary}35` },
          ]}
        >
          <Ionicons name={slide.iconName} size={80} color={theme.colors.primary} />
        </View>

        <View style={[styles.badgeContainer, { backgroundColor: `${theme.colors.safe}1F` }]}>
          <Ionicons name="checkmark-circle" size={14} color={theme.colors.safe} style={{ marginRight: 4 }} />
          <Text style={[styles.badgeText, { color: theme.colors.safe }]}>{slide.highlightText}</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.textPrimary, ...theme.typography.h1 }]}>
          {slide.title}
        </Text>

        <Text style={[styles.description, { color: theme.colors.textSecondary, ...theme.typography.body1 }]}>
          {slide.description}
        </Text>
      </View>

      {/* Pagination Dots */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === currentIndex ? theme.colors.primary : theme.colors.border,
                  width: idx === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <PrimaryButton
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next Step'}
          onPress={handleNext}
          variant="cyber"
          icon={<Ionicons name="arrow-forward" size={18} color="#0B1120" />}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandText: {
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipBtn: {
    padding: 6,
  },
  skipText: {
    fontWeight: '600',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingBottom: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
