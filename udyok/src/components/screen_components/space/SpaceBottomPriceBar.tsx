import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '@/components/reusable_components/Buttons/PrimaryButton';
import { colors, spacing, typography, shadow } from '@/index';

interface SpaceBottomPriceBarProps {
    price: number;
    currency: string;
    isOpen: boolean;
    onBookNow: () => void;
}

const SpaceBottomPriceBar: React.FC<SpaceBottomPriceBarProps> = ({
    price,
    currency,
    isOpen,
    onBookNow,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Total Price</Text>
                <Text style={styles.priceValue}>
                    {currency}{(price ?? 0).toFixed(2)} <Text style={styles.priceUnit}>/hr</Text>
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <PrimaryButton
                    title={isOpen ? "Book Now" : "Closed"}
                    onPress={onBookNow}
                    size="lg"
                    disabled={!isOpen}
                />
            </View>
        </View>
    );
};

export default SpaceBottomPriceBar;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        ...shadow.md,
        elevation: 8,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    priceValue: {
        fontFamily: typography.fontFamily.bold,
        fontSize: typography.fontSize.xl,
        color: colors.primary,
    },
    priceUnit: {
        fontFamily: typography.fontFamily.regular,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    buttonContainer: {
        marginLeft: spacing.md,
    },
});
