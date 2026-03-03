import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



export const responsive = {
    wp,
    moderateScale,

    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,

    isSmallDevice: SCREEN_WIDTH < 375,
    isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
    isLargeDevice: SCREEN_WIDTH >= 768,
};

export const fontSize = {
    xs: moderateScale(12),
    sm: moderateScale(14),
    md: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(28),
};
export const spacing = {
    xs: moderateScale(4),
    sm: moderateScale(8),
    md: moderateScale(12),
    lg: moderateScale(16),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
};
export const iconSize = {
    xs: moderateScale(12),
    sm: moderateScale(16),
    md: moderateScale(20),
    lg: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(40),
};

export const touchTarget = {
    min: moderateScale(44),
};