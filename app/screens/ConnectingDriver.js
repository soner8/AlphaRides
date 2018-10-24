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
            driverName: ""

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
                        location: location
                    })
                    //Get the Name of the Driver
                    driverAvailableRef = db.database().ref('DriversAvaliable').child(key)
                    driverAvailableRef.once('value', (snap) => {
                        this.setState({ driverName: snap.val().Name })
                    })

                    // Sending Notification to Driver using Driver ID key
                    driverRef = db.database().ref('drivers').child(key)
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
    render() {
        const { driverFound } = this.state;
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
                <View>
                    <Text style={{ color: 'blue' }}>Base UNi</Text>
                    <Text style={{ color: 'blue' }}>Got A Driver</Text>

                </View>
                <SlidingPanel
                    headerLayoutHeight={100}
                    headerLayout={() =>
                        <View style={styles.headerLayoutStyle}>
                            <Text style={styles.commonTextStyle}>{this.state.driverName}</Text>
                        </View>
                    }
                    slidingPanelLayout={() =>
                        <View style={styles.slidingPanelLayoutStyle}>
                            <Text style={styles.commonTextStyle}>Drivers Location{this.state.location}</Text>
                            <Text style={styles.commonTextStyle}>Drivers ID {this.state.driverID}</Text>
                        </View>
                    }
                />
            </View>
        )

    }
}

const styles = StyleSheet.create({
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
