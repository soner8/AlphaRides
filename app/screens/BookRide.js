import React, { Component } from 'react';

import {

    StyleSheet,
    AsyncStorage,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Container, Icon, Left, Header, Body, Right } from 'native-base';
import Swiper from 'react-native-swiper';
import { Button } from 'react-native-elements';

export default class BookRide extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {

            destination: this.props.navigation.state.params.placeID,
            isPlaceID: true,
            error: '',
            gettingMyLocation: true,
            origin: { latitude: 0.02, longitude: 0.02 },
            concatOrigin: "",
            concatDest: "",
            carPrice: 0.00,
            autoPrice: 0.00,
            duration: '',
            distance: 0.0

        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    origin: { latitude: position.coords.latitude, longitude: position.coords.longitude },
                    error: null,
                    gettingMyLocation: false
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

        RNGooglePlaces.lookUpPlaceByID(this.state.destination)
            .then((result) => {
                this.setState({
                    destination: { latitude: result.latitude, longitude: result.longitude },

                })
            })
            .then(() => {
                let origin = this.state.origin
                let destination = this.state.destination
                let API_KEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk'
                this.mergeLot(origin, destination);

                fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${this.state.concatOrigin}&destinations=${this.state.concatDest}&key=${API_KEY}`)
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log(responseJson)

                        // After getting the distanceMatrix, we will now use it
                        // to calculate the fare and then set price for auto and
                        // car and then set duration and distance too
                        this.setState({
                            isPlaceID: false,
                            carPrice: 500,
                            autoPrice: 300
                        })
                    })
                    .catch(error => console.log(error))
            })



    }

    mergeLot = (origin, destination) => {

        let concatOrigin = origin.latitude + "," + origin.longitude
        let concatDest = destination.latitude + "," + destination.longitude
        this.setState({
            concatOrigin: concatOrigin,
            concatDest: concatDest
        });
    }

    onBookRide = (type, price) => {
        this.setState({ BookedRide: true })

        let user = db.auth().currentUser;
        let requestDriver = db.database().ref('/ride-request').push();

        requestDriver.update({
            currentUser: user.uid,
            origin: this.state.origin,
            destination: this.state.destination,
            type: type,
            Fare: price,
            duration: this.state.duration,
            distance: this.state.distance
        })

        this.props.navigation.navigate("ConnectingDriver");


    }




    componentDidMount() {


    }
    render() {
        if (this.state.isPlaceID && this.state.gettingMyLocation) {

            return (

                <View style={styles.container}>
                    <ActivityIndicator size="small" color="#00ff00" />
                </View>
            )
        }

        const { origin, destination } = this.state;
        const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ height: 400 }}>
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
                <View style={{ height: 300, backgroundColor: 'white' }}>
                    <Swiper style={styles.wrapper} showsButtons={true}>
                        <View style={styles.slide1}>
                            <Image style={styles.TransportImage}
                                source={require('../images/car.jpg')} />
                            <Text style={styles.text}>Naira:</Text>
                            <Text style={styles.text}>{this.state.carPrice}</Text>
                            <Button
                                buttonStyle={{ marginTop: 20 }}
                                backgroundColor="#03A9F4"
                                title="Book Ride"
                                onPress={() => this.onBookRide('car', this.state.carPrice)}
                            />


                        </View>
                        <View style={styles.slide2}>
                            <Image style={styles.TransportImage}
                                source={require('../images/auto.jpg')} />
                            <Text style={styles.text}>Naira:</Text>
                            <Text style={styles.text}>{this.state.autoPrice}</Text>
                            <Button
                                buttonStyle={{ marginTop: 20 }}
                                backgroundColor="#03A9F4"
                                title="Book Ride"
                                onPress={() => this.onBookRide('auto', this.state.autoPrice)}
                            />
                        </View>
                        <View style={styles.slide3}>
                            <Text style={styles.text}>Bike</Text>
                        </View>
                    </Swiper>
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({

    map: { ...StyleSheet.absoluteFillObject },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    TransportImage: {
        width: 100,
        height: 100,
        borderRadius: 75
    },

})