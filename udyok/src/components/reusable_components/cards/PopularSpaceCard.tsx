import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { colors, spacing, radius, typography } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';
import FavoriteButton from '@/components/reusable_components/Buttons/FavoriteButton';

const { width } = Dimensions.get('window');
import { useSpaceCardViewModel } from "@/viewmodels/reuseable_components/cards/SpaceCardViewModel"
import { SpaceListItem } from '@/features/spaces/spaces.types';

export interface PopularSpaceCardProps {
    space: SpaceListItem;
}

const PopularSpaceCard: React.FC<PopularSpaceCardProps> = ({ space }) => {
    const { onPress, isFavorite } = useSpaceCardViewModel(space);

    return (
        <View style={styles.container}>
            {/* Entire card tap → navigates to detail */}
            <Pressable onPress={onPress} style={styles.cardPressable}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: space.thumbnail }} style={styles.image} resizeMode="cover" />

                    {/* Rating Badge */}
                    <View style={styles.ratingBadge}>
                        <Icon library="ionicons" name="star" size={12} color="#FFB800" />
                        <Text style={styles.ratingText}>{Number(space.rating ?? 0).toFixed(1)}</Text>
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>{space.category}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>{space.currency}{Number(space.pricePerHour ?? 0).toFixed(2)}</Text>
                            <Text style={styles.priceUnit}>/hr</Text>
                        </View>
                    </View>

                    <Text style={styles.title} numberOfLines={1}>{space.name}</Text>
                    <View style={styles.divider} />

                    <View style={styles.footer}>
                        <View style={styles.infoItem}>
                            <Icon library="ionicons" name="time-outline" size={14} color={colors.textSecondary} />
                            <Text style={styles.infoText}>
                                {space.travelTimeMin != null ? space.travelTimeMin : '--'} Mins
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon library="ionicons" name="location-sharp" size={16} color={colors.primary} />
                            <Text style={styles.infoText}>
                                {space.distanceKm != null ? Number(space.distanceKm).toFixed(1) : '--'} Km
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Icon library="ionicons" name="time" size={16} color={colors.primary} />
                            <Text style={styles.infoText}>{space.isOpenNow ? 'Open' : 'Closed'}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            {/*
              Overlay View — absolutely positioned, small enough to just wrap the FavoriteButton.
              pointerEvents="box-none" means THIS view passes touches through to the card below,
              but its CHILDREN (FavoriteButton) still receive their own touches independently.
              This is same pattern as the working SpaceDetailHeader.
            */}
            <View style={styles.favoriteOverlay} pointerEvents="box-none">
                <FavoriteButton spaceId={space.id} isFavorite={isFavorite} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width - (spacing.lg * 2),
        backgroundColor: '#fff',
        borderRadius: radius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        // overflow removed — FavoriteButton is positioned absolutey on this View and needs to receive touches
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardPressable: {
        width: '100%',
        borderRadius: radius.lg,
        overflow: 'hidden', // clip image corners here instead
    },
    imageContainer: {
        height: 140,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    ratingBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.md,
        gap: 4,
    },
    ratingText: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.bold,
        color: colors.textPrimary,
    },
    favoriteOverlay: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        zIndex: 20,
        elevation: 20,
    },
    content: {
        padding: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    typeBadge: {
        backgroundColor: 'rgba(26, 182, 92, 0.1)', // Light green
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    typeText: {
        color: colors.primary,
        fontSize: 10,
        fontFamily: typography.fontFamily.medium,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.bold,
        color: colors.primary,
    },
    priceUnit: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        marginLeft: 2,
    },
    title: {
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.semiBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 11,
        color: colors.textSecondary,
        fontFamily: typography.fontFamily.medium,
    },
});

export default PopularSpaceCard;
