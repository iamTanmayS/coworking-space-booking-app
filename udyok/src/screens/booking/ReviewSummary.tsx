import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { usePaymentViewModel } from '@/viewmodels/booking/usePaymentViewModel';
import { NotificationService } from '@/services/NotificationService';
import { useGetBalanceQuery } from '@/features/wallet/wallet.api';


type ReviewSummaryRoute = RouteProp<{
  ReviewSummary: {
    spaceId: string;
    spaceName: string;
    totalAmount: number;
    duration: number;
    date: string;
    startTime: string;
    endTime: string;
    paymentMethodId: string;
    paymentLabel: string;
    paymentIcon: string;
    spaceImage?: string;
    spaceLocation?: string;
    spaceRating?: number;
  };
}>;

export default function ReviewSummary() {
  const navigation = useNavigation();
  const route = useRoute<ReviewSummaryRoute>();
  const {
    spaceId, spaceName, totalAmount, duration, date, startTime, endTime,
    paymentMethodId, paymentLabel, paymentIcon,
    spaceImage, spaceLocation, spaceRating
  } = route.params || {};

  const { processPayment, isProcessing, error } = usePaymentViewModel();
  const { data: walletData, isLoading: isLoadingWallet } = useGetBalanceQuery();

  const isWalletPayment = paymentMethodId === 'wallet';
  const hasInsufficientFunds = isWalletPayment && (walletData?.balance || 0) < totalAmount;

  // Mock fees calculation
  const fees = 15.00;
  const hourlyRate = (totalAmount - fees) / duration;

  const handleConfirmPayment = async () => {
    try {
      // Process payment using the paymentMethodId passed from AddCard/PaymentMethod
      const result = await processPayment(totalAmount, spaceId, paymentMethodId);

      if (result.success) {
        // Trigger push notification
        NotificationService.notifyBookingSuccess(spaceName, date);

        // Navigate to EReceipt
        // @ts-ignore
        navigation.navigate('EReceipt', {
          bookingId: result.bookingId,
          spaceName,
          totalAmount,
          date,
          startTime,
          endTime,
          paymentLabel,
          duration,
          fees
        });
      } else {
        Alert.alert('Payment Failed', 'Please try again.');
      }

    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            library="material"
            size={24}
            color={colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Review Summary</Text>
        </View>

        {/* Space Info Card */}
        <View style={styles.card}>
          <View style={styles.spaceRow}>
            {/* Image */}
            <Image
              source={{ uri: spaceImage || 'https://via.placeholder.com/150' }}
              style={styles.spaceImage}
            />

            <View style={styles.spaceInfo}>
              <View style={styles.topInfoRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Open Space</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Icon name="star" library="material" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{spaceRating || '4.9'}</Text>
                </View>
              </View>

              <Text style={styles.spaceName}>{spaceName}</Text>

              <View style={styles.locationRow}>
                <Icon name="location-on" library="material" size={14} color={colors.textSecondary} />
                <Text style={styles.locationText}>
                  {spaceLocation || 'New York, USA'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Arriving Time</Text>
            <Text style={styles.value}>{date} | {startTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Exit Time</Text>
            <Text style={styles.value}>{date} | {endTime}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Price Breakdown */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Amount</Text>
            <Text style={styles.value}>₹{Number(hourlyRate || 0).toFixed(2)} /hr</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Hours</Text>
            <Text style={styles.value}>{duration}:00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fees</Text>
            <Text style={styles.value}>₹{Number(fees || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.row, { marginTop: spacing.md }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{Number(totalAmount || 0).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment Method */}
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Icon name={paymentIcon} library="material" size={20} color={colors.primary} />
            <Text style={styles.value}>{paymentLabel}</Text>
          </View>
          <Text style={styles.changeText} onPress={() => navigation.goBack()}>Change</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {hasInsufficientFunds && (
          <Text style={styles.errorText}>
            Insufficient wallet balance. (Balance: ₹{walletData?.balance || 0})
          </Text>
        )}
        <PrimaryButton
          title={isProcessing ? "Processing..." : "Continue"}
          onPress={handleConfirmPayment}
          disabled={isProcessing || hasInsufficientFunds || isLoadingWallet}
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
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  spaceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spaceImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  spaceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  spaceName: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  changeText: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.sm,
  }
});
