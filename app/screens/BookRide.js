import React, { Component } from 'react';

import {

    StyleSheet,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default class BookRide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origin: this.props.navigation.state.params.myLocation,
            destination: this.props.navigation.state.params.placeID,
            isPlaceID: true

        }
        RNGooglePlaces.lookUpPlaceByID(this.state.destination)
            .then((result) => {
                this.setState({
                    destination: { latitude: result.latitude, longitude: result.longitude },
                    isPlaceID: false
                })
            })
    }
    render() {
        if (this.state.isPlaceID) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="small" color="#00ff00" />
                </View>
            )
        }
        const { origin, destination } = this.state;
        const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';

        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={{
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    }}
                    showsUserLocation={true}
                >
                    <MapView.Marker coordinate={origin} />
                    <MapView.Marker coordinate={destination} />
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject },
    map: { ...StyleSheet.absoluteFillObject },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }

})