import React, { Component } from "react";
import { RootNavigator } from "./config/router";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import UserReducer from './UserReducer';
import { db } from "./config/MyFirebase";

// Redux Store for User
const store = createStore(UserReducer);



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false
    };

    db.auth().onAuthStateChanged(this.onAuthStateChanged)


  }

  onAuthStateChanged = (user) => {
    this.setState({ isAuthenticationReady: true });
    this.setState({ isAuthenticated: !!user });

  };

  render() {

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!this.state.isLoadingComplete && !this.state.isAuthenticationReady) {
      return null;
      //OR
      // return <ActivityIndicator />
    }


    // Sends signedIn state as parameter to Navigator in router.js file
    const Layout = RootNavigator(this.state.isAuthenticated);
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    )

  }
}
