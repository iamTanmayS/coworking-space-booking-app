import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from '@/components';
import { colors, shadow, radius } from '@/index';
import { useShareButtonViewModel } from '@/viewmodels/reuseable_components/Buttons/ShareButtonViewModel';

export interface ShareButtonProps {
    spaceId: string;
    style?: ViewStyle;
    size?: number;
    color?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
    spaceId,
    style,
    size = 25,
    color,
}) => {
    const { handleShare } = useShareButtonViewModel({ spaceId });

    return (
        <Pressable
            style={[styles.container, style]}
            onPress={handleShare}
            hitSlop={8}
        >
            <Icon
                name="share"
                library="fontawesome"
                size={size}
                color={color || colors.textPrimary}
                onPress={handleShare}
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

export default ShareButton;
