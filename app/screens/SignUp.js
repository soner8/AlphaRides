import React, { Component } from 'react';
import { View, Alert } from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn, firstUser } from "../auth";
import { db } from "..config/firebase";
import Database from "..config/Database";

export default class SignUp extends Component {

  constructor(props) {
    this.state = {
      Name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      error: ""
      
    }
  }

  AsyncStoreFirstUser = (userid) => {
    firstUser()
    .then(() => onSignIn())
    .then(() => this.props.navigation.navigate("HomeStack", {userid}))
  }

  SaveDbDetails = () => {
    let user = await db.auth().currentUser;

    if(this.state.Name){
      Database.setUserName(user.uid, this.state.Name)
      
      return (user.uid);
    }
  }

  onSignupPress = () => {
    if (this.state.password != this.state.passwordConfirm){
      Alert.alert("Password Did Not Match");
      return;
    }
    db.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => this.SaveDbDetails())
    .then((id) => this.AsyncStoreFirstUser(id))
    .catch(() => this.setState({error: "Authentication Failed"}))
    
  }

  render() {
    const { Name, email, password, passwordConfirm } = this.state;
    return (
      <View style={{ paddingVertical: 20 }}>
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
            onPress={() => this.onSignupPress()}
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