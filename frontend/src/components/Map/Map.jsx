import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import classes from './Map.module.scss';
import MapSearchBox from '../MapSearchBox/MapSearchBox';

const Map = (props) => {
    return (
        <MapContainer center={[42.69, 23.31]} zoom={13} scrollWheelZoom={false} className={classes.Map}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSearchBox setPosition={props.setPosition} />
        </MapContainer>
    );
};

export default Map;