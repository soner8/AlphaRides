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
        console.log(key)
        let user = db.auth().currentUser;
        // Update status of Ride-History to cancelled
        let ride = db.database().ref("ride-request").child(user.uid)

        //We need to stop the listener before removing the child else it will result in an error
        ride.off()

        ride.remove()

        driverRef = db.database().ref("drivers").child(key)
        driverRef.child(user.uid).remove()
        // store cancelled rides for this user in database
        //...
        // Navigate to Home Screen After Cancelling Ride
        this.props.navigation.navigate("Main")
    }

    // Listen Drivers Location or If Driver Cancels
    listenDriver(key, userID) {
        let myRef = db.database().ref('ride-request').child(userID)
        // We should Know that if 'DriverWorking has not been created by driver, this listener will throw an error
        let driverRef = db.database().ref('DriversWorking')
        const geofireRef = new geofire(driverRef)
        myRef.on('value', (snap) => {
            //When driver cancels, set state which forces re-ender
            // Call this.GettingDriver()
            if (snap.val().status == 'cancelled') {
                console.log("cancelled by driver")
                this.setState({ driverFound: false })
                myRef.off('value');
                this.GettingDriver()
            }

            if (snap.val().status == 'accepted') {
                console.log("Got accepted")

                //Use Geofire to Track Location of Driver and Update driversLocation State
                geofireRef.get(key)
                    .then((location) => {
                        this.setState({ driversLocation: location })
                    })

            }

        })
    }


    GettingDriver() {
        let radius = 1
        const { driverFound } = this.state;
        let user = db.auth().currentUser;
        // We have to ensure status of ride-request of passenger is pending if
        // driver cancels ride and this function is called again.
        // Normally if ride-request of passenger remains cancelled, the listener
        // will keep calling this function
        let myRef = db.database().ref('ride-request').child(user.uid)
        myRef.update({ status: 'pending' })

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

                    console.log("Got This Driver")
                    console.log(this.state.driversLocation)
                    //Get the Name of the Driver
                    driverRef = db.database().ref('drivers').child(key)
                    driverRef.once('value', (snap) => {
                        this.setState({ driverName: snap.val().Name })
                    })

                    // Sending Notification to Driver using Driver ID key

                    driverRef.child(user.uid).update({
                        location: location,
                        Name: 'Blaizet', //We will have to use user.Name later
                        status: 'pending'
                    })

                    this.setState({
                        driverFound: true,
                        driverId: key,
                        driversLocation: location
                    })
                    //Now call function to listen if driver cancels

                }

                Geoquery.cancel();
                this.listenDriver(key, user.uid)

            })

            Geoquery.on("ready", function () {
                if (!driverFound) {
                    radius++;
                    getClosestDriver();
                }

            })
        }
        getClosestDriver();
    }


    componentDidMount() {
        this.GettingDriver();

        if (this.state.driverId) {
            console.log('Available')
            console.log(this.state.driverId)
            //this.listenDriver()
        }


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
                            <Text style={styles.commonTextStyle}>Drivers ID {this.state.driverId}</Text>
                            <Button
                                buttonStyle={{ marginTop: 20 }}
                                backgroundColor="#03A9F4"
                                title="Cancel Ride"
                                onPress={() => this.onCancel(this.state.driverId)}
                            />
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
