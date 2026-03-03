import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@/components';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import Icon from '@/components/reusable_components/icons/Icon';
import { colors, spacing, typography, radius } from '@/index';

type PaymentSuccessRoute = RouteProp<{
  PaymentSuccess: {
    bookingId: string;
    spaceName: string;
    totalAmount: number;
    date: string;
    startTime: string;
    endTime: string;
  };
}>;

export default function PaymentSuccess() {
  const route = useRoute<PaymentSuccessRoute>();
  const navigation = useNavigation();
  const { bookingId, spaceName, totalAmount, date, startTime, endTime } =
    route.params || {};

  const handleViewETicket = () => {
    // @ts-ignore
    navigation.navigate('ETicket', { bookingId });
  };

  const handleBackToHome = () => {
    // @ts-ignore
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="check-circle" library="material" size={80} color={colors.success} />
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>Your booking has been confirmed</Text>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Space</Text>
            <Text style={styles.detailValue}>{spaceName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {startTime} - {endTime}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.totalLabel}>Amount Paid</Text>
            <Text style={styles.totalValue}>₹{Number(totalAmount || 0).toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="View E-Ticket"
            onPress={handleViewETicket}
            fullWidth
          />
          <PrimaryButton
            title="Back to Home"
            onPress={handleBackToHome}
            variant="secondary"
            fullWidth
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.success,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
});
