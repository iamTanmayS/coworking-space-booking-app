import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '@/index';

interface DateSlot {
    date: Date;
    dayName: string;
    dayNumber: number;
    monthName: string;
    isAvailable: boolean;
}

interface DateSelectorProps {
    dates: DateSlot[];
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
    dates,
    selectedDate,
    onSelectDate,
}) => {
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Day</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {dates.map((dateSlot, index) => {
                    const selected = isSelected(dateSlot.date);
                    const today = isToday(dateSlot.date);
                    const disabled = !dateSlot.isAvailable;

                    return (
                        <Pressable
                            key={index}
                            style={[
                                styles.dateButton,
                                selected && styles.dateButtonSelected,
                                disabled && styles.dateButtonDisabled,
                            ]}
                            onPress={() => !disabled && onSelectDate(dateSlot.date)}
                            disabled={disabled}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    selected && styles.dayLabelSelected,
                                    disabled && styles.dayLabelDisabled,
                                ]}
                            >
                                {today ? 'Today' : dateSlot.dayName}
                            </Text>
                            <Text
                                style={[
                                    styles.dateNumber,
                                    selected && styles.dateNumberSelected,
                                    disabled && styles.dateNumberDisabled,
                                ]}
                            >
                                {dateSlot.dayNumber} {dateSlot.monthName}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default DateSelector;

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: typography.fontSize.lg,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    scrollContent: {
        gap: spacing.sm,
        paddingRight: spacing.md,
    },
    dateButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateButtonSelected: {
        backgroundColor: colors.primary,
    },
    dateButtonDisabled: {
        backgroundColor: colors.disabled,
        opacity: 0.5,
    },
    dayLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    dayLabelSelected: {
        color: colors.textInverse,
    },
    dayLabelDisabled: {
        color: colors.textSecondary,
    },
    dateNumber: {
        fontSize: typography.fontSize.md,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    dateNumberSelected: {
        color: colors.textInverse,
    },
    dateNumberDisabled: {
        color: colors.textSecondary,
    },
});
