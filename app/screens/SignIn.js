import React, { Component } from 'react';
import { View } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";
import { db } from "../../config/MyFirebase";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""

    }
  }

  UserSignIn = () => {
    db.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => onSignIn())
      .then(() => {
        let user = db.auth().currentUser;
        console.log(user.uid);
        this.props.navigation.navigate("HomeScreen", { idd: user.uid })
      })

      .catch((error) => console.log("No Authentication"))
  }

  render() {
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
        </Card>
      </View>
    );
  }
}
