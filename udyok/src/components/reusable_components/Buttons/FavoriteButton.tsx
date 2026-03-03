import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from '@/components/reusable_components/icons/Icon';
import { colors, shadow, radius } from '@/index';
import { useFavoriteButtonViewModel } from '@/viewmodels/reuseable_components/Buttons/FavoriteButtonViewModel';

export interface FavoriteButtonProps {
    spaceId: string;
    isFavorite: boolean;
    style?: ViewStyle;
    size?: number;
    color?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    spaceId,
    isFavorite,
    style,
    size = 25,
    color,
}) => {
    const { onToggleFavorite } = useFavoriteButtonViewModel(spaceId, isFavorite);

    return (
        <Pressable
            style={[styles.container, style]}
            onPress={onToggleFavorite}
            hitSlop={8}
        >
            <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                library="ionicons"
                size={size}
                color={isFavorite ? colors.error : (color || colors.textPrimary)}
                onPress={onToggleFavorite}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',

        width: 36,
        height: 36,
        ...shadow.sm,
    },
});

export default FavoriteButton;
