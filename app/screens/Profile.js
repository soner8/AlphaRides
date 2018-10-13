import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { onSignOut, USER } from "../auth";
import { db } from "../../config/MyFirebase";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { listenUserName } from "../../config/database";
import RNGooglePlaces from 'react-native-google-places';
import MapViewDirections from 'react-native-maps-directions';
import { Container, Icon, Left, Header, Body, Right } from 'native-base';
import { connect } from 'react-redux';
import { setUserName } from "../../UserReducer";
import { listen4Drivers } from "../../config/database";


class Profile extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      MyLocationLat: 0.02,
      MyLocationLong: 0.02,
      isLoading: true,
      driverLoading: true,
      isAuthenticated: false,
      Name: "",
      drivers: []

    }
    db.database().ref('drivers').once('value', (snap) => {
      var drivers = [];
      snap.forEach((child) => {

        console.log(child.val().latitude)
        drivers.push({
          latitude: child.val().latitude,
          longitude: child.val().longitude,


        });

      });
      const opts = {
        yName: 'latitude',
        xName: 'longitude'
      }

      const PresentLocation = { latitude: this.state.MyLocationLat, longitude: this.state.MyLocationLong }
      const sortByDistance = require('sort-by-distance')


      console.log(sortByDistance(PresentLocation, drivers, opts))
      this.setState({ drivers: drivers, isLoading: false })


      //console.log(this.state.drivers)
      //console.log(drivers[0].latitude)


    });

    AsyncStorage.getItem(USER)
      .then(res => {

        if (res == null) {
          this.setState({ Name: "" });
        }
        else {
          this.setState({ Name: res });
        }

      })
      .catch(err => reject(err));

    db.auth().onAuthStateChanged((user) => {

      if (user) {
        this.setState({
          isAuthenticated: true
        });
        let id = user.uid
        listenUserName(id, (Name) => {

          //This sends action to redux to store for us
          this.props.setUserName(Name)

          //Below Stores Name of User for future Reference
          AsyncStorage.setItem(USER, Name)
        });

      }
    });

  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      (position) => {


        this.setState({
          MyLocationLat: position.coords.latitude,
          MyLocationLong: position.coords.longitude,

          error: null,

          Name: "",


        });







        //After Sorting u can now slice it and reset drivers to the new sliced list

      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );


  }
  SignOut = () => {
    db.auth().signOut()
      .then(() => onSignOut())
      .then(() => this.props.navigation.navigate("SignedOut"))
  }





  onSearchPlace = () => {
    this.props.navigation.navigate("SearchPlace");
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      )
    }


    else {

      const PresentLocation = { latitude: this.state.MyLocationLat, longitude: this.state.MyLocationLong }
      const destination = { latitude: 6.465422, longitude: 3.406448 };
      const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';

      return (
        <Container>
          {/*<TouchableOpacity
          style={styles.button}
          onPress={() => this.openSearchModal()}
        >
          <Text>Pick a Place</Text>
        </TouchableOpacity>*/}

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: this.state.MyLocationLat,
              longitude: this.state.MyLocationLong,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation={true}
          >
            <MapView.Marker coordinate={PresentLocation} />
            {

              this.state.drivers.map((driver) => (
                < MapView.Marker coordinate={{
                  latitude: driver.latitude,
                  longitude: driver.longitude,
                }}
                  style={{ width: 10, height: 10 }}
                  image={require('../images/car-marker3.png')} />
              ))
            }


            {/*<MapView.Marker coordinate={origin} />
          <MapView.Marker coordinate={destination} />
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
        />*/}
          </MapView>
          <Header transparent>
            <Left>

              <Icon name="ios-menu" onPress={() =>
                this.props.navigation.openDrawer()} />

            </Left>
            <Body />
            <Right />
          </Header>

          { // Below is what gets data from redux store 
          }
          <Text style={{ color: 'blue' }}>{this.props.User.currentUserName}</Text>

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Where To"
            onPress={() => this.onSearchPlace()}
          />
        </Container>
      )
    }
    /*
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="John Doe">
          <View
            style={{
              backgroundColor: "#bcbec1",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>JD</Text>
          </View>
          <Button
            backgroundColor="#03A9F4"
            title="SIGN OUT"
            onPress={this.SignOut.bind(this)}
          />
        </Card>
      </View>
    );*/
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
const mapDispatchToProps = (dispatch) => {
  return {
    setUserName: (text) => { dispatch(setUserName(text)) }
  };
}
const mapStateToProps = (state) => {
  const { User } = state
  return { User }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);