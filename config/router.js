import React from 'react';
import { StackNavigator, SwitchNavigator, createDrawerNavigator } from "react-navigation";
import HomeScreen from "../app/screens/HomeScreen";
import SignIn from "../app/screens/SignIn";
import SignUp from "../app/screens/SignUp";
import Profile from "../app/screens/Profile";
import BookRide from "../app/screens/BookRide";
import SearchPlace from "../app/screens/SearchPlace";
import MyProfile from "../app/screens/MyProfile";
import MyNotificationsScreen from "../app/screens/MyNotificationsScreen";
import ForgotPassword from "../app/screens/ForgotPassword";
import MaterialIcons from "react-native-vector-icons";

export const NewUser = StackNavigator({
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up",
            gesturesEnabled: false,

        }
    }
});

export const SignedOut = StackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In",

        }
    },
    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
            title: "Forgot Password",

        }
    },

});

export const MyApp = StackNavigator({
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: "Profile",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="user" size={30} color={tintColor} />
            )
        }
    },
    SearchPlace: {
        screen: SearchPlace,
        navigationOptions: {
            tabBarLabel: "Search",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="user" size={30} color={tintColor} />
            )
        }
    },
    BookRide: {
        screen: BookRide,
        navigationOptions: {
            tabBarLabel: "Profile",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="user" size={30} color={tintColor} />
            )
        }
    }
});

export const HomeStack = createDrawerNavigator({
    HomeScreen: {
        screen: HomeScreen,
        navigationOPtions: {
            title: "AlphaRides",
            headerStyle: {
                backgroundColor: "purple"
            },
            headerTintColor: "#fff"
        }
    },

    MyProfile: {
        screen: MyProfile,
        navigationOPtions: {
            drawerLabel: 'My Profile',
            drawerIcon: ({ tintColor }) => {
                return (
                    <MaterialIcons
                        name="card-membership"
                        size={24}
                        style={{ color: tintColor }}>
                    </MaterialIcons>

                );
            }
        }

    },
    MyNotificationsScreen: {
        screen: MyNotificationsScreen
    }

});

export const createRootNavigator = (signedIn = false) => {
    return SwitchNavigator(
        {
            HomeStack: {
                screen: HomeStack
            },
            MyApp: {
                screen: MyApp
            },
            SignedOut: {
                screen: SignedOut
            }

        },
        {
            initialRouteName: signedIn ? "HomeStack" : "SignedOut"
        }
    );
};

export const NewUserRootNavigator = (val = true) => {
    return SwitchNavigator({
        NewUser: {
            screen: NewUser
        },
        HomeStack: {
            screen: HomeStack
        },
        MyApp: {
            screen: MyApp
        },
        SignedOut: {
            screen: SignedOut
        }


    },
        {

            initialRouteName: val ? "NewUser" : "HomeStack"
        }
    );
};