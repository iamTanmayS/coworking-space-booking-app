import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, FlatList } from 'react-native';
import { Icon } from '@/components';
import { colors, typography, radius, shadow } from '@/index';
import ImageModal from '@/components/reusable_components/ImageModal';
import type { Review } from '@/features/reviews/review.type';
import { useReviewCardViewModel } from '../../../viewmodels/reviews/useReviewCardViewModel';

export interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const {
        isExpanded,
        selectedImageIndex,
        modalVisible,
        toggleDescription,
        openImageModal,
        closeImageModal,
        formatDate,
    } = useReviewCardViewModel();

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Icon
                    key={i}
                    name={i < review.rating ? "star" : "star-outline"}
                    library="ionicons"
                    size={16}
                    color={i < review.rating ? colors.warning : colors.border}
                />
            );
        }
        return stars;
    };

    return (
        <View style={styles.container}>
            {/* User Info */}
            <View style={styles.header}>
                <Image
                    source={{ uri: review.user.userImage }}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{review.user.username}</Text>
                    <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
                </View>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
                {renderStars()}
            </View>

            {/* Title */}
            <Text style={styles.title}>{review.title}</Text>

            {/* Description */}
            <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 2}
            >
                {review.description}
            </Text>
            {review.description.length > 100 && (
                <Pressable onPress={toggleDescription}>
                    <Text style={styles.readMore}>
                        {isExpanded ? 'Read less' : 'Read more'}
                    </Text>
                </Pressable>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <FlatList
                    data={review.images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.imagesContainer}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => openImageModal(index)}>
                            <Image source={{ uri: item }} style={styles.reviewImage} />
                        </Pressable>
                    )}
                />
            )}

            {/* Image Modal */}
            {selectedImageIndex !== null && review.images && (
                <ImageModal
                    visible={modalVisible}
                    images={review.images}
                    initialIndex={selectedImageIndex}
                    onClose={closeImageModal}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: radius.lg,
        marginBottom: 12,
        ...shadow.sm,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: colors.border,
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    date: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 8,
    },
    title: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    description: {
        fontSize: typography.fontSize.sm,
        lineHeight: 20,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    readMore: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
        marginBottom: 12,
    },
    imagesContainer: {
        gap: 8,
        marginTop: 12,
    },
    reviewImage: {
        width: 100,
        height: 100,
        borderRadius: radius.md,
        backgroundColor: colors.border,
    },
});
