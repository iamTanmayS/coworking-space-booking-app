import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Keyboard } from 'react-native';
import { colors, radius, spacing, typography } from '@/index';
import { moderateScale } from 'react-native-size-matters';

interface OTPInputProps {
    code: string;
    setCode: (code: string) => void;
    length?: number;
    maximumLength?: number;
}

const OTPInput = ({
    code,
    setCode,
    maximumLength = 4,
}: OTPInputProps) => {
    const boxArray = new Array(maximumLength).fill(0);
    const inputRef = useRef<TextInput>(null);
    const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

    const handleOnPress = () => {
        setIsInputBoxFocused(true);
        inputRef.current?.focus();
    };

    const handleOnBlur = () => {
        setIsInputBoxFocused(false);
    };

    const boxDigit = (_: any, index: number) => {
        const emptyInput = "";
        const digit = code[index] || emptyInput;

        const isCurrentValue = index === code.length;
        const isLastValue = index === maximumLength - 1;
        const isCodeComplete = code.length === maximumLength;

        const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

        const isFocused = isInputBoxFocused && isValueFocused;

        return (
            <View
                key={index}
                style={[
                    styles.splitBoxes,
                    isFocused && styles.splitBoxesFocused,
                    digit !== "" && styles.splitBoxesFilled,
                ]}
            >
                <Text style={styles.splitBoxText}>{digit}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.splitOTPBoxesContainer} onPress={handleOnPress}>
                {boxArray.map(boxDigit)}
            </Pressable>
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                maxLength={maximumLength}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="oneTimeCode"
                onBlur={handleOnBlur}
                style={styles.textInputHidden}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: spacing.xl,
    },
    textInputHidden: {
        position: 'absolute',
        opacity: 0,
        height: 0,
        width: 0,
    },
    splitOTPBoxesContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    splitBoxes: {
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.md,
        padding: spacing.sm,
        minWidth: moderateScale(45),
        minHeight: moderateScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    splitBoxesFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
        borderWidth: 2,
    },
    splitBoxesFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    splitBoxText: {
        fontSize: typography.fontSize.xl,
        textAlign: 'center',
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.bold,
    },
});

export default OTPInput;
