import React, { Component } from 'react';

import {

    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Card, Button, } from "react-native-elements";

export default class HomeScreen extends Component {
    onProfile = () => {
        this.props.navigation.navigate("Profile");
    }
    render() {
        return (
            <View>
                <Card>
                    <Text>Hello AlphaRides CEO</Text>
                    {
                        console.log(this.props.navigation.state)
                    }
                    <Button
                        buttonStyle={{ marginTop: 20 }}
                        backgroundColor="#03A9F4"
                        title="Profile"
                        onPress={() => this.onProfile()}
                    />
                </Card>
            </View>
        );
    }
}