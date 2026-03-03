import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '@/index';

export interface SpecialOfferCardProps {
    id?: string;
    title?: string;
    subtitle?: string;
    discount?: string;
    badgeText?: string;
    image: ImageSourcePropType;
    isClaiming?: boolean;
    onClaim?: () => void;
}

const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
    title = 'Get Special Offer',
    subtitle = 'All Services Available | T&C Applied',
    discount = '40',
    badgeText = 'Limited time!',
    image,
    isClaiming = false,
    onClaim,
}) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={image}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                <LinearGradient
                    colors={['#181A20', 'rgba(24, 26, 32, 0.95)', 'rgba(24, 26, 32, 0.7)', 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 0.85, y: 0.5 }}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        {/* Badge */}
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badgeText}</Text>
                        </View>

                        <View>
                            {/* Title */}
                            <Text style={styles.title}>{title}</Text>

                            {/* Discount Section */}
                            <View style={styles.discountContainer}>
                                <Text style={styles.upToText}>Up to</Text>
                                <View style={styles.discountCircle}>
                                    <Text style={styles.discountNumber}>{discount}</Text>
                                    <View style={styles.percentageContainer}>
                                        <Text style={styles.percentageSymbol}>%</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Subtitle */}
                            <Text style={styles.subtitle}>{subtitle}</Text>
                        </View>
                    </View>

                    {/* Claim Button */}
                    <Pressable
                        style={[styles.claimButton, isClaiming && { opacity: 0.8 }]}
                        onPress={onClaim}
                        disabled={isClaiming || !onClaim}
                        android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                    >
                        {isClaiming ? (
                            <ActivityIndicator size="small" color={colors.textInverse} />
                        ) : (
                            <Text style={styles.claimButtonText}>Claim</Text>
                        )}
                    </Pressable>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        marginVertical: spacing.md,
        borderRadius: radius.xl,
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    imageStyle: {
        borderRadius: radius.xl,
    },
    gradient: {
        flex: 1,
        padding: spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    content: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        paddingTop: spacing.xs,
    },
    badge: {
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.semiBold,
        color: colors.textPrimary,
    },
    title: {
        fontSize: 22,
        fontFamily: typography.fontFamily.bold,
        color: colors.textInverse,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.xs,
    },
    upToText: {
        fontSize: typography.fontSize.lg,
        fontFamily: typography.fontFamily.medium,
        color: colors.textInverse,
        marginRight: spacing.sm,
        marginBottom: 8,
    },
    discountCircle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    discountNumber: {
        fontSize: 48,
        fontFamily: typography.fontFamily.bold,
        color: colors.textInverse,
        lineHeight: 56,
    },
    percentageContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        marginTop: 8,
    },
    percentageSymbol: {
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
        color: colors.textInverse,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: typography.fontFamily.medium,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    claimButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: 12,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
        marginBottom: spacing.xs,
    },
    claimButtonText: {
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.bold,
        color: colors.textInverse,
    },
});

export default SpecialOfferCard;
