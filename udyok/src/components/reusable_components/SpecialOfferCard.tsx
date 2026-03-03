import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography } from '@/index';

const { width } = Dimensions.get('window');

export interface SpecialOfferCardProps {
    title?: string;
    subtitle?: string;
    discount?: string;
    badgeText?: string;
    image?: any;
    onClaim?: () => void;
}

const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
    title = 'Get Special Offer',
    subtitle = 'All Services Available | T&C Applied',
    discount = '40',
    badgeText = 'Limited time!',
    image,
    onClaim,
}) => {
    return (
        <View style={styles.container}>
            {image && (
                <Image source={image} style={styles.image} resizeMode="cover" />
            )}

            {/* Horizontal Gradient: Black to Transparent */}
            <LinearGradient
                colors={['#101010', 'rgba(16,16,16,0.95)', 'rgba(16,16,16,0.7)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradient}
            />

            <View style={styles.content}>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{badgeText}</Text>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.discountRow}>
                        <Text style={styles.upToText}>Up to</Text>
                        <View style={styles.discountWrapper}>
                            <Text style={styles.discountText}>{discount}</Text>
                            <View style={styles.percentBadge}>
                                <Text style={styles.percentSymbol}>%</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer Text with maxWidth to prevent overlap with button */}
                <Text style={styles.footerText} numberOfLines={1}>
                    {subtitle}
                </Text>

                <Pressable
                    style={styles.claimButton}
                    onPress={onClaim}
                    android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
                >
                    <Text style={styles.claimButtonText}>Claim</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        height: 150, // Reduced from 160
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#101010',
        marginRight: spacing.md,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    badgeContainer: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: spacing.xs,
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
    },
    mainInfo: {
        marginTop: 2,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        marginBottom: 0,
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    upToText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: typography.fontFamily.medium,
        marginRight: 6,
    },
    discountWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    discountText: {
        color: '#fff',
        fontSize: 48,
        lineHeight: 56,
        fontFamily: typography.fontFamily.bold,
        includeFontPadding: false,
    },
    percentBadge: {
        backgroundColor: colors.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        marginTop: 8,
    },
    percentSymbol: {
        color: '#fff',
        fontSize: 10,
        fontFamily: typography.fontFamily.bold,
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 10,
        fontFamily: typography.fontFamily.regular,
        marginTop: 'auto',
        maxWidth: '65%', // Limit width to avoid overlap with button
    },
    claimButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: typography.fontFamily.bold,
    },
});

export default SpecialOfferCard;
