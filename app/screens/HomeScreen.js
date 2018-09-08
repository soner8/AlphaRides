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
import { db } from "../../config/MyFirebase";

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name: ""
        }

    }

    componentDidMount() {
        try {
            console.log("Now Trying");
            let user = db.auth().currentUser;
            let id = user.uid;

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
                    <Text>New Develop</Text>
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