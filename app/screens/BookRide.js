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
import RNGooglePlaces from 'react-native-google-places';
import { Container, Icon, Left, Header, Body, Right } from 'native-base';

export default class BookRide extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            MyLocationLat: null,
            MyLocationLong: null,
            destination: this.props.navigation.state.params.placeID,
            isPlaceID: true,
            gettingMyLocation: true

        }
        RNGooglePlaces.lookUpPlaceByID(this.state.destination)
            .then((result) => {
                this.setState({
                    destination: { latitude: result.latitude, longitude: result.longitude },
                    isPlaceID: false
                })
            })
    }
    componentDidMount() {
        RNGooglePlaces.getCurrentPlace()
            .then((result) => {
                this.setState({
                    MyLocationLat: result[4].latitude,
                    MyLocationLong: result[4].longitude,
                    gettingMyLocation: false
                });
            })
            .catch((error) => console.log(error));
    }
    render() {
        if (this.state.isPlaceID && this.state.gettingMyLocation) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="small" color="#00ff00" />
                </View>
            )
        }
        const origin = { latitude: this.state.MyLocationLat, longitude: this.state.MyLocationLong };
        const { destination } = this.state;
        const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';

        return (
            <Container>
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
            </Container>
        );
    }
}

const styles = StyleSheet.create({

    map: { ...StyleSheet.absoluteFillObject },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }

})