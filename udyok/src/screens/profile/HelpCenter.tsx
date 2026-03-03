import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    category: 'Booking',
    questions: [
      { q: 'How do I book a workspace?', a: 'You can book a workspace by navigating to the Explore tab, selecting a space, choosing your desired date and time, and proceeding to checkout.' },
      { q: 'Can I cancel or modify my booking?', a: 'Yes, you can cancel or modify your booking from the Profile tab under Booking Management. Cancellations made 24 hours prior to the start time are fully refundable.' },
      { q: 'How do I know if my booking is confirmed?', a: 'Once your payment is successful, you will see a confirmation screen and receive an email/notification. Your booking will also appear in the Upcoming bookings section.' }
    ]
  },
  {
    category: 'Payments & Wallet',
    questions: [
      { q: 'What payment methods do you accept?', a: 'We accept major credit/debit cards, UPI, and payments via your in-app wallet balance.' },
      { q: 'How do I add money to my wallet?', a: 'Go to Profile > Wallet > Add Money. Enter the amount and select your preferred payment method to top up.' },
      { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption and securely process payments through our trusted payment gateways like Stripe.' }
    ]
  },
  {
    category: 'Account',
    questions: [
      { q: 'How do I reset my password?', a: 'You can reset your password by going to Profile > Settings > Password Manager.' },
      { q: 'How do I delete my account?', a: 'To delete your account, please contact our support team from this Help Center page.' }
    ]
  }
];

export default function HelpCenter() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<string | null>(null);

  const categories = ['All', ...FAQ_DATA.map(d => d.category)];

  const toggleExpand = (index: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Filter FAQs based on search query and selected category
  const filteredData = FAQ_DATA.map(section => {
    if (selectedCategory !== 'All' && section.category !== selectedCategory) return null;

    const matchedQs = section.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedQs.length === 0) return null;

    return { ...section, questions: matchedQs };
  }).filter(Boolean);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" library="material" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="How can we help you?"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Icon
              name="close"
              library="material"
              size={20}
              color={colors.textSecondary}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={{ paddingRight: spacing.lg }}
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryTab,
                selectedCategory === cat && styles.categoryTabActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {filteredData.length > 0 ? (
            filteredData.map((section, sIdx) => (
              <View key={`section-${sIdx}`}>
                {selectedCategory === 'All' && !searchQuery && (
                  <Text style={styles.sectionHeader}>{section?.category}</Text>
                )}

                {section?.questions.map((item, qIdx) => {
                  const uniqueKey = `${sIdx}-${qIdx}`;
                  const isExpanded = expandedIndex === uniqueKey;

                  return (
                    <TouchableOpacity
                      key={uniqueKey}
                      style={styles.faqCard}
                      onPress={() => toggleExpand(uniqueKey)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.faqRow}>
                        <Text style={[styles.questionText, isExpanded && styles.questionTextActive]}>
                          {item.q}
                        </Text>
                        <Icon
                          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                          library="material"
                          size={24}
                          color={isExpanded ? colors.primary : colors.textSecondary}
                        />
                      </View>

                      {isExpanded && (
                        <Text style={styles.answerText}>{item.a}</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search-off" library="material" size={48} color={colors.border} />
              <Text style={styles.emptyStateText}>No related questions found.</Text>
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Support Button Footer */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Contact Customer Support"
          onPress={() => {
            // Action to open email / support chat
          }}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    ...shadow.sm,
    height: 50,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
  },
  categoriesContainer: {
    paddingLeft: spacing.lg,
    marginBottom: spacing.xl,
    maxHeight: 40,
  },
  categoryTab: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.background,
  },
  categoryTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.surface,
  },
  faqContainer: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  faqCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  faqRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  questionTextActive: {
    color: colors.primary,
  },
  answerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  }
});
