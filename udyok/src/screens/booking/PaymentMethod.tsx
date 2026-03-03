import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

type PaymentMethodRoute = RouteProp<{
  PaymentMethod: {
    spaceId: string;
    spaceName: string;
    totalAmount: number;
    duration: number;
    date: string;
    startTime: string;
    endTime: string;
    spaceImage?: string;
    spaceLocation?: string;
    spaceRating?: number;
  };
}>;

export default function PaymentMethod() {
  const navigation = useNavigation();
  const route = useRoute<PaymentMethodRoute>();
  const params = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState('wallet');

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleAddCard = () => {
    // Navigate to AddCard screen
    // @ts-ignore
    navigation.navigate('AddCard', params);
  };

  const methods = [
    { id: 'paypal', label: 'Paypal', icon: 'paypal', library: 'font-awesome' },
    { id: 'apple', label: 'Apple Pay', icon: 'apple', library: 'font-awesome' },
    { id: 'google', label: 'Google Pay', icon: 'google', library: 'font-awesome' },
  ];

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            library="material"
            size={24}
            color={colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Payment Methods</Text>
        </View>

        {/* Wallet Section */}
        <Text style={styles.sectionTitle}>Wallet</Text>
        <TouchableOpacity
          style={styles.methodCard}
          onPress={() => handleMethodSelect('wallet')}
        >
          <View style={styles.methodLeft}>
            <Icon name="account-balance-wallet" library="material" size={24} color={colors.primary} />
            <Text style={styles.methodLabel}>Wallet</Text>
          </View>
          <View style={styles.radio}>
            {selectedMethod === 'wallet' && <View style={styles.radioSelected} />}
          </View>
        </TouchableOpacity>

        {/* Credit & Debit Card */}
        <Text style={styles.sectionTitle}>Credit & Debit Card</Text>
        <TouchableOpacity
          style={styles.methodCard}
          onPress={handleAddCard}
        >
          <View style={styles.methodLeft}>
            <Icon name="credit-card" library="material" size={24} color={colors.textSecondary} />
            <Text style={styles.methodLabel}>Add Card</Text>
          </View>
          <Icon name="chevron-right" library="material" size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* More Options */}
        <Text style={styles.sectionTitle}>More Payment Options</Text>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.methodCard}
            onPress={() => handleMethodSelect(method.id)}
          >
            <View style={styles.methodLeft}>
              {/* Using simple icons for demo */}
              <Icon name="payment" library="material" size={24} color={colors.textPrimary} />
              <Text style={styles.methodLabel}>{method.label}</Text>
            </View>
            <View style={styles.radio}>
              {selectedMethod === method.id && <View style={styles.radioSelected} />}
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      {/* Footer Button - Only for Wallet/Other (Add Card handles its own flow) */}
      {selectedMethod !== 'card' && (
        <View style={styles.footer}>
          <PrimaryButton
            title="Confirm Payment Method"
            onPress={() => {
              // Navigate to ReviewSummary with selected method (mocked for non-card)
              // @ts-ignore
              navigation.navigate('ReviewSummary', {
                ...params,
                paymentMethodId: selectedMethod, // Mock ID
                paymentLabel: selectedMethod === 'wallet' ? 'Wallet' : 'Other',
                paymentIcon: 'account-balance-wallet'
              });
            }}
            fullWidth
          />
        </View>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  methodLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  }
});
