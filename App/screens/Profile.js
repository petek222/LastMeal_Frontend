import React, { createContext, useState, useEffect, useReducer } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Avatar } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gravatar, GravatarApi } from 'react-native-gravatar';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

import Constants from 'expo-constants';
import { Component } from 'react';

const screen = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;
const cardWidth = screen.width * 0.9;
const cardHeight = screen.height * 0.12;

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight
    },

    section: {
        // flex: 1,
        // flexDirection: 'row',
        width: cardWidth,
        height: cardHeight / 1.5,
        margin: '2%',
        borderRadius: 10,
        // borderColor: '#E2E2E2',
        // borderWidth: 2,
        // shadowOffset: {
        //     width: 2,
        //     height: 4,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        backgroundColor: 'white'
    },
    sectionTitle: {
        color: '#6be3d9',
        fontSize: 20,
        // padding
    },
    sectionInfo: {
        // color: 'cyan',
        fontSize: 16,
        // padding
    },
    separator: {
        backgroundColor: "gray",
        height: StyleSheet.hairlineWidth,
        // marginLeft: 20,
        // marginRight: 20,
    },
    image: {
        // marginBottom: 40,
        height: "30%",
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    safeAreaView: {
        height: "100%",
        width: "200%"
    },
    roundedProfileImage: {
        width: 150, height: 150, borderWidth: 3,
        borderColor: '#6be3d9', borderRadius: 75
    }
})

// Component for each bit of user info
const UserInfo = ({ title, info }) => {
    return (
        <View style={styles.section}>
            <View style={{ padding: 10 }}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionInfo}>{info}</Text>
            </View>
            <View style={styles.separator} />
        </View>
    )
}

// const UserContext = createContext('nope');

const getFirst = async () => {
    try {
        const user = await AsyncStorage.getItem('first');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getName = async () => {
    try {
        const user = await AsyncStorage.getItem('first') + ' ' + await AsyncStorage.getItem('last');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getEmail = async () => {
    try {
        const user = await AsyncStorage.getItem('email');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getUsername = async () => {
    try {
        const user = await AsyncStorage.getItem('username');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

export default ({ navigation }) => {
    // const [user, dispatch] = useReducer(userReducer, {});
    const [first, setFirst] = useState("Developer");
    const [name, setName] = useState("Developer Account");
    const [email, setEmail] = useState("none");
    const [username, setUsername] = useState("none");
    const [avatarUrl, setAvatar] = useState("");


    // fetch user info on load
    useEffect(() => {
        async function fetchUser() {
            const first = await getFirst();
            const name = await getName();
            const username = await getUsername();
            const email = await getEmail();
            setFirst(first);
            setName(name);
            setUsername(username);
            setEmail(email);

            // let gravatar = require('gravatar');
            // const picUrl = gravatar.url(email, {s: '200'});
            // setAvatar(picUrl);
        }
        fetchUser();
    }, []);

    return (
        // <SafeAreaView style={{ marginTop: statusBarHeight, backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView style={{backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView >
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>

            <Text style={{ fontSize: 40 }}>Hi, {first}</Text>
            {/* <Image style={styles.image} source={require("../assets/profilepic.jpg")} /> */}
            {/* <Avatar
                avatarStyle={{
                    borderWidth: 3,
                    borderColor: '#6be3d9'
                }}
                rounded
                // source={require("../assets/profilepic.jpg")}
                source={avatarUrl}
                size="xlarge"
            /> */}

            <Gravatar options={{
                email: email,
                parameters: { "size": "500", "d": "mm" },
                secure: true
            }}
                style={styles.roundedProfileImage} />

            <UserInfo title={'Name'} info={name} />
            <UserInfo title={'Username'} info={username} />
            <UserInfo title={'Email'} info={email} />

            <TouchableOpacity style={styles.bigButt}
                onPress={async () => await schedulePushNotification()}>
                <Text style={styles.loginText}>Test Push Notifications in-app</Text>
            </TouchableOpacity>

            {/* <View style={{position: 'absolute', right: 0}}> */}
            <View style={{ position: 'absolute', bottom: 10 }}>
                {/* <View style={{flexDirection: 'row-reverse'}}> */}

                <TouchableOpacity>
                    <Text onPress={() => navigation.navigate('Login')}>Log Out</Text>
                </TouchableOpacity>
            </View>

        </View>
        // </SafeAreaView>
        // </SafeAreaView>
    )
}

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your food bad",
        body: 'Uh oh',
        data: { data: 'data' },
      },
      trigger: { seconds: 2 },
    });
  }