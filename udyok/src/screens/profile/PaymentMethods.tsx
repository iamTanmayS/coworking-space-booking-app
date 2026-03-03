import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import {
  useGetPaymentMethodsQuery,
  useSetDefaultPaymentMethodMutation,
  useRemovePaymentMethodMutation,
  useAddPaymentMethodMutation
} from '@/features/wallet/wallet.api';

export default function PaymentMethods() {
  const navigation = useNavigation();
  const { data: methods, isLoading, refetch } = useGetPaymentMethodsQuery();
  const [setDefault, { isLoading: isSettingDefault }] = useSetDefaultPaymentMethodMutation();
  const [removeMethod, { isLoading: isRemoving }] = useRemovePaymentMethodMutation();
  const [addMethod, { isLoading: isAdding }] = useAddPaymentMethodMutation();

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id).unwrap();
    } catch (err) {
      Alert.alert('Error', 'Failed to set default payment method');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMethod(id).unwrap();
            } catch (err) {
              Alert.alert('Error', 'Failed to remove payment method');
            }
          }
        }
      ]
    );
  };

  const handleMockAddCard = async () => {
    try {
      await addMethod({
        type: 'card',
        details: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
      }).unwrap();
      refetch();
    } catch (err) {
      Alert.alert('Error', 'Failed to add mock card');
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'card': return 'credit-card';
      case 'upi': return 'account-balance';
      case 'wallet': return 'account-balance-wallet';
      default: return 'payment';
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          methods?.map((pm) => (
            <TouchableOpacity
              key={pm.id}
              style={[styles.card, pm.isDefault && styles.cardDefault]}
              onPress={() => handleSetDefault(pm.id)}
              disabled={pm.isDefault || isSettingDefault}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Icon name={getIconForType(pm.type)} library="material" size={28} color={pm.isDefault ? colors.primary : colors.textSecondary} />
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.methodType}>{pm.type.toUpperCase()}</Text>
                  <Text style={styles.methodDetails}>{pm.details}</Text>
                </View>

                {pm.isDefault ? (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(pm.id)}
                    disabled={isRemoving}
                  >
                    <Icon name="delete-outline" library="material" size={24} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {methods?.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Icon name="credit-card" library="material" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No payment methods saved</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={isAdding ? 'Adding...' : 'Add New Card (Mock)'}
          onPress={handleMockAddCard}
          disabled={isAdding}
          fullWidth
        />
      </View>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  cardDefault: {
    borderColor: colors.primary,
    backgroundColor: '#F5FBFF', // light tint
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  detailsContainer: {
    flex: 1,
  },
  methodType: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  defaultBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  defaultText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButton: {
    padding: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  }
});
