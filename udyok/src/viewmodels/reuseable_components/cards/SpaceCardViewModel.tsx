import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SpaceListItem } from '@/features/spaces/spaces.types';
import type { SpaceDetailParam } from '@/navigation/types';

export const useSpaceCardViewModel = (space: SpaceListItem) => {
    const navigation = useNavigation<NativeStackNavigationProp<SpaceDetailParam>>();

    const handlePress = useCallback(() => {
        // Navigate to Space Detail Screen
        navigation.navigate('SpaceDetail', { spaceId: space.id });
    }, [navigation, space.id]);


    return {
        // Actions
        onPress: handlePress,

        // Read-only state (just pass-through from space object)
        isFavorite: space.isFavorite,
    };
};
