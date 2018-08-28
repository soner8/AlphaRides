import { StackNavigator, SwitchNavigator } from "react-navigation";
import HomeScreen from "../app/screens/HomeScreen";
import SignIn from "../app/screens/SignIn";
import SignUp from "../app/screens/SignUp";
import Profile from "../app/screens/Profile";

export const NewUser = StackNavigator({
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            title: "Sign Up",

        }
    }
});

export const SignedOut = StackNavigator({
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: "Sign In",

        }
    }

});


export const HomeStack = StackNavigator({
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
    Profile: {
        screen: Profile,
        navigationOptions: {
            tabBarLabel: "Profile",
            tabBarIcon: ({ tintColor }) => (
                <FontAwesome name="user" size={30} color={tintColor} />
            )
        }
    }
});

export const createRootNavigator = (signedIn = false) => {
    return SwitchNavigator(
        {
            HomeStack: {
                screen: HomeStack
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

export const NewUserRootNavigator = StackNavigator({
    NewUser: {
        screen: NewUser
    },
    HomeStack: {
        screen: HomeStack
    },
    SignedOut: {
        screen: SignedOut
    }

});