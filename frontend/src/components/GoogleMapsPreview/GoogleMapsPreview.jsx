import React, { useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

import SearchBox from '../common/SearchBox/SearchBox';

const GoogleMapsPreview = (props) => {

    useEffect(() => {
        loadApi()
    }, []);

    const loadApi = (map, maps) => {
        // use map and maps objects
        // if (map && maps) {
        //     this.setState({
        //         apiReady: true,
        //         map: map,
        //         googlemaps: maps
        //     });
        // }
    };

    const center = {
        lat: 10.99835602,
        lng: 77.01502627
    }

    return (
        <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyBDouNq9r9RxBdLHc6lRh9EPNvp3EcNPsg' }}
            defaultCenter={center}
            defaultZoom={11}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => loadApi(map, maps)}
        >
            {/* <AnyReactComponent
                lat={59.955413}
                lng={30.337844}
                text="My Marker"
            /> */}
        </GoogleMapReact>
        // <GoogleMapReact
        //     bootstrapURLKeys={{ key: 'AIzaSyCk7pbkmNhknGumy2vgDykdgVj6lSreTt0', libraries: ['places'] }}
        //     defaultCenter={center}
        //     defaultZoom={11}
        //     yesIWantToUseGoogleMapApiInternals
        //     onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
        // >
        //     {/* <SearchBox
        //         //  placeholder={"123 anywhere st."}
        //         //  onPlacesChanged={this.handleSearch}
        //         map={map}
        //         googlemaps={googlemaps} />)} */}
        // </GoogleMapReact>
    )
}

export default GoogleMapsPreview;