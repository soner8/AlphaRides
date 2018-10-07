import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";
import { db } from "../../config/MyFirebase";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import MapViewDirections from 'react-native-maps-directions';
import { Container, Icon, Left, Header, Body, Right } from 'native-base';

export default class Profile extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    this.state = {
      MyLocationLat: null,
      MyLocationLong: null,
      isLoading: true
    }

  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          MyLocationLat: position.coords.latitude,
          MyLocationLong: position.coords.longitude,
          error: null,
          isLoading: false
        });
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

  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
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
        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="Where To"
          onPress={() => this.onSearchPlace()}
        />
      </Container>
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

  map: { ...StyleSheet.absoluteFillObject },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }

})