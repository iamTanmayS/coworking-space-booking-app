import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    Pressable,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper, Icon } from '@/components/index';
import { colors, fontSize, spacing, radius } from '@/index';
import { moderateScale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/featurestacks/AuthStack';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TitlePart {
    text: string;
    highlight?: boolean;
}

interface OnboardingSlide {
    id: string;
    phoneImage: string;
    titleParts: TitlePart[];
    description: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        phoneImage: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1771025189/2_mdp4kz.png',
        titleParts: [
            { text: 'The ' },
            { text: 'Co-Working', highlight: true },
            { text: '\nExperience Starts Here' },
        ],
        description:
            'Discover flexible workspaces near you, explore amenities, and find the perfect environment to stay productive and focused.',
    },
    {
        id: '2',
        phoneImage: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1771025189/1_d2emd6.png',
        titleParts: [
            { text: 'Co-Work Favorites: ', highlight: true },
            { text: 'Save\nfor Later' },
        ],
        description:
            'Bookmark your preferred locations and revisit them anytime. Compare spaces, check availability, and book with confidence.',
    },
    {
        id: '3',
        phoneImage: 'https://res.cloudinary.com/df4hdywqy/image/upload/v1771025191/3_jzpcbs.png',
        titleParts: [
            { text: 'Simplify Workspace\n' },
            { text: 'Booking Tracking', highlight: true },
        ],
        description:
            'Manage your reservations, track upcoming bookings, and stay organized with real-time updates all in one streamlined dashboard.',
    },
];

const AppTour = () => {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'AppTour'>>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const insets = useSafeAreaInsets();

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setCurrentIndex(index);
    };

    const goToNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            navigation.navigate('CreateAccount')
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };

    const getItemLayout = (_: any, index: number) => ({
        length: SCREEN_WIDTH,
        offset: SCREEN_WIDTH * index,
        index,
    });

    const renderSlide = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slide}>
            <View style={styles.backgroundLayer}>
                <View style={styles.phoneContainer}>
                    <Image
                        source={{ uri: item.phoneImage }}
                        style={styles.phoneImage}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </View>
    );


    return (
        <ScreenWrapper backgroundColor={colors.surface}>

            {/* Skip Button */}
            <Pressable
                style={[styles.skipButton, { top: insets.top + spacing.md }]}
                onPress={() => {
                    navigation.navigate('CreateAccount')
                }}
            >
                <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            {/* IMAGE CAROUSEL ONLY */}
            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                bounces={false}
                decelerationRate="fast"
                getItemLayout={getItemLayout}
            />

            {/* FIXED BOTTOM SHEET */}
            <View style={styles.bottomWrapper}>
                {/* Smile Curve */}
                <Svg
                    width={SCREEN_WIDTH}
                    height={60}
                    style={styles.svgCurve}
                >
                    <Path
                        d={`
                            M0,0
                            Q${SCREEN_WIDTH / 2},60 ${SCREEN_WIDTH},0
                            L${SCREEN_WIDTH},60
                            L0,60
                            Z
                        `}
                        fill={colors.background}
                    />
                </Svg>

                {/* Bottom Sheet Content */}
                <View style={styles.bottomContent}>
                    <Text style={styles.title}>
                        {slides[currentIndex].titleParts.map((part, index) => (
                            <Text
                                key={index}
                                style={
                                    part.highlight
                                        ? styles.titleHighlight
                                        : styles.titleNormal
                                }
                            >
                                {part.text}
                            </Text>
                        ))}
                    </Text>

                    <Text style={styles.description}>
                        {slides[currentIndex].description}
                    </Text>

                    <View style={styles.controls}>
                        <Pressable
                            style={[
                                styles.navButton,
                                styles.navButtonOutline,
                                currentIndex === 0 && styles.navButtonDisabled,
                            ]}
                            onPress={goToPrevious}
                            disabled={currentIndex === 0}
                        >
                            <Icon
                                name="arrow-back"
                                library="material"
                                size={24}
                                color={
                                    currentIndex === 0
                                        ? colors.disabled
                                        : colors.primary
                                }
                            />
                        </Pressable>

                        <View style={styles.pagination}>
                            {slides.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === currentIndex &&
                                        styles.dotActive,
                                    ]}
                                />
                            ))}
                        </View>

                        <Pressable
                            style={[styles.navButton, styles.navButtonFilled]}
                            onPress={goToNext}
                        >
                            <Icon
                                name="arrow-forward"
                                library="material"
                                size={24}
                                color={colors.textInverse}
                            />
                        </Pressable>
                    </View>
                </View>
            </View>


        </ScreenWrapper>
    );
};

export default AppTour;

const styles = StyleSheet.create({
    skipButton: {
        position: 'absolute',
        right: spacing.lg,
        zIndex: 10,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    skipText: {
        fontSize: fontSize.md,
        color: colors.primary,
        fontWeight: '600',
    }, bottomWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
    },

    svgCurve: {
        position: 'absolute',
        top: -50,
    },

    bottomContent: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl,
    }
    ,
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        position: 'relative',
    },
    backgroundLayer: {
        flex: 1,
        backgroundColor: colors.surface,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: spacing.xxxl,
    },

    phoneContainer: {
        width: SCREEN_WIDTH * 0.85,
        aspectRatio: 0.48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneImage: {
        width: '100%',
        height: '100%',
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl,
        elevation: 10,
    },
    title: {
        fontSize: fontSize.xxl,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: fontSize.xxl * 1.3,
    },
    titleHighlight: {
        color: colors.primary,
    },
    titleNormal: {
        color: colors.textPrimary,
    },
    description: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: fontSize.sm * 1.5,
        paddingHorizontal: spacing.sm,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    navButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonOutline: {
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
    },
    navButtonFilled: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    navButtonDisabled: {
        borderColor: colors.disabled,
        opacity: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.border,
    },
    dotActive: {
        backgroundColor: colors.primary,
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
