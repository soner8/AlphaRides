import React, { Component } from 'react';
import { View, Text, Button } from "react-native";
import MaterialIcons from "react-native-vector-icons";

export default class MyNotificationsScreen extends Component {
    static navigationOptions = {
        drawerLabel: 'Notifications',
        drawerIcon: ({ tintColor }) => (
            <Image
                source={require('../images/user.png')}
                style={[styles.icon, { tintColor: tintColor }]}
            />
        )
    };

    render() {
        return (
            <Button
                onPress={() => this.props.navigation.navigate('MyProfile')}
                title="Go to Profile"
            />
        );
    }
}