import React from 'react';
import {
    View,
    Text,
    Modal,
    ScrollView,
    Pressable,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import DateSelector from './DateSelector';
import TimeSlotSelector from './TimeSlotSelector';
import { useBookingScheduleViewModel } from '@/viewmodels/booking/useBookingScheduleViewModel';
import type { SpaceDetail } from '@/features/spaces/spaces.types';

interface BookingModalProps {
    visible: boolean;
    space: SpaceDetail;
    onClose: () => void;
    onContinue: (bookingData: {
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: number;
        duration: number;
    }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
    visible,
    space,
    onClose,
    onContinue,
}) => {
    const {
        selectedDate,
        selectedStartTime,
        selectedEndTime,
        setSelectedDate,
        setSelectedStartTime,
        setSelectedEndTime,
        dates,
        startTimes,
        endTimes,
        validateBooking,
        calculateDuration,
        calculateTotalPrice,
    } = useBookingScheduleViewModel({
        spaceSchedule: space.schedule,
    });

    const handleContinue = () => {
        const validation = validateBooking(selectedDate, selectedStartTime, selectedEndTime);

        if (!validation.isValid) {
            // You can show an alert or toast here
            alert(validation.error);
            return;
        }

        if (selectedDate && selectedStartTime && selectedEndTime) {
            const duration = calculateDuration(selectedStartTime, selectedEndTime);
            const totalPrice = calculateTotalPrice(
                selectedStartTime,
                selectedEndTime,
                space.pricePerHour
            );

            onContinue({
                date: selectedDate,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                totalPrice,
                duration,
            });
        }
    };

    const canContinue = selectedDate && selectedStartTime && selectedEndTime;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <View style={styles.statusRow}>
                                <Text style={styles.statusText}>{space.category}</Text>
                                <View style={styles.ratingContainer}>
                                    <Icon
                                        name="star"
                                        library="material"
                                        size={16}
                                        color={colors.warning}
                                    />
                                    <Text style={styles.ratingText}>
                                        {(space.rating ?? 0).toFixed(1)} ({space.totalReviews ?? 0} reviews)
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.spaceName}>{space.name}</Text>
                            <Text style={styles.location}>{space.location.address}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainer}
                    >
                        <Text style={styles.sectionTitle}>BOOK A SPACE</Text>

                        {/* Date Selector */}
                        <DateSelector
                            dates={dates}
                            selectedDate={selectedDate}
                            onSelectDate={setSelectedDate}
                        />

                        {/* Arriving Time */}
                        <TimeSlotSelector
                            label="Arriving Time"
                            timeSlots={startTimes}
                            selectedTime={selectedStartTime}
                            onSelectTime={setSelectedStartTime}
                            disabled={!selectedDate}
                        />

                        {/* Exit Time */}
                        <TimeSlotSelector
                            label="Exit Time"
                            timeSlots={endTimes}
                            selectedTime={selectedEndTime}
                            onSelectTime={setSelectedEndTime}
                            disabled={!selectedStartTime}
                        />

                        {/* Price Summary */}
                        {canContinue && (
                            <View style={styles.priceSummary}>
                                <Text style={styles.priceSummaryLabel}>Total Price</Text>
                                <Text style={styles.priceSummaryValue}>
                                    {space.currency}
                                    {calculateTotalPrice(
                                        selectedStartTime,
                                        selectedEndTime,
                                        space.pricePerHour
                                    ).toFixed(2)}
                                    <Text style={styles.durationText}>
                                        {' '}
                                        (
                                        {calculateDuration(selectedStartTime!, selectedEndTime!)}{' '}
                                        hrs)
                                    </Text>
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Continue Button */}
                    <View style={styles.footer}>
                        <PrimaryButton
                            title="Continue"
                            onPress={handleContinue}
                            disabled={!canContinue}
                            fullWidth
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default BookingModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.overlay,
    },
    backdrop: {
        flex: 1,
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        maxHeight: '90%',
        ...shadow.md,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    headerTop: {
        gap: spacing.xs,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xs / 2,
    },
    statusText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.primary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    spaceName: {
        fontSize: typography.fontSize.xl,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
    },
    location: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    content: {
        maxHeight: 500, // Set explicit height instead of flex: 1
    },
    contentContainer: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: typography.fontSize.xs,
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 1,
        marginBottom: spacing.lg,
    },
    priceSummary: {
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceSummaryLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    priceSummaryValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.primary,
    },
    durationText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '400',
        color: colors.textSecondary,
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
});
