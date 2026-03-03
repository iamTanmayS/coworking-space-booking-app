import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { ScreenWrapper, Icon } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import { useGetBookingQuery } from '@/features/booking/booking.api';

type ETicketRoute = RouteProp<{
  ETicket: { bookingId: string };
}>;

export default function ETicket() {
  const route = useRoute<ETicketRoute>();
  const navigation = useNavigation();
  const { bookingId } = route.params || {};

  const { data: booking, isLoading } = useGetBookingQuery(bookingId, {
    skip: !bookingId
  });

  if (isLoading || !booking) {
    return (
      <ScreenWrapper style={styles.centerContainer}>
        <Text style={styles.loadingText}>Generating your E-Ticket...</Text>
      </ScreenWrapper>
    );
  }

  const qrData = JSON.stringify({
    b: booking.id,
    u: booking.userId,
    s: booking.spaceId,
  });

  const formattedDate = booking.startDate
    ? new Date(booking.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <ScreenWrapper backgroundColor={colors.primary}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" library="material" size={24} color={colors.background} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Ticket</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.ticketCard}>

          {/* Top Section - QR Code */}
          <View style={styles.qrSection}>
            <Text style={styles.scanText}>Scan this QR code at the entrance</Text>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={200}
                color={colors.textPrimary}
                backgroundColor={colors.background}
              />
            </View>
            <Text style={styles.bookingId}>Booking ID: {booking.id.split('-')[0].toUpperCase()}</Text>
          </View>

          {/* Divider Line */}
          <View style={styles.dividerContainer}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Bottom Section - Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.spaceName}>Workspace {booking.spaceId.slice(-4)}</Text>
            <Text style={styles.location}>Central Business District</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{formattedDate}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Check In</Text>
                <Text style={styles.value}>{booking.startTime}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Check Out</Text>
                <Text style={styles.value}>{booking.endTime}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                <Text style={styles.label}>Guest</Text>
                <Text style={styles.value}>Tanmay Shukla</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  loadingText: {
    color: colors.background,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
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
    color: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.md,
  },
  qrSection: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  scanText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  qrWrapper: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.sm,
    marginBottom: spacing.lg,
  },
  bookingId: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: colors.background,
  },
  cutoutLeft: {
    width: 20,
    height: 40,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.primary,
    marginLeft: -1,
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginHorizontal: spacing.md,
  },
  cutoutRight: {
    width: 20,
    height: 40,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: colors.primary,
    marginRight: -1,
  },
  detailsSection: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  spaceName: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
