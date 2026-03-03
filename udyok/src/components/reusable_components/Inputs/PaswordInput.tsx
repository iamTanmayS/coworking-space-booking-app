import { Control, FieldValues, Path } from "react-hook-form";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FormInput } from "./FormInput";
import Icon from "../icons/Icon";
import { colors } from "@/index";

interface Props<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    placeholder: string;
    label?: string;
}

const PasswordInput = <T extends FieldValues>({ control, name, placeholder, label }: Props<T>) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormInput
            control={control}
            name={name}
            label={label}
            placeholder={placeholder}
            secureTextEntry={!showPassword}
            rightElement={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                        library="ionicons"
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={colors.textSecondary}
                    />
                </TouchableOpacity>
            }
        />
    );
};

export default PasswordInput;
