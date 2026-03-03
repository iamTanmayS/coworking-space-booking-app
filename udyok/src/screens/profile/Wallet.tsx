import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import { useGetBalanceQuery, useGetTransactionsQuery } from '@/features/wallet/wallet.api';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

export default function Wallet() {
  const navigation = useNavigation();
  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useGetBalanceQuery();
  const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useGetTransactionsQuery();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchBalance(), refetchTransactions()]);
    setRefreshing(false);
  }, [refetchBalance, refetchTransactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          {isLoadingBalance ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text style={styles.balanceAmount}>₹{Number(balanceData?.balance || 0).toFixed(2)}</Text>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddMoney' as never)}>
              <View style={styles.actionIconContainer}>
                <Icon name="add" library="material" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Add Money</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PaymentMethods' as never)}>
              <View style={styles.actionIconContainer}>
                <Icon name="credit-card" library="material" size={24} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>Payment Methods</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {isLoadingTransactions ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          transactions && transactions.length > 0 ? (
            transactions.map((tx: any) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={styles.txLeft}>
                  <View style={[styles.txIconContainer, tx.type === 'credit' ? styles.txIconCredit : styles.txIconDebit]}>
                    <Icon
                      name={tx.type === 'credit' ? 'arrow-downward' : 'arrow-upward'}
                      library="material"
                      size={20}
                      color={tx.type === 'credit' ? '#4CAF50' : '#F44336'}
                    />
                  </View>
                  <View>
                    <Text style={styles.txDescription} numberOfLines={1}>{tx.description}</Text>
                    <Text style={styles.txDate}>{formatDate(tx.timestamp)} • {formatTime(tx.timestamp)}</Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, tx.type === 'credit' ? styles.txAmountCredit : styles.txAmountDebit]}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                  </Text>
                  <Text style={styles.txStatus}>{tx.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt" library="material" size={48} color={colors.border} />
              <Text style={styles.emptyText}>No recent transactions</Text>
            </View>
          )
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
  balanceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginVertical: spacing.lg,
    ...shadow.md,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.fontSize.md,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: colors.surface,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  txIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txIconCredit: {
    backgroundColor: '#E8F5E9',
  },
  txIconDebit: {
    backgroundColor: '#FFEBEE',
  },
  txDescription: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  txDate: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  txAmountCredit: {
    color: '#4CAF50',
  },
  txAmountDebit: {
    color: '#F44336',
  },
  txStatus: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'capitalize',
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
  }
});
