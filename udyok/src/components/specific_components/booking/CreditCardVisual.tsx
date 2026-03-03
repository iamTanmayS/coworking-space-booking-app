import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, radius, shadow } from '@/index';
import Icon from '@/components/reusable_components/icons/Icon';

interface CreditCardVisualProps {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
}

export default function CreditCardVisual({
    cardNumber = '4242 4242 4242 4242',
    cardHolder = 'Tanmay Shukla',
    expiryDate = '12/34',
    cvv = '123'
}: CreditCardVisualProps) {
    return (
        <LinearGradient
            colors={['#1A1A1A', '#4A4A4A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardContainer}
        >
            <View style={styles.topRow}>
                <Icon name="nfc" library="material" size={30} color="rgba(255,255,255,0.8)" />
                <Icon name="cc-visa" library="fontawesome" size={40} color="#fff" />
            </View>

            <View style={styles.chipRow}>
                <View style={styles.chip} />
            </View>

            <Text style={styles.cardNumber}>{cardNumber}</Text>

            <View style={styles.bottomRow}>
                <View>
                    <Text style={styles.label}>Card Holder</Text>
                    <Text style={styles.value}>{cardHolder}</Text>
                </View>
                <View>
                    <Text style={styles.label}>Expires</Text>
                    <Text style={styles.value}>{expiryDate}</Text>
                </View>
                <View>
                    <Text style={styles.label}>CVV</Text>
                    <Text style={styles.value}>{cvv}</Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        height: 200,
        borderRadius: radius.xl,
        padding: spacing.lg,
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
        ...shadow.md,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chipRow: {
        marginTop: spacing.sm,
    },
    chip: {
        width: 40,
        height: 30,
        backgroundColor: '#FFD700',
        borderRadius: radius.sm,
        opacity: 0.8,
    },
    cardNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 2,
        fontFamily: 'monospace', // Use monospace for card number alignment
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        marginVertical: spacing.md,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
    },
});
