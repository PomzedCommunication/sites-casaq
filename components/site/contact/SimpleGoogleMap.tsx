'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import {buildMarkerIcon} from "@/components/site/listings/ListingGoogleMap";


type Props = {
    latitude: number;
    longitude: number;
};

const libraries: 'places'[] = ['places'];

const mapContainerStyle = {
    width: '100%',
    height: '500px',
};


const wizardMapStyles: google.maps.MapTypeStyle[] = [
    {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#D6DED4' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#96BCBD' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#B9D4B1' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#FAEBAD' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#E3A679' }],
    },
    {
        featureType: 'road.local',
        elementType: 'geometry',
        stylers: [{ color: '#C4C7CF' }],
    },
    {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#575757' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#F3F0E9' }],
    },
    {
        featureType: 'landscape.man_made',
        elementType: 'geometry.fill',
        stylers: [{ color: '#D8E8D9' }],
    },

    // {
    //     featureType: 'landscape',
    //     elementType: 'geometry.fill',
    //     stylers: [{ color: '#D8E8D9' }],
    // },
    // {
    //     featureType: 'landscape.natural',
    //     elementType: 'geometry',
    //     stylers: [{ color: '#C8E6C4' }],
    // },
    {
        featureType: 'landscape.natural.landcover',
        elementType: 'geometry.fill',
        stylers: [{ color: '#C8E6C4' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4F5F4F' }],
    },
    {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4B4B4B' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#BACBBA' }],
    },
];

export default function PropertyLocationMap({
                                                latitude,
                                                longitude,
                                            }: Props) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    const position = {
        lat: latitude,
        lng: longitude,
    };

    if (!isLoaded) {
        return (
            <div className="property-location-map">
                Chargement de la carte…
            </div>
        );
    }

    return (
        <div className="property-location-map">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={14}
                options={{
                    styles: wizardMapStyles,
                    mapTypeControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                    zoomControl: false,
                    clickableIcons: false,
                    gestureHandling: 'cooperative',
                }}
            >
                <Marker
                    position={position}
                    icon={buildMarkerIcon({ fill: '#E41745', scale: 1.84,})}
                />
            </GoogleMap>
        </div>
    );
}