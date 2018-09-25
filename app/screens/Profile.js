import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, AsyncStorage } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";
import { db } from "../../config/MyFirebase";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import MapViewDirections from 'react-native-maps-directions';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MyLocationLat: 9.0680151,
      MyLocationLong: 7.388884,
    }
    RNGooglePlaces.getCurrentPlace()
      .then((result) => {
        this.setState({
          MyLocationLat: result[4].latitude,
          MyLocationLong: result[4].longitude
        });
      })
      .catch((error) => console.log(error));


  }

  componentDidMount() {
    RNGooglePlaces.getCurrentPlace()
      .then((result) => {
        this.setState({
          MyLocationLat: result[4].latitude,
          MyLocationLong: result[4].longitude
        });
      })
      .catch((error) => console.log(error));

  }
  SignOut = () => {
    db.auth().signOut()
      .then(() => onSignOut())
      .then(() => this.props.navigation.navigate("SignedOut"))
  }

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  render() {
    const origin = { latitude: this.state.MyLocationLat, longitude: this.state.MyLocationLong };
    const destination = { latitude: 6.465422, longitude: 3.406448 };
    const GOOGLE_MAPS_APIKEY = 'AIzaSyBIXZvDmynO3bT7i_Yck7knF5wgOVyj5Fk';
    return (
      <View style={styles.container}>
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
            latitudeDelta: 1,
            longitudeDelta: 1,
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
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="Where To"
        />
      </View>
    )
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
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject }

})