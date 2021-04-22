import React, { createContext, useState, useEffect, useReducer } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Avatar } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gravatar, GravatarApi } from 'react-native-gravatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@react-navigation/native';

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
        // backgroundColor: 'white'
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
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    // safeAreaView: {
    //     height: "100%",
    //     width: "200%"
    // },
    roundedProfileImage: {
        width: 150, height: 150, borderWidth: 3,
        borderColor: '#6be3d9', borderRadius: 75
    }
})

// Component for each bit of user info
const UserInfo = ({ title, info, themeText }) => {
    return (
        <View style={styles.section}>
            <View style={{ padding: 10 }}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={[styles.sectionInfo, { color: themeText }]}>{info}</Text>
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

    const { colors } = useTheme();

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
        }
        fetchUser();
    }, []);

    return (
        // <SafeAreaView style={{ marginTop: statusBarHeight, backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView style={{backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView >
        <View style={styles.container}>
            {/* <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar> */}
            <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>

            <Text style={{ fontSize: 40, marginBottom: screen.height * 0.05, color: colors.text }}>Hi, {first}</Text>

            <Gravatar options={{
                email: email,
                parameters: { "size": "500", "d": "mm" },
                secure: true
            }}
                style={styles.roundedProfileImage} />

            <UserInfo title={'Name'} info={name} themeText={colors.text} />
            <UserInfo title={'Username'} info={username} themeText={colors.text} />
            <UserInfo title={'Email'} info={email} themeText={colors.text} />

            {/* <View style={{position: 'absolute', right: 0}}> */}
            <View style={{ position: 'absolute', bottom: 10 }}>
                {/* <View style={{flexDirection: 'row-reverse'}}> */}

                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('Login');
                }}>
                    <Text style={{color: colors.text}}>Log Out</Text>
                </TouchableOpacity>
            </View>

        </View>
        // </SafeAreaView>
        // </SafeAreaView>
    )
}
