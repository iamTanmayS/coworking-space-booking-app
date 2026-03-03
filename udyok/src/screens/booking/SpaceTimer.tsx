import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ScreenWrapper, Icon } from '@/components';
import { colors, spacing, typography, radius } from '@/index';
import CircularTimer from '@/components/specific_components/booking/CircularTimer';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';

type SpaceTimerRoute = RouteProp<{
  SpaceTimer: {
    bookingId: string;
    spaceName?: string;
    userName?: string;
    spaceType?: string;
    allocatedSpace?: string;
    startTime?: string;
    endTime?: string;
    date?: string;
    totalAmount?: number;
  };
}>;

export default function SpaceTimer() {
  const navigation = useNavigation();
  const route = useRoute<SpaceTimerRoute>();
  const {
    spaceName = 'WorkHub Connect',
    userName = 'Esther Howard',
    spaceType = 'Open Space',
    allocatedSpace = 'A52',
    startTime = '07:00 AM',
    endTime = '04:00 PM',
    date = '04 Oct',
    totalAmount = 87.00
  } = route.params || {};

  // Helper function to parse time "HH:mm" (24h) or "HH:mm AM/PM"
  const getDateTime = (dateStr: string, timeStr: string) => {
    const now = new Date();
    let targetDate = new Date();

    // Parse Date
    if (dateStr.includes('-')) {
      // YYYY-MM-DD
      targetDate = new Date(dateStr);
    } else {
      // "04 Oct" format - append current year
      const currentYear = now.getFullYear();
      const parsed = new Date(`${dateStr} ${currentYear}`);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    // Parse Time
    let hours = 0;
    let minutes = 0;

    if (timeStr.includes(' ')) {
      // "HH:mm AM/PM"
      const [time, modifier] = timeStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else {
      // "HH:mm" (24h)
      const [h, m] = timeStr.split(':').map(Number);
      hours = h;
      minutes = m;
    }

    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
  };

  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const [totalSeconds, setTotalSeconds] = React.useState(0); // For progress calculation if needed

  React.useEffect(() => {
    if (!startTime || !endTime || !date) return;

    const start = getDateTime(date, startTime);
    const end = getDateTime(date, endTime);

    // Calculate total duration
    const duration = (end.getTime() - start.getTime()) / 1000;
    setTotalSeconds(duration > 0 ? duration : 0);

    const updateTimer = () => {
      const now = new Date();
      const secondsLeft = (end.getTime() - now.getTime()) / 1000;
      setRemainingSeconds(Math.max(0, Math.floor(secondsLeft)));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, date]);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" library="material" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Space Timer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.timerContainer}>
          <CircularTimer
            totalSeconds={totalSeconds}
            remainingSeconds={remainingSeconds}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsGrid}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userName}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Space</Text>
              <Text style={styles.value}>{spaceName}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Space Type</Text>
              <Text style={styles.value}>{spaceType}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Allocated Space</Text>
              <Text style={styles.value}>{allocatedSpace}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Arrive Time</Text>
              <Text style={styles.value}>{startTime}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Exit Time</Text>
              <Text style={styles.value}>{endTime}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{date}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Total Payment</Text>
              <Text style={styles.value}>₹{totalAmount}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Extend Space Time"
          onPress={() => console.log('Extend Time')}
          fullWidth
        />
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.lg,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: spacing.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 1,
  },
  detailsGrid: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  }
});
