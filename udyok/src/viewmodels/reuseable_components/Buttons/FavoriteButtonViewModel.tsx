import { useCallback, useState, useEffect } from 'react';
import { useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/features/favorites/favorites.api';
import { NotificationService } from '@/services/NotificationService';

export const useFavoriteButtonViewModel = (spaceId: string, initialIsFavorite: boolean, spaceName?: string) => {
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    // Local state for instant UI update (optimistic toggle)
    const [isFavoriteState, setIsFavoriteState] = useState(initialIsFavorite);

    // Sync if parent prop changes (e.g., after RTK query refetch completes)
    useEffect(() => {
        setIsFavoriteState(initialIsFavorite);
    }, [initialIsFavorite]);

    const handleToggleFavorite = useCallback((e?: any) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        // Optimistically update UI instantly
        setIsFavoriteState(prev => !prev);

        if (initialIsFavorite) {
            removeFavorite(spaceId).catch(console.error);
        } else {
            addFavorite(spaceId).then(() => {
                if (spaceName) {
                    NotificationService.notifyFavoriteAdded(spaceName);
                }
            }).catch(console.error);
        }
    }, [spaceId, initialIsFavorite, addFavorite, removeFavorite, spaceName]);

    return {
        onToggleFavorite: handleToggleFavorite,
        isFavorite: isFavoriteState,
    };
};
