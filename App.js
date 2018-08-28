import React, { Component } from "react";

import { createRootNavigator } from "./config/router";
import { isSignedIn } from "./app/auth";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeUser: true,
      signedIn: false,
      checkedSignIn: false
    };
  }
  // checks for status of user in our auth.js file
  // Sets signedIn to 'true' if user is in local storage else sets to 'false'
  componentDidMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => console.log(err));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
      //OR
      // return <ActivityIndicator />
    }
    // Sends signedIn state as parameter to Navigator in router.js file
    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
