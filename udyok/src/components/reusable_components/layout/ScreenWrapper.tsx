import React, { ReactNode } from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    StatusBar,
    ViewStyle,
} from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { colors } from '@/index';

export interface ScreenWrapperProps {
    children: ReactNode;

    /** Safe area edges to apply padding to */
    safeAreaEdges?: Edges;

    /** Enable scroll functionality */
    scrollable?: boolean;

    /** Background color of the screen */
    backgroundColor?: string;

    /** Enable keyboard avoiding behavior */
    keyboardAvoiding?: boolean;

    /** Add horizontal padding */
    withPadding?: boolean;

    /** Custom padding value (overrides withPadding) */
    customPadding?: number;

    /** Status bar style */
    statusBarStyle?: 'light-content' | 'dark-content';

    /** Additional style for the container */
    style?: ViewStyle;

    /** Show vertical scroll indicator */
    showsVerticalScrollIndicator?: boolean;
    /** Custom status bar color */
    statusBarColor?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    scrollable = false,
    backgroundColor = colors.background,
    keyboardAvoiding = true,
    withPadding = false,
    customPadding,
    statusBarStyle = 'dark-content',
    style,
    showsVerticalScrollIndicator = false,
    safeAreaEdges = ['top', 'bottom'],
    statusBarColor,
}) => {
    const containerStyle = [
        styles.container,
        { backgroundColor },
        withPadding && styles.withPadding,
        customPadding !== undefined && { padding: customPadding },
        style,
    ];

    const content = scrollable ? (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={containerStyle}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    ) : (
        <View style={containerStyle}>{children}</View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={safeAreaEdges}>
            <StatusBar
                barStyle={statusBarStyle}
                backgroundColor={statusBarColor || 'transparent'}
                translucent={true}
            />
            {keyboardAvoiding ? (
                <KeyboardAvoidingView
                    style={styles.keyboardAvoid}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    {content}
                </KeyboardAvoidingView>
            ) : (
                content
            )}
        </SafeAreaView>
    );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    withPadding: {
        paddingHorizontal: 16,
    },
});
