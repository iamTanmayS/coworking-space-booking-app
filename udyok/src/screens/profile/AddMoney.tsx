import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { useAddFundsMutation } from '@/features/wallet/wallet.api';

export default function AddMoney() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('500');
  const [addFunds, { isLoading }] = useAddFundsMutation();

  const predefinedAmounts = ['100', '500', '1000', '2000'];

  const handleTopUp = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    try {
      // For this implementation, we just mock picking a payment method
      // by passing a hardcoded ID or omitting it (backend uses a mock method if so)
      await addFunds({ amount: numAmount, paymentMethodId: 'mock-card' }).unwrap();

      // Navigate to success screen
      navigation.navigate('TopUpSuccess' as never);

    } catch (err) {
      Alert.alert('Top Up Failed', 'There was an error adding funds to your wallet.');
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Add Money</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
          </View>

          <View style={styles.presetContainer}>
            {predefinedAmounts.map((amt) => (
              <PrimaryButton
                key={amt}
                title={`₹${amt}`}
                variant={amount === amt ? 'primary' : 'outline'}
                onPress={() => setAmount(amt)}
                style={styles.presetButton}
              />
            ))}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            title={isLoading ? 'Processing...' : 'Top Up Wallet'}
            onPress={handleTopUp}
            disabled={isLoading || !amount}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingBottom: 0,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  input: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.textPrimary,
    minWidth: 100,
    textAlign: 'center',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  presetButton: {
    minWidth: 80,
    flex: 0,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  }
});
