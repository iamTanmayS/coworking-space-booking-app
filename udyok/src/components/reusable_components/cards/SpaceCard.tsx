import React from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';
import type { SpaceListItem } from '@/features/spaces/spaces.types';
import Icon from '@/components/reusable_components/icons/Icon';
import { colors, radius, shadow } from '@/index';
import { fontSize, spacing, iconSize } from '@/index';
import { moderateScale } from 'react-native-size-matters';
import { useSpaceCardViewModel } from '@/viewmodels/reuseable_components/cards/SpaceCardViewModel';
import FavoriteButton from '@/components/reusable_components/Buttons/FavoriteButton';

export interface SpaceCardProps {
    space: SpaceListItem;
}

const SpaceCard = ({ space }: SpaceCardProps) => {
    const { onPress, isFavorite } = useSpaceCardViewModel(space);

    return (
        // Outer View — FavoriteButton lives here directly so it gets its own touches
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                android_ripple={{ color: colors.ripple }}
                style={styles.pressable}
            >
                {/* Top Section - Image and Content Side by Side */}
                <View style={styles.topSection}>
                    {/* Left - Image (no FavoriteButton here — overflow:hidden would block it) */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: space.thumbnail }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Right - Content */}
                    <View style={styles.contentContainer}>
                        {/* Category Badge and Rating */}
                        <View style={styles.topRow}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{space.category}</Text>
                            </View>
                            <View style={styles.ratingContainer}>
                                <Icon
                                    name="star"
                                    library="material"
                                    size={16}
                                    color={colors.warning}
                                />
                                <Text style={styles.ratingText}>{Number(space.rating ?? 0).toFixed(1)}</Text>
                            </View>
                        </View>

                        {/* Space Name */}
                        <Text style={styles.spaceName} numberOfLines={1}>
                            {space.name}
                        </Text>

                        {/* Location */}
                        <View style={styles.locationRow}>
                            <Icon
                                name="location-on"
                                library="material"
                                size={14}
                                color={colors.textSecondary}
                            />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {space.city}
                            </Text>
                        </View>

                        {/* Price */}
                        <Text style={styles.price}>
                            {space.currency}{Number(space.pricePerHour ?? 0).toFixed(2)}
                            <Text style={styles.priceUnit}>/hr</Text>
                        </Text>
                    </View>
                </View>

                {/* Bottom Info Row - Full Width */}
                <View style={styles.infoRow}>
                    {/* Travel Time */}
                    <View style={styles.infoItem}>
                        <Icon
                            name="directions-run"
                            library="material"
                            size={18}
                            color={colors.primary}
                        />
                        <Text style={styles.infoText}>
                            {space.travelTimeMin != null ? String(space.travelTimeMin).padStart(2, '0') : '--'} Mins
                        </Text>
                    </View>

                    {/* Distance */}
                    <View style={styles.infoItem}>
                        <Icon
                            name="location-on"
                            library="material"
                            size={18}
                            color={colors.primary}
                        />
                        <Text style={styles.infoText}>
                            {space.distanceKm != null ? Number(space.distanceKm).toFixed(1) : '--'} Km
                        </Text>
                    </View>

                    {/* Open/Closed Status */}
                    <View style={styles.infoItem}>
                        <Icon
                            name="access-time"
                            library="material"
                            size={18}
                            color={colors.primary}
                        />
                        <Text style={styles.infoText}>
                            {space.isOpenNow ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                </View>
            </Pressable>

            {/* FavoriteButton Overlay */}
            <View style={styles.favoriteOverlay} pointerEvents="box-none">
                <FavoriteButton
                    spaceId={space.id}
                    isFavorite={isFavorite}
                    size={20}
                />
            </View>
        </View>
    );
};

export default SpaceCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        ...shadow.md,
        overflow: 'visible', // allow FavoriteButton to receive touch outside cardPressable
    },
    pressable: {
        width: '100%',
        padding: spacing.md,
        borderRadius: radius.lg,
    },
    topSection: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        gap: spacing.md,
    },
    imageContainer: {
        position: 'relative',
        width: moderateScale(120),
        height: moderateScale(120),
        borderRadius: radius.md,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteOverlay: {
        position: 'absolute',
        top: spacing.md + spacing.xs,   // padding + internal spacing
        left: spacing.md + moderateScale(120) - 36 - spacing.xs, // padding + image width - button width - spacing
        zIndex: 20,
        elevation: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs / 2,
    },
    categoryBadge: {
        backgroundColor: colors.primary + '15',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs / 2,
        borderRadius: radius.sm,
    },
    categoryText: {
        color: colors.primary,
        fontSize: fontSize.xs,
        fontWeight: '600',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingText: {
        color: colors.textPrimary,
        fontSize: fontSize.md,
        fontWeight: '700',
    },
    spaceName: {
        fontSize: fontSize.lg,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
        lineHeight: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
        gap: 3,
    },
    locationText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        flex: 1,
    },
    price: {
        fontSize: fontSize.xl,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -0.5,
    },
    priceUnit: {
        fontSize: fontSize.sm,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        fontWeight: '600',
    },
});