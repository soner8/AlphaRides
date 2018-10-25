import React, { Component } from "react";
import { createRootNavigator, NewUserRootNavigator, HomeStack } from "./config/router";
import { isSignedIn, isFirstUser } from "./app/auth";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import UserReducer from './UserReducer';

// Redux Store for User
const store = createStore(UserReducer);



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstTimeUser: true,
      signedIn: false,
      checkedSignIn: false
    };

    // This function from our auth.js checks if this user if a FIRST TIME USER
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
      return (
        <Provider store={store}>
          <NewUserLayout />
        </Provider>
      )
    }
    // Sends signedIn state as parameter to Navigator in router.js file
    const Layout = createRootNavigator(signedIn);
    return (
      <Provider store={store}>
        <Layout />
      </Provider>
    )

  }
}
