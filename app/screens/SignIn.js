import React, { Component } from 'react';
import { View, ActivityIndicator } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";
import { db } from "../../config/MyFirebase";
import { StackActions, NavigationActions } from "react-navigation"

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      authenticating: false

    }
  }

  onCreateAccount = () => {
    console.log('Navigate Now')
    var navActions = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: "SignUp" })
      ]
    });

    this.props.navigation.dispatch(navActions);
    console.log('Whats goin on now')
  }

  UserSignIn = () => {
    this.setState({ authenticating: true });
    db.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => onSignIn())
      .then(() => {
        let user = db.auth().currentUser;
        console.log(user.uid);
        this.props.navigation.navigate("Drawer")
        /*this.props.navigation.navigate("HomeScreen", { idd: user.uid })*/
      })

      .catch((error) =>
        /// We should Provide a way to tell user if this failed to authenticate
        /// instead of constantly loading the activity indicator
        console.log("No Authentication"))
  }

  render() {
    if (this.state.authenticating) {
      return (
        <View>
          <ActivityIndicator size='large' />
        </View>
      )
    }
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="SIGN IN">
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

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN IN"
            onPress={this.UserSignIn.bind(this)}
          />
          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Forgot Password"
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
          />
          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="Sign Up"
            onPress={() => this.onCreateAccount()}
          />
        </Card>
      </View>
    );
  }
}
