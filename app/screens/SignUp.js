import React, { Component } from 'react';
import { View, Alert, ScrollView, ActivityIndicator } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn, firstUser } from "../auth";
import { db } from "../../config/MyFirebase";
import Database from "../../config/database";

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

  AsyncStoreFirstUser = (Name) => {

    firstUser(Name)
      .then(() => onSignIn())
      .then(() => {
        console.log('About to Navigate');
        this.props.navigation.navigate("Profile")
      })
  }

  SaveDbDetails = () => {
    let user = db.auth().currentUser;
    let driverRef = db.database().ref('/drivers').push();
    let userName = "/user/" + user.uid + "/details";
    db.database().ref(userName).set({
      Name: this.state.Name
    })
    driverRef.update({
      Name: 'Klamaric',
      latitude: 6.92432793,
      longitude: 3.493792057
    })

    return (user.uid)


    /*if (this.state.Name) {


      Database.setUserName(user.uid, this.state.Name)
        .then((data) => { console.log(data) })
      
      return (user.uid);
    }*/
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
              onPress={() => this.props.navigation.navigate("SignIn")}

            />
          </Card>
        </ScrollView>
      </View>
    );
  }

}