import React from 'react';
import { StyleProp, ViewStyle, Pressable } from 'react-native';
import { iconSize, colors } from '@/index';

import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
export type IconLibrary = 'material' | 'ionicons' | 'fontawesome';
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';


export interface IconProps {
    name: string;
    library?: IconLibrary;
    size?: IconSize | number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}


const ICON_MAP = {
    material: MaterialIcons,
    ionicons: Ionicons,
    fontawesome: FontAwesome,
} as const;

const Icon: React.FC<IconProps> = ({
    name,
    library = 'material',
    size = 'md',
    color = colors.textPrimary,
    style,
    onPress,
}) => {
    const iconSizeValue = typeof size === 'number' ? size : iconSize[size];
    const IconComponent = ICON_MAP[library];

    const iconElement = (
        <IconComponent
            name={name as any}
            size={iconSizeValue}
            color={color}
            style={style}
        />
    );

    if (onPress) {
        return (
            <Pressable onPress={onPress} hitSlop={8}>
                {iconElement}
            </Pressable>
        );
    }

    return iconElement;
};

export default Icon;