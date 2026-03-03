import React, { forwardRef } from 'react';

import {
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    ViewStyle,
    TextStyle,
    StyleProp,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
} from 'react-native';

import { colors, spacing, radius, typography, opacity } from '@/index';


export interface AppTextInputProps extends RNTextInputProps {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    secureTextEntry?: boolean;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
}

const TextInputStyled = forwardRef<RNTextInput, AppTextInputProps>(
    (
        {
            label,
            placeholder,
            value,
            onChangeText,
            error,
            disabled,
            loading,
            fullWidth,
            leftElement,
            rightElement,
            secureTextEntry,
            containerStyle,
            inputStyle,
            labelStyle,
            textStyle,
            style,
            ...rest
        },
        ref
    ) => {
        return (
            <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
                {label && (
                    <Text style={[styles.label, labelStyle]}>{label}</Text>
                )}
                <View
                    style={[
                        styles.inputContainer,
                        error && styles.errorInput,
                        disabled && styles.disabledInput,
                        style,
                    ]}
                >
                    {leftElement && (
                        <View style={styles.leftElementContainer}>
                            {leftElement}
                        </View>
                    )}
                    <RNTextInput
                        ref={ref}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry}
                        editable={!disabled && !loading}
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.input, inputStyle, textStyle]}
                        {...rest}
                    />
                    {loading && (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                            style={styles.loader}
                        />
                    )}
                    {!loading && rightElement && (
                        <View style={styles.rightElementContainer}>
                            {rightElement}
                        </View>
                    )}
                </View>
                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
            </View>
        );
    }
);

export default TextInputStyled;

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    fullWidth: {
        width: '100%',
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.medium,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        minHeight: 56,
    },
    input: {
        flex: 1,
        fontSize: typography.fontSize.md,
        fontFamily: typography.fontFamily.regular,
        color: colors.textPrimary,
        paddingVertical: spacing.sm,
    },
    leftElementContainer: {
        marginRight: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightElementContainer: {
        marginLeft: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorInput: {
        borderWidth: 1,
        borderColor: colors.error,
    },
    disabledInput: {
        opacity: opacity.disabled,
        backgroundColor: colors.disabled,
    },
    errorText: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.regular,
        color: colors.error,
        marginTop: spacing.xs,
    },
    loader: {
        marginLeft: spacing.sm,
    },
});
