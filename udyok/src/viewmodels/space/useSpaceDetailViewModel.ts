import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetSpaceQuery } from "@/features/spaces/spaces.api";

interface UseSpaceDetailViewModelProp {
    spaceId: string;
}

export const useSpaceDetailViewModel = ({ spaceId }: UseSpaceDetailViewModelProp) => {
    const locationObj = useSelector((state: RootState) => state.user.profile?.location);

    const { data: spaceData, isLoading, error } = useGetSpaceQuery({
        id: spaceId,
        ...(locationObj?.latitude != null && {
            lat: locationObj.latitude,
            lng: locationObj.longitude,
        }),
    });

    return {
        space: spaceData,
        isLoading,
        error,
    };
};
