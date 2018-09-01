import React, { Component } from 'react';
import { View } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";

export default class SignIn extends Component {
  constructor(props) {
    this.state = {
      email: "",
      password: "",
    }
  }
  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="SIGN IN">
          <Input
            label="Email Address"
            placeholder='Email'
            errorStyle={{ color: 'red' }}
            errorMessage='Enter a Valid Email Address'
          />
          <Input
            label="Password"
            placeholder='Password'
            secureTextEntry={true}
            errorStyle={{ color: 'red' }}
            errorMessage='Password must be more than 4 characters'
          />

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN IN"
            onPress={() => {
              onSignIn().then(() => this.props.navigation.navigate("HomeScreen"));
            }}
          />
        </Card>
      </View>
    );
  }
}
