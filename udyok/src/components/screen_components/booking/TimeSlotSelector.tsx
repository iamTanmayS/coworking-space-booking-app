import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '@/index';

interface TimeSlot {
    value: string;
    label: string;
}

interface TimeSlotSelectorProps {
    label: string;
    timeSlots: TimeSlot[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    disabled?: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
    label,
    timeSlots,
    selectedTime,
    onSelectTime,
    disabled = false,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {timeSlots.length === 0 ? (
                    <Text style={styles.emptyText}>
                        {disabled ? 'Select a date first' : 'No available times'}
                    </Text>
                ) : (
                    timeSlots.map((slot, index) => {
                        const selected = selectedTime === slot.value;

                        return (
                            <Pressable
                                key={index}
                                style={[
                                    styles.timeButton,
                                    selected && styles.timeButtonSelected,
                                ]}
                                onPress={() => onSelectTime(slot.value)}
                            >
                                <Text
                                    style={[
                                        styles.timeText,
                                        selected && styles.timeTextSelected,
                                    ]}
                                >
                                    {slot.label}
                                </Text>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

export default TimeSlotSelector;

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
    timeButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        backgroundColor: colors.surface,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeButtonSelected: {
        backgroundColor: colors.primary,
    },
    timeText: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    timeTextSelected: {
        color: colors.textInverse,
    },
    emptyText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
});
