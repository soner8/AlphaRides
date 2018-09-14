import React, { Component } from "react";
import { createRootNavigator, NewUserRootNavigator, HomeStack } from "./config/router";
import { isSignedIn, isFirstUser } from "./app/auth";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeUser: true,
      signedIn: false,
      checkedSignIn: false
    };
    isFirstUser()
      .then(res => this.setState({
        signedIn: false,
        firstTimeUser: res,
        checkedSignIn: false
      }))
      .catch(err => console.log(err));
  }
  // checks for status of user in our auth.js file
  // Sets signedIn to 'true' if user is in local storage else sets to 'false'
  componentDidMount() {

    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => console.log(err));
  }

  render() {
    const { checkedSignIn, signedIn, firstTimeUser } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
      //OR
      // return <ActivityIndicator />
    }
    if (firstTimeUser) {
      const NewUserLayout = NewUserRootNavigator();
      return <NewUserLayout />;
    }
    // Sends signedIn state as parameter to Navigator in router.js file
    const Layout = createRootNavigator(signedIn);
    return <Layout />;
  }
}
