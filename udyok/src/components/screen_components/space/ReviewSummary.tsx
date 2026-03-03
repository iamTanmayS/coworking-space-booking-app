import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Icon } from '@/components';
import { colors, typography, radius, shadow } from '@/index';

export interface ReviewSummaryProps {
    averageRating: number;
    totalReviews: number;
    summary: string;
    onWriteReview?: () => void;
}

export default function ReviewSummary({ averageRating, totalReviews, summary, onWriteReview }: ReviewSummaryProps) {
    const renderStars = (size: number = 16) => {
        const stars = [];
        const fullStars = Math.floor(averageRating ?? 0);
        const hasHalfStar = (averageRating ?? 0) % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Icon key={i} name="star" library="ionicons" size={size} color={colors.warning} />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Icon key={i} name="star-half" library="ionicons" size={size} color={colors.warning} />
                );
            } else {
                stars.push(
                    <Icon key={i} name="star-outline" library="ionicons" size={size} color={colors.border} />
                );
            }
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* AI Summary Title */}
            <Text style={styles.summaryTitle}>{summary}</Text>

            {/* Rating Row */}
            <View style={styles.ratingRow}>
                <View style={styles.starsContainer}>
                    {renderStars(18)}
                </View>
                <Text style={styles.ratingText}>
                    {(averageRating ?? 0).toFixed(1)} ({totalReviews ?? 0} {(totalReviews ?? 0) === 1 ? 'review' : 'reviews'})
                </Text>
            </View>

            {/* Write Review Button */}
            {onWriteReview && (
                <Pressable style={styles.writeButton} onPress={onWriteReview}>
                    <Icon name="create-outline" library="ionicons" size={20} color={colors.primary} />
                    <Text style={styles.writeButtonText}>Write a Review</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: radius.lg,
        marginBottom: 16,
        ...shadow.sm,
    },
    summaryTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
        lineHeight: 24,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    ratingText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.background,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    writeButtonText: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.primary,
    },
});
