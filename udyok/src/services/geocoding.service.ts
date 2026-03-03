/**
 * Geocoding Service
 * 
 * Wrapper for Photon API (photon.komoot.io)
 * Provides location search and reverse geocoding
 */

import type { PhotonResponse, PhotonFeature } from '../features/location/location.types';

const PHOTON_BASE_URL = 'https://photon.komoot.io/api';

/**
 * Search for locations by query string
 * @param query - Search term (e.g., "Berlin", "New York")
 * @param options - Optional search parameters
 */
export const searchLocation = async (
    query: string,
    options?: {
        lat?: number;
        lon?: number;
        limit?: number;
        lang?: string;
    }
): Promise<PhotonFeature[]> => {
    try {
        const params = new URLSearchParams({
            q: query,
            ...(options?.lat && { lat: options.lat.toString() }),
            ...(options?.lon && { lon: options.lon.toString() }),
            ...(options?.limit && { limit: options.limit.toString() }),
            ...(options?.lang && { lang: options.lang }),
        });

        const response = await fetch(`${PHOTON_BASE_URL}/?${params}`);

        if (!response.ok) {
            throw new Error(`Photon API error: ${response.status}`);
        }

        const data: PhotonResponse = await response.json();
        return data.features;
    } catch (error) {
        console.error('Location search failed:', error);
        throw error;
    }
};

/**
 * Reverse geocode coordinates to get location details
 * @param lat - Latitude
 * @param lon - Longitude
 */
export const reverseGeocode = async (
    lat: number,
    lon: number
): Promise<PhotonFeature | null> => {
    try {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
        });

        const response = await fetch(`https://photon.komoot.io/reverse?${params}`);

        if (!response.ok) {
            throw new Error(`Photon API error: ${response.status}`);
        }

        const data: PhotonResponse = await response.json();
        return data.features[0] || null;
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        throw error;
    }
};

/**
 * Extract city name from Photon feature
 */
export const getCityFromFeature = (feature: PhotonFeature): string => {
    return feature.properties.city || feature.properties.name || 'Unknown';
};

/**
 * Extract country name from Photon feature
 */
export const getCountryFromFeature = (feature: PhotonFeature): string => {
    return feature.properties.country || 'Unknown';
};
