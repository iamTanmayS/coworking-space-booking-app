import { Share } from "react-native"
import * as linking from "expo-linking"

export interface ShareButtonViewModelProps {
    spaceId: string
}

export const useShareButtonViewModel = ({ spaceId }: ShareButtonViewModelProps) => {
    const handleShare = async () => {
        try {
            const url = linking.createURL(`/space/${spaceId}`);

            await Share.share({
                message: `Check out this space: ${url}`,
                url,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return {
        handleShare
    }
}
