import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScreenWrapper } from '@/components/index';
import { colors, fontSize, spacing } from '@/index';

const Splash = () => {
    return (
        <ScreenWrapper
            backgroundColor={colors.primary}
            statusBarStyle="light-content"
        >
            <View style={styles.container}>
                <Text style={styles.logo}>Udyok</Text>
                <Text style={styles.tagline}>Find Your Perfect Workspace</Text>
            </View>
        </ScreenWrapper>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        fontSize: fontSize.xxxl * 1.5,
        fontWeight: '700',
        color: colors.textInverse,
        marginBottom: spacing.sm,
    },
    tagline: {
        fontSize: fontSize.md,
        color: colors.textInverse,
        opacity: 0.9,
    },
});