import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import TextInputStyled from './TextInputStyled'
import { spacing } from '@/index';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder: string;
  label?: string;
  secureTextEntry?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  label,
  secureTextEntry,
  leftElement,
  rightElement,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInputStyled
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
            leftElement={leftElement}
            rightElement={rightElement}
            error={error?.message}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
});
