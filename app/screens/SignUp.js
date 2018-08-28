import React, { Component } from 'react';
import { View } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";

export default class SignUp extends Component {

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title="SIGN UP">
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
          <Input
            label="Confirm Password"
            placeholder='Confirm Password'
            secureTextEntry={true}
            errorStyle={{ color: 'red' }}
            errorMessage='Password must be more than 4 characters'
          />

          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="#03A9F4"
            title="SIGN UP"
            onPress={() => {
              onSignIn().then(() => this.props.navigation.navigate("HomeStack"));
            }}
          />
          <Button
            buttonStyle={{ marginTop: 20 }}
            backgroundColor="transparent"
            textStyle={{ color: "#bcbec1" }}
            title="Sign In"
            onPress={() => this.props.navigation.navigate("SignIn")}

          />
        </Card>
      </View>
    );
  }
}