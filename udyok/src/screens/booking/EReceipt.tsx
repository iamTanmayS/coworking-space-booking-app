import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { ScreenWrapper } from '@/components';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

type EReceiptRoute = RouteProp<{
  EReceipt: {
    bookingId: string;
    spaceName: string;
    totalAmount: number;
    duration: number;
    date: string;
    startTime: string;
    endTime: string;
    paymentLabel: string;
    fees: number;
  };
}>;

export default function EReceipt() {
  const navigation = useNavigation();
  const route = useRoute<EReceiptRoute>();
  const {
    bookingId, spaceName, totalAmount, duration, date, startTime, endTime,
    paymentLabel, fees
  } = route.params || {};

  const hourlyRate = duration > 0 ? ((totalAmount ?? 0) - (fees ?? 0)) / duration : 0;

  // QR payload encodes the booking receipt data
  const qrPayload = JSON.stringify({
    bookingId,
    space: spaceName,
    date,
    startTime,
    endTime,
    total: totalAmount,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Udyok booking at ${spaceName}\nBooking ID: ${bookingId}\nDate: ${date} | ${startTime} – ${endTime}\nTotal: ₹${Number(totalAmount ?? 0).toFixed(2)}`,
      });
    } catch {
      Alert.alert('Error', 'Could not share the receipt.');
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            library="material"
            size={24}
            color={colors.textPrimary}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>E-Receipt</Text>
          <Icon
            name="share-outline"
            library="ionicons"
            size={22}
            color={colors.primary}
            onPress={handleShare}
          />
        </View>

        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconCircle}>
            <Icon name="checkmark" library="ionicons" size={32} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>Your booking is confirmed</Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.card}>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <QRCode
              value={qrPayload || 'udyok-booking'}
              size={160}
              backgroundColor="white"
              color={colors.textPrimary}
            />
            <Text style={styles.qrHint}>Scan at the space entrance</Text>
          </View>

          {/* Dashed divider */}
          <View style={styles.dashedDivider} />

          {/* Space & booking details */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Space</Text>
              <Text style={styles.value} numberOfLines={1}>{spaceName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Booking ID</Text>
              <Text style={[styles.value, styles.mono]} numberOfLines={1}>
                {(bookingId ?? '').slice(0, 12)}…
              </Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          {/* Schedule */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Arriving</Text>
              <Text style={styles.value}>{date}  ·  {startTime}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Exit</Text>
              <Text style={styles.value}>{date}  ·  {endTime}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{duration} hr{duration !== 1 ? 's' : ''}</Text>
            </View>
          </View>

          <View style={styles.thinDivider} />

          {/* Price breakdown */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Hourly Rate</Text>
              <Text style={styles.value}>₹{Number(hourlyRate ?? 0).toFixed(2)} /hr</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Platform Fees</Text>
              <Text style={styles.value}>₹{Number(fees ?? 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{Number(totalAmount ?? 0).toFixed(2)}</Text>
          </View>

          <View style={styles.thinDivider} />

          {/* Payment method & date */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{paymentLabel || 'Wallet'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Transaction Date</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
          </View>

        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PrimaryButton
          title="Back to Home"
          onPress={() => (navigation as any).navigate('MainTabs')}
          fullWidth
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  successBanner: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadow.md,
  },
  successTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.md,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: '#fff',
  },
  qrHint: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dashedDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  thinDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  section: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  totalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
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
    ...shadow.md,
  },
});
