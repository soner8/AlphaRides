import React, { Component } from 'react';

import {

    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Card, Button, } from "react-native-elements";
import { listenUserName } from "../../config/database";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            userId: this.props.navigation.state.params.idd,
            Name: "",
        }
        console.log(this.state.userId);
    }

    componentDidMount() {
        try {
            console.log("Now Trying");

            let id = this.state.userId;

            // Listen for Name Changes with a callback
            listenUserName(id, (Name) => {
                this.setState({
                    Name: Name

                });
            });


        } catch (error) {
            console.log(error);
        }

    }
    onProfile = () => {
        this.props.navigation.navigate("Profile");
    }
    render() {
        const { Name } = this.state;
        return (
            <View>
                <Card>
                    <Text>Hello AlphaRides CEO Develop</Text>
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