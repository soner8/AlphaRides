import React, { Component } from 'react';
import { View, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn, firstUser } from "../auth";
import { db } from "../../config/MyFirebase";
import Database from "../../config/database";
import geofire from 'geofire';
import { StackActions, NavigationActions} from "react-navigation"

export default class SignUp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      error: "",
      authenticating: false

    }
  }

  // This function from our auth.js uses AsyncStorage to store FirstTime User
  AsyncStoreFirstUser = (Name) => {

    firstUser(Name)
      .then(() => onSignIn())
      .then(() => {
        console.log('About to Navigate');
        this.props.navigation.navigate("Drawer", { userName: Name })
      })
  }

  SaveDbDetails = () => {
    let user = db.auth().currentUser;
    //let DriverId = '-LOgt93XjWGZx15IxJJA'

    /*db.database.ref('user')
      .child(user.uid)
      .set({ Name: this.state.Name })*/
    let userName = "/user/" + user.uid + "/details";
    db.database().ref(userName).set({
      Name: this.state.Name
    })
    //let Driver = db.database().ref("/DriversAvaliable")
    //const geofireRef = new geofire(Driver)
    //geofireRef.set(DriverId, [9.062032349610963, 7.391128392096082])

    return (user.uid)


    /*if (this.state.Name) {


      Database.setUserName(user.uid, this.state.Name)
        .then((data) => { console.log(data) })
      
      return (user.uid);
    }*/
  }

  // This function below uses firebase to create user with email and password
  // And also it Saves User Info to Database including using AsyncStorage to
  // to store Name

  onSignInPress = () => {
    console.log('Navigate Now')
    var navActions = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "SignIn" })
      ]
    });

    this.props.navigation.dispatch(navActions);
    console.log('Whats goin on now')
  }

  onSignupPress = () => {

    if (this.state.password != this.state.passwordConfirm) {
      Alert.alert("Password Did Not Match");
      return;
    }
    this.setState({ authenticating: true })
    db.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.SaveDbDetails())
      .then((id) => this.AsyncStoreFirstUser(this.state.Name))
      //.catch((error) => this.setState({ error: "Authentication Failed" }))
      .catch((error) => console.log(error))




  }

  render() {
    const { Name, email, password, passwordConfirm } = this.state;
    if (this.state.authenticating) {
      return (
        <View>
          <ActivityIndicator size='large' color="#00ff00" />
        </View>
      )
    }
    return (
      <View style={{ paddingVertical: 20 }}>
        <ScrollView>
          <Card title="SIGN UP">
            <Input
              label="Name"
              placeholder='Name'
              onChangeText={Name => this.setState({ Name })}
              errorStyle={{ color: 'red' }}
              errorMessage='Enter Your Name'
            />
            <Input
              label="Email Address"
              placeholder='Email'
              onChangeText={email => this.setState({ email })}
              errorStyle={{ color: 'red' }}
              errorMessage='Enter a Valid Email Address'
            />
            <Input
              label="Password"
              placeholder='Password'
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
              errorStyle={{ color: 'red' }}
              errorMessage='Password must be more than 4 characters'
            />
            <Input
              label="Confirm Password"
              placeholder='Confirm Password'
              onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
              secureTextEntry={true}
              errorStyle={{ color: 'red' }}
              errorMessage='Password must be more than 4 characters'
            />

            <Button
              buttonStyle={{ marginTop: 20 }}
              backgroundColor="#03A9F4"
              title="SIGN UP"
              onPress={this.onSignupPress.bind(this)}
            />
            <Button
              buttonStyle={{ marginTop: 20 }}
              backgroundColor="transparent"
              textStyle={{ color: "#bcbec1" }}
              title="Sign In"
              onPress={() => this.onSignInPress()}

            />
          </Card>
        </ScrollView>
      </View>
    );
  }

}