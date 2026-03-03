import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ReviewSummary from '@/components/screen_components/space/ReviewSummary';
import ReviewCard from '@/components/screen_components/space/ReviewCard';
import { colors, typography } from '@/index';
import { useReviewTabViewModel } from '../../../../viewmodels/reviews/useReviewTabViewModel';

export interface ReviewProps {
    spaceId: string;
    onWriteReview?: () => void;
}

export default function ReviewTab({ spaceId, onWriteReview }: ReviewProps) {
    const { reviews, summary, isLoading, error } = useReviewTabViewModel({ spaceId });

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No Reviews Yet</Text>
            </View>
        );
    }



    if (!reviews || reviews.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                {summary && (
                    <ReviewSummary
                        averageRating={summary.averageRating}
                        totalReviews={summary.totalReviews}
                        summary={summary.summary}
                        onWriteReview={onWriteReview}
                    />
                )}
                <Text style={styles.emptyText}>No reviews yet</Text>
                <Text style={styles.emptySubtext}>Be the first to review this space!</Text>
                {!summary && onWriteReview && (
                    <View style={{ marginTop: 20 }}>
                        <ReviewSummary
                            averageRating={0}
                            totalReviews={0}
                            summary="No summary available"
                            onWriteReview={onWriteReview}
                        />
                    </View>
                )}
            </View>
        );
    }

    return (
        <FlatList
            data={reviews}
            keyExtractor={(item) => item.reviewId}
            contentContainerStyle={styles.container}
            ListHeaderComponent={
                <ReviewSummary
                    averageRating={summary?.averageRating ?? 0}
                    totalReviews={summary?.totalReviews ?? reviews.length}
                    summary={summary?.summary ?? ''}
                    onWriteReview={onWriteReview}
                />
            }
            renderItem={({ item }) => <ReviewCard review={item} />}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 100, // Extra padding to account for bottom price bar
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: typography.fontSize.md,
        color: colors.error,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: typography.fontSize.lg,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});