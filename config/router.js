import React from 'react';
import { Text, Colors, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { StackNavigator, SwitchNavigator, DrawerItems, createDrawerNavigator, HeaderBackButton } from "react-navigation";
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
import { Container, Icon, Left, Content, Header, Body, Right } from 'native-base';

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
        screen: Profile
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
const DrawerContent = (props) => (
    <Container>
        <Header style={{ height: 200 }}>
            <Body>
                <Image style={styles.drawerImage}
                    source={require('../app/images/user.png')} />
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props} />
        </Content>
    </Container>
);




export const HomeStack = createDrawerNavigator({
    /*HomeScreen: {
         screen: HomeScreen,
         navigationOptions: {
             title: "Home",
 
         }
     },*/
    Home: {
        screen: MyApp
    },

    MyProfile: {
        screen: MyProfile

    },
    MyNotificationsScreen: {
        screen: MyNotificationsScreen
    }

}, {
        initialRouteName: 'Home',
        drawerPosition: 'left',
        contentComponent: DrawerContent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle'

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

const styles = StyleSheet.create({
    drawerImage: {
        width: 150,
        height: 150,
        borderRadius: 75
    },
});