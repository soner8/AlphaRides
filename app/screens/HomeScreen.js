import React, { Component } from 'react';

import {

    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { Card, Button, } from "react-native-elements";
import Database from "../../config/firebase";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            userId: this.props.navigation.state.params.userid,
            Name: ""
        }
    }

    componentDidMount() {
        try {




            // Listen for Name Changes with a callback
            Database.listenUserName(user.uid, (Name) => {
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
        return (
            <View>
                <Card title={this.state.Name}>
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