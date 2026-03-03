import { Icon, PrimaryButton, ScreenWrapper } from '@/components/index';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/index';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

type GetStartedNavigationProp = NativeStackNavigationProp<any, any>;

const GetStarted = () => {
    const navigation = useNavigation<GetStartedNavigationProp>();
    return (
        <ScreenWrapper backgroundColor={colors.surface}>
            <View style={styles.container}>
                {/* Decorative Background Circles */}
                <View style={styles.decorativeCircleTop} />
                <View style={styles.decorativeCircleBottom} />

                {/* Image Section */}
                <View style={styles.imageSection}>
                    {/* Small Image - Top Right */}
                    <View style={[styles.smallImageContainer, styles.smallImageTopRight]}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400' }}
                            style={styles.smallImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Main Large Image with Green Border */}
                    <View style={styles.mainImageWrapper}>
                        <View style={styles.mainImageBorder}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800' }}
                                style={styles.mainImage}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Arrow Button Overlay */}
                        <View style={styles.arrowButton}>
                            <Icon
                                name="arrow-forward"
                                library="material"
                                size={24}
                                color={colors.textInverse}
                            />
                        </View>
                    </View>

                    {/* Small Image - Bottom Left */}
                    <View style={[styles.smallImageContainer, styles.smallImageBottomLeft]}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400' }}
                            style={styles.smallImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.contentSection}>
                    {/* Title */}
                    <Text style={styles.title}>
                        The <Text style={styles.titleHighlight}>Co-Working</Text>
                    </Text>
                    <Text style={styles.title}>Experience Starts Here</Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    </Text>

                    {/* Get Started Button */}
                    <PrimaryButton
                        title="Let's Get Started"
                        onPress={() => {
                            navigation.navigate("AppTour")
                        }}
                        style={{
                            borderRadius: radius.full

                        }}
                    />

                    {/* Sign In Link */}
                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>Already have an account? </Text>
                        <Pressable onPress={() => {
                            navigation.navigate("SignIn")
                        }}>
                            <Text style={styles.signInLink}>Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default GetStarted;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    decorativeCircleTop: {
        position: 'absolute',
        top: -100,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: 0.3,
    },
    decorativeCircleBottom: {
        position: 'absolute',
        bottom: 100,
        right: -80,
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: 0.3,
    },
    imageSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing.xl,
        position: 'relative',
    },
    mainImageWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainImageBorder: {
        width: moderateScale(280),
        height: moderateScale(380),
        borderRadius: moderateScale(190),
        borderWidth: 3,
        borderColor: colors.primary,
        padding: 4,
        overflow: 'hidden',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        borderRadius: moderateScale(190),
    },
    arrowButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...{
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
    },
    smallImageContainer: {
        position: 'absolute',
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(40),
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: colors.background,
        ...{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
        },
    },
    smallImageTopRight: {
        top: 40,
        right: 20,
    },
    smallImageBottomLeft: {
        bottom: 40,
        left: 20,
    },
    smallImage: {
        width: '100%',
        height: '100%',
    },
    contentSection: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: fontSize.xxl * 1.3,
    },
    titleHighlight: {
        color: colors.primary,
    },
    description: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
        marginBottom: spacing.xl,
        lineHeight: fontSize.sm * 1.5,
        paddingHorizontal: spacing.sm,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    signInText: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
    },
    signInLink: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});