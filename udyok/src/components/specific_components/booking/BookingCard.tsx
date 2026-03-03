import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';

interface BookingCardProps {
    image: string;
    badge: string;
    title: string;
    location: string;
    rating: number;
    price: string;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    onRebook?: () => void;
    onViewTicket?: () => void;
    onLeaveReview?: () => void;
    onPress?: () => void;
}

export default function BookingCard({
    image,
    badge,
    title,
    location,
    rating,
    price,
    status,
    onRebook,
    onViewTicket,
    onLeaveReview,
    onPress
}: BookingCardProps) {
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.contentRow}>
                <Image source={{ uri: image }} style={styles.image} />

                <View style={styles.details}>
                    <View style={styles.headerRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                        <View style={styles.ratingContainer}>
                            <Icon name="star" library="material" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>

                    <Text style={styles.title} numberOfLines={1}>{title}</Text>

                    <View style={styles.locationRow}>
                        <Icon name="location-on" library="material" size={14} color={colors.textSecondary} />
                        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
                    </View>

                    <Text style={styles.price}>{price} <Text style={styles.perHr}>/hr</Text></Text>
                </View>
            </View>

            {/* Status Badge for completed / cancelled */}
            {(isCompleted || isCancelled) && (
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: isCompleted ? colors.primary + '15' : colors.error + '15' }
                ]}>
                    <Icon
                        name={isCompleted ? 'check-circle' : 'cancel'}
                        library="material"
                        size={14}
                        color={isCompleted ? colors.primary : colors.error}
                    />
                    <Text style={[
                        styles.statusText,
                        { color: isCompleted ? colors.primary : colors.error }
                    ]}>
                        {isCompleted ? 'Completed' : 'Cancelled'}
                    </Text>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                {isCompleted ? (
                    <>
                        {onRebook && (
                            <TouchableOpacity style={styles.rebookButton} onPress={onRebook}>
                                <Text style={styles.rebookText}>Re-Book</Text>
                            </TouchableOpacity>
                        )}
                        {onViewTicket && (
                            <TouchableOpacity style={styles.ticketButton} onPress={onViewTicket}>
                                <Text style={styles.ticketText}>E-Receipt</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : isCancelled ? (
                    <>
                        {onRebook && (
                            <TouchableOpacity style={styles.rebookButton} onPress={onRebook}>
                                <Text style={styles.rebookText}>Re-Book</Text>
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <>
                        {onRebook && (
                            <TouchableOpacity style={styles.rebookButton} onPress={onRebook}>
                                <Text style={styles.rebookText}>Re-Book</Text>
                            </TouchableOpacity>
                        )}
                        {onViewTicket && (
                            <TouchableOpacity style={styles.ticketButton} onPress={onViewTicket}>
                                <Text style={styles.ticketText}>E-Ticket</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadow.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    contentRow: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
        gap: spacing.md,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: radius.md,
        backgroundColor: colors.background,
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    badgeText: {
        color: colors.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        fontSize: typography.fontSize.sm,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    title: {
        fontSize: typography.fontSize.md,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        flex: 1,
    },
    price: {
        fontSize: typography.fontSize.md,
        fontWeight: '700',
        color: colors.primary,
    },
    perHr: {
        fontSize: typography.fontSize.sm,
        fontWeight: '400',
        color: colors.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        marginBottom: spacing.sm,
    },
    statusText: {
        fontSize: typography.fontSize.xs,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    rebookButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rebookText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: typography.fontSize.md,
    },
    reviewButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    reviewText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
    },
    ticketButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticketText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: typography.fontSize.md,
    },
});
