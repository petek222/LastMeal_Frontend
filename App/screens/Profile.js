import React from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Avatar } from "react-native-elements";

import { SafeAreaView } from 'react-native-safe-area-context';
import { Thumbnail } from 'native-base';

import Constants from 'expo-constants';


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
    }
})

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

export default ({ navigation }) => {
    return (
        // <SafeAreaView style={{ marginTop: statusBarHeight, backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView style={{backgroundColor: 'white', flex: 1 }}>
        // <SafeAreaView >
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>

            <Text style={{ fontSize: 40 }}>Profile</Text>
            {/* <Image style={styles.image} source={require("../assets/profilepic.jpg")} /> */}
            <Avatar
                avatarStyle={{
                    borderWidth: 3,
                    borderColor: '#6be3d9'
                }}
                rounded
                source={require("../assets/profilepic.jpg")}
                size="xlarge"
            />

            <UserInfo title={'Name'} info={'Bobb'} />
            <UserInfo title={'Username'} info={'Bobbb'} />
            <UserInfo title={'Email'} info={'Bobbbb'} />
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