/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const MapSearchBox = (props) => {
    const map = useMap();

    useEffect(() => {
        const openStreetMapProvider = new OpenStreetMapProvider();
        const control = new GeoSearchControl({
            provider: openStreetMapProvider,
            style: 'bar',
            showPopup: true,
            marker: {
                icon: L.icon({
                    iconUrl: icon,
                    shadowUrl: iconShadow,
                    iconSize: [31, 51],
                    iconAnchor: [15, 51],
                    popupAnchor: [0, -51]
                }),
                draggable: false,
            },
            updateMap: true,
        })

        map.addControl(control);

        map.on('geosearch/showlocation', function (e) {
            props.setPosition({ latitude: e.location.raw.lat, longitude: e.location.raw.lon })
        });

        return () => map.removeControl(control);
    }, []);



    return null;
};

export default MapSearchBox;