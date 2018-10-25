import React, { Component } from 'react';

import {

    StyleSheet,
    AsyncStorage,
    Text,
    View,
    Dimensions,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import geofire from 'geofire';
import RNGooglePlaces from 'react-native-google-places';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Container, Icon, Left, Header, Body, Right } from 'native-base';
import Swiper from 'react-native-swiper';
import { Button } from 'react-native-elements';
import { db } from "../../config/MyFirebase";
import Spinner from 'react-native-spinkit';
import SlidingPanel from 'react-native-sliding-up-down-panels';

const { width, height } = Dimensions.get('window');

export default class ConnectingDriver extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {

            origin: this.props.navigation.state.params.origin,
            driverFound: false,
            driverId: null,
            driverName: "",
            driversLocation: null,
            isMapReady: false

        }

        navigator.geolocation.getCurrentPosition(
            (position) => {

                this.setState({
                    origin: { latitude: position.coords.latitude, longitude: position.coords.longitude },


                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );


        // Recursive function to get ClosestDriver




        // It Now Has to Listen On his ride_request to see if there is a change

        /*let user = db.auth().currentUser;

        db.database().ref('DriversAvailable').on('value', (snapshot) => {





            if (snapshot.val().status == "confirmed") {

                // If status of your ride is confirmed, get driver PayLoad
                let driverPayLoad = snapshot.val().accepted_by
                this.setState({ driver: driverPayLoad })

            }


        });*/
    }

    driverLocation = (key) => {
        driverRef = db.database().ref('DriversWorking').child(key)

    }

    onCancel = (key) => {
        let user = db.auth().currentUser;
        driverRef = db.database().ref("ride-requests").child(user.uid).remove()
    }

    componentDidMount() {
        let radius = 1
        let user = db.auth().currentUser;
        const { driverFound } = this.state;
        getClosestDriver = () => {

            driverRef = db.database().ref('DriversAvaliable')
            const geofireRef = new geofire(driverRef)
            const Geoquery = geofireRef.query({
                center: [this.state.origin.latitude, this.state.origin.longitude],
                radius: radius
            })

            Geoquery.on("key_entered", (key, location) => {
                console.log(location);
                if (!driverFound) {
                    this.setState({
                        driverFound: true,
                        driverID: key,
                        driversLocation: location
                    })
                    console.log(this.state.driversLocation)
                    //Get the Name of the Driver
                    driverRef = db.database().ref('drivers').child(key)
                    driverRef.once('value', (snap) => {
                        this.setState({ driverName: snap.val().Name })
                    })

                    // Sending Notification to Driver using Driver ID key

                    driverRef.child(user.uid).update({
                        location: location,
                        Name: 'Blaizet' //We will have to use user.Name later
                    })

                }
                Geoquery.cancel()
            })
            Geoquery.on("ready", function () {
                console.log("Done with Search")
                if (!driverFound) {
                    radius++;
                    getClosestDriver()
                }
            })
        }


        getClosestDriver();

    }
    onMapLayout = () => {
        console.log("Map LayOut Ready")
        this.setState({ isMapReady: true });
    }

    render() {
        const { driverFound, origin, driversLocation } = this.state;
        const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';


        if (!driverFound) {
            return (
                <Spinner
                    isVisible={true}
                    size={50}
                    type={'Bounce'}
                    color={'#ffffff'}
                />
            );

            /*return (
                <View>
                    <ActivityIndicator size='small' color="#00ff00" />
                </View>
            );*/
        }
        return (

            <View style={styles.container}>
                {/*MapView Must always be Wrapped in a Container else it wont show*/}
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
                    onLayout={this.onMapLayout}
                >
                    <MapView.Marker coordinate={origin} />
                    {
                        this.state.driversLocation ?
                            (
                                <MapView.Marker
                                    title='Driver'
                                    coordinate={{ latitude: this.state.driversLocation[0], longitude: this.state.driversLocation[1] }} />

                            )
                            :
                            (
                                null
                            )

                    }
                    <MapViewDirections
                        origin={origin}
                        destination={{ latitude: this.state.driversLocation[0], longitude: this.state.driversLocation[1] }}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />

                </MapView>


                <SlidingPanel
                    headerLayoutHeight={100}
                    headerLayout={() =>
                        <View style={styles.headerLayoutStyle}>
                            <Text style={styles.commonTextStyle}>{this.state.driverName}</Text>
                        </View>
                    }
                    slidingPanelLayout={() =>
                        <View style={styles.slidingPanelLayoutStyle}>
                            <Text style={styles.commonTextStyle}>Drivers Location{this.state.driversLocation}</Text>
                            <Text style={styles.commonTextStyle}>Drivers ID {this.state.driverID}</Text>
                        </View>
                    }
                />
            </View>
        )

    }
}

const styles = StyleSheet.create({
    map: { ...StyleSheet.absoluteFillObject },
    container: {
        flex: 1,
    },
    bodyViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLayoutStyle: {
        width,
        height: 100,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidingPanelLayoutStyle: {
        width,
        height,
        backgroundColor: '#7E52A0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commonTextStyle: {
        color: 'white',
        fontSize: 18,
    },
});
