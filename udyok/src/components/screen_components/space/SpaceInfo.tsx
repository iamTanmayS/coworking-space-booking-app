import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { Icon } from '@/components'
import { colors, typography, shadow, radius } from '@/index'

export interface SpaceInfoProps {
    name: string;
    location: string;
    review: string;
    reviewCount: string;
    category: string;
}

const SpaceInfo = ({ name, location, review, reviewCount, category }: SpaceInfoProps) => {
    return (
        <View style={styles.container}>
            {/* Header Row: Category & Rating */}
            <View style={styles.headerRow}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{category}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Icon name="star" library="material" size={20} color="#FBBF24" />
                    <Text style={styles.ratingText}>
                        {review} <Text style={styles.reviewCountText}>({reviewCount} reviews)</Text>
                    </Text>
                </View>
            </View>

            {/* Title & Action Button Row */}
            <View style={styles.titleRow}>
                <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
                <Pressable style={styles.actionButton}>
                    <Icon name="paper-plane" library="ionicons" size={20} color={colors.background} />
                </Pressable>
            </View>

            {/* Location Row */}
            <View style={styles.locationRow}>
                <Icon name="location-sharp" library="ionicons" size={16} color={colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
            </View>
        </View>
    )
}

export default SpaceInfo

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    categoryBadge: {
        backgroundColor: `${colors.primary}15`, // 15% opacity version of primary
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: radius.sm,
    },
    categoryText: {
        color: colors.primary,
        fontSize: typography.fontSize.xs,
        // fontFamily: typography.fontFamily.medium,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 4,
        fontSize: typography.fontSize.xs,
        color: colors.textPrimary,
        fontWeight: '500',
    },
    reviewCountText: {
        color: colors.textSecondary,
        fontWeight: '400',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    nameText: {
        flex: 1,
        fontSize: typography.fontSize.lg,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginRight: 12,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadow.md,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        marginLeft: 4,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
});