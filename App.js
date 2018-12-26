import React, { Component } from "react";
import { RootNavigator } from "./config/router";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import UserReducer from './UserReducer';
import { db } from "./config/MyFirebase";
import firebase from 'react-native-firebase';

// Redux Store for User
const store = createStore(UserReducer);



export default class App extends Component {
  constructor(props) {
    super(props);

    this.unsubscriber = null;
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
      isUnmounted: false

    };
    this.unsubscriber = firebase.auth().onAuthStateChanged(this.onAuthStateChanged)

  }

  onAuthStateChanged = (user) => {
    console.log("authenticated Now")
    console.log(user)
    this.setState({ isAuthenticationReady: true });
    this.setState({ isAuthenticated: !!user });
    this.unsubscriber();
    console.log('Zaza')

  };




  componentWillUnmount() {
    console.log('Unmounting')
  }


  render() {
    console.log('It is Showing')
    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!this.state.isLoadingComplete && !this.state.isAuthenticationReady) {
      return null;
      //OR
      // return <ActivityIndicator />
    }


    // Sends signedIn state as parameter to Navigator in router.js file
    const Layout = RootNavigator(this.state.isAuthenticated);

    console.log("Repeated Again")
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    )

  }
}
