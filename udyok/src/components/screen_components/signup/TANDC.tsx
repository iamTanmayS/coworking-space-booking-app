import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { colors, spacing, radius, typography } from '@/index';
import { moderateScale } from 'react-native-size-matters';

export type TermsAndConditionsProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
};

const TermsAndCondition = <T extends FieldValues>({
    control,
    name,
}: TermsAndConditionsProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            value && styles.checkboxActive,
                        ]}
                        onPress={() => onChange(!value)}
                    >
                        {value && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>

                    <Text style={styles.label}>
                        Agree with <Text style={styles.link}>Terms & Conditions</Text>
                    </Text>

                    {error && (
                        <Text style={styles.error}>{error.message}</Text>
                    )}
                </View>
            )}
        />
    );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: moderateScale(22),
        height: moderateScale(22),
        borderWidth: 1,
        borderRadius: radius.xs,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.border,
    },
    checkboxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkmark: {
        color: colors.textInverse,
        fontSize: typography.fontSize.sm,
    },
    label: {
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.regular,
        color: colors.textSecondary,
    },
    link: {
        color: colors.primary,
        fontFamily: typography.fontFamily.medium,
    },
    error: {
        color: colors.error,
        marginTop: spacing.xs,
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.regular,
        position: 'absolute',
        bottom: -spacing.lg,
        left: 0,
    },
});
