import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ScreenWrapper, Icon } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { useCancelBookingMutation, useGetBookingQuery } from '@/features/booking/booking.api';

type CancelBookingRoute = RouteProp<{
  CancelBooking: { bookingId: string };
}>;

export default function CancelBooking() {
  const route = useRoute<CancelBookingRoute>();
  const navigation = useNavigation();
  const { bookingId } = route.params || {};
  const [reason, setReason] = useState('');

  const { data: booking, isLoading: isLoadingBooking } = useGetBookingQuery(bookingId, {
    skip: !bookingId
  });

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const handleCancel = async () => {
    if (!bookingId) return;

    try {
      await cancelBooking(bookingId).unwrap();
      Alert.alert('Booking Cancelled', 'Your booking has been successfully cancelled.', [
        {
          text: 'OK',
          onPress: () => {
            // @ts-ignore
            navigation.navigate('MyBookings');
          }
        }
      ]);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      Alert.alert('Error', 'Failed to cancel the booking. Please try again.');
    }
  };

  if (isLoadingBooking) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            library="material"
            size={24}
            color={colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Cancel Booking</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.warningText}>
          Are you sure you want to cancel this booking? Please note that this action cannot be undone.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Refund Policy</Text>
          <Text style={styles.cardDescription}>
            • 100% refund if cancelled 24 hours prior to the start time.{'\n'}
            • 50% refund if cancelled within 24 hours.{'\n'}
            • No refund for no-shows.
          </Text>
        </View>

        {booking && (
          <View style={styles.summaryBox}>
            <View style={styles.row}>
              <Text style={styles.label}>Refund Amount (Est.)</Text>
              <Text style={styles.value}>₹{Number(booking.totalAmount || 0).toFixed(2)}</Text>
            </View>
            <Text style={styles.note}>Refund will be processed to your original payment method within 3-5 business days.</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reason for Cancellation (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Tell us why you're cancelling..."
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            textAlignVertical="top"
          />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={isCancelling ? "Cancelling..." : "Confirm Cancellation"}
          onPress={handleCancel}
          disabled={isCancelling || !bookingId}
          fullWidth
          style={styles.cancelButton}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  warningText: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: '#FFF3E0', // Light orange warning bg
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: '#E65100', // Deep orange
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.fontSize.sm,
    color: '#E65100',
    lineHeight: 20,
  },
  summaryBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  note: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    gap: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  value: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    minHeight: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    backgroundColor: colors.error, // Red button for destructive action
  },
});
