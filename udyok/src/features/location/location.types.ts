// Location feature types

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface SaveLocationRequest {
    latitude: number;
    longitude: number;
    city: string;
    country?: string;
    address?: string;
}

export interface SaveLocationResponse {
    message: string;
    location: {
        latitude: number;
        longitude: number;
        city: string;
        country?: string;
    };
}

// Photon API types
export interface PhotonFeature {
    type: 'Feature';
    geometry: {
        coordinates: [number, number]; // [longitude, latitude]
        type: 'Point';
    };
    properties: {
        city?: string;
        country?: string;
        name?: string;
        postcode?: string;
        state?: string;
        street?: string;
    };
}

export interface PhotonResponse {
    type: 'FeatureCollection';
    features: PhotonFeature[];
}
