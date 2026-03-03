import { useState } from 'react';
import * as ExpoLocation from 'expo-location';
import { useUpdateLocationMutation } from '@/features/user/user.api';
import { useAppDispatch } from '@/store/store';
import { updateUserProfile } from '@/features/user/User.slice';
import { reverseGeocode, getCityFromFeature, getCountryFromFeature, searchLocation } from '@/services/geocoding.service';
import type { LocationCoordinates } from '@/features/location/location.types';
import type { PhotonFeature } from '@/features/location/location.types';

export const useLocationViewModel = () => {
    const dispatch = useAppDispatch();
    const [updateLocation, { isLoading: isSaving }] = useUpdateLocationMutation();

    const [permissionStatus, setPermissionStatus] = useState<ExpoLocation.PermissionStatus | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
    const [currentCity, setCurrentCity] = useState<string | null>(null);
    const [currentCountry, setCurrentCountry] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<PhotonFeature[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isSavingLocation, setIsSavingLocation] = useState(false);

    /**
     * Request location permissions
     */
    const requestPermission = async () => {
        try {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            setPermissionStatus(status);
            return status === ExpoLocation.PermissionStatus.GRANTED;
        } catch (error) {
            console.error('Permission request failed:', error);
            return false;
        }
    };

    /**
     * Get current location and reverse geocode to city
     */
    const getCurrentLocation = async () => {
        try {
            setIsLoadingLocation(true);

            // Check permission first
            const { status } = await ExpoLocation.getForegroundPermissionsAsync();
            if (status !== ExpoLocation.PermissionStatus.GRANTED) {
                const granted = await requestPermission();
                if (!granted) {
                    throw new Error('Location permission denied');
                }
            }

            // Get current position
            const location = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Balanced,
            });

            const coords: LocationCoordinates = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setCurrentLocation(coords);

            // Reverse geocode to get city
            const feature = await reverseGeocode(coords.latitude, coords.longitude);
            if (feature) {
                const city = getCityFromFeature(feature);
                const country = getCountryFromFeature(feature);
                setCurrentCity(city);
                setCurrentCountry(country);
            }

            return coords;
        } catch (error) {
            console.error('Get current location failed:', error);
            throw error;
        } finally {
            setIsLoadingLocation(false);
        }
    };

    /**
     * Search for locations by query
     */
    const searchLocations = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const results = await searchLocation(query, {
                limit: 5,
                ...(currentLocation && {
                    lat: currentLocation.latitude,
                    lon: currentLocation.longitude,
                }),
            });
            setSearchResults(results);
        } catch (error) {
            console.error('Location search failed:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    /**
     * Select a location from search results
     */
    const selectLocation = (feature: PhotonFeature) => {
        const [lon, lat] = feature.geometry.coordinates;
        setCurrentLocation({ latitude: lat, longitude: lon });
        setCurrentCity(getCityFromFeature(feature));
        setCurrentCountry(getCountryFromFeature(feature));
        setSearchResults([]);
    };

    /**
     * Save location to backend and update local state
     */
    const saveLocation = async () => {
        if (!currentLocation || !currentCity) {
            throw new Error('No location selected');
        }

        try {
            setIsSavingLocation(true);

            // Use RTK Query mutation for location update
            const result = await updateLocation({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                city: currentCity,
            }).unwrap();

            // Update local user profile
            console.log('Updating user profile with location:', currentCity);
            dispatch(updateUserProfile({
                location: {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    city: currentCity,
                    country: currentCountry || ''
                }
            }));
            console.log('Location saved successfully');
            return result;

        } catch (error) {
            console.error('Save location failed:', error);
            throw error;
        } finally {
            setIsSavingLocation(false);

        }
    };

    return {
        permissionStatus,
        currentLocation,
        currentCity,
        searchResults,
        isLoadingLocation,
        isSearching,
        isSaving: isSavingLocation,
        requestPermission,
        getCurrentLocation,
        searchLocations,
        selectLocation,
        saveLocation,
    };
};
