import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ScreenWrapper, Icon } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import WriteReviewModal from '@/components/screen_components/space/WriteReviewModal';
import { useGetBookingQuery } from '@/features/booking/booking.api';
import { useCreateReviewMutation } from '@/features/reviews/reviews.api';

type BookingDetailRoute = RouteProp<{
  BookingDetail: { bookingId: string };
}>;

export default function BookingDetail() {
  const route = useRoute<BookingDetailRoute>();
  const navigation = useNavigation();
  const { bookingId } = route.params || {};

  const { data: booking, isLoading, isError, error } = useGetBookingQuery(bookingId, {
    skip: !bookingId
  });

  // Review modal
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();

  const handleReviewSubmit = useCallback(async (data: { rating: number; title: string; description: string }) => {
    if (!booking?.spaceId) return;
    try {
      await createReview({ spaceId: booking.spaceId, data }).unwrap();
      setReviewModalVisible(false);
      Alert.alert('Thank you!', 'Your review has been submitted successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      throw err;
    }
  }, [booking?.spaceId, createReview]);

  // Calculate duration
  const duration = useMemo(() => {
    if (!booking) return 0;
    const start = parseInt(booking.startTime.split(':')[0]);
    const end = parseInt(booking.endTime.split(':')[0]);
    return end - start;
  }, [booking]);

  if (isLoading) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenWrapper>
    );
  }

  if (isError || !booking) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load booking details.</Text>
        <PrimaryButton title="Go Back" onPress={() => navigation.goBack()} />
      </ScreenWrapper>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'ongoing': return '#2196F3';
      case 'cancelled': return colors.error;
      case 'completed': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const formattedDate = booking.startDate
    ? new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

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
          <Text style={styles.headerTitle}>Booking Details</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>

        {/* Space Card Summary */}
        <View style={styles.card}>
          <View style={styles.spaceRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200&h=200' }}
              style={styles.spaceImage}
            />
            <View style={styles.spaceInfo}>
              <Text style={styles.spaceName}>Workspace {booking.spaceId.slice(-4)}</Text>
              <View style={styles.locationRow}>
                <Icon name="location-on" library="material" size={14} color={colors.textSecondary} />
                <Text style={styles.locationText}>Central Business District</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration} Hours ({booking.startTime} - {booking.endTime})</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.value}>₹{Number(booking.totalAmount || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Method</Text>
            <Text style={styles.value}>{booking.paymentMethodId ? 'Card / Wallet' : 'N/A'}</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        {/* Actions based on status */}
        {(booking.status === 'confirmed' || booking.status === 'pending') && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('CancelBooking', { bookingId: booking.id });
              }}
            >
              <Text style={styles.outlineBtnText}>Cancel Booking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.solidBtn}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('ETicket', { bookingId: booking.id });
              }}
            >
              <Text style={styles.solidBtnText}>View E-Ticket</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'completed' && (
          <PrimaryButton
            title="Leave a Review"
            onPress={() => setReviewModalVisible(true)}
            fullWidth
          />
        )}
      </View>

      {/* Write Review Modal */}
      <WriteReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
        isLoading={isCreatingReview}
      />
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
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    marginBottom: spacing.lg,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  spaceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spaceImage: {
    width: 70,
    height: 70,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  spaceInfo: {
    flex: 1,
    justifyContent: 'center',
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
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
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
    marginVertical: spacing.xl,
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
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: typography.fontSize.md,
  },
  solidBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  solidBtnText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: typography.fontSize.md,
  },
});
