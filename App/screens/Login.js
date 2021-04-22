// import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
    ToastAndroid,
    Platform,
    Alert,
    StatusBar
} from "react-native";
import api from "../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { useTheme } from '@react-navigation/native';

const logo = require("../assets/lastmeal2.png");
const darkLogo = require("../assets/lastmealdark2.png");
const statusBarHeight = Constants.statusBarHeight;

const makeStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    darkContainer: {
        flex: 1,
        // backgroundColor: "#282828",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        // marginBottom: 40,
        height: "25%",
        resizeMode: 'contain',
        // padding: 10,
        // marginBottom: 10
        margin: "10%"
    },

    inputView: {
        backgroundColor: "#6be3d9",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 30,
        // alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    },

    forgotButt: {
        height: 30,
        marginBottom: 60,
        color: colors.text
    },

    // forgotButtDark: {
    //     height: 30,
    //     marginBottom: 60,
    //     color: '#FFFFFF'
    // },

    loginButt: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        marginBottom: 30,
    },

    signupButt: {
        height: 30,
        marginBottom: 30,
        color: colors.text
        // position: "absolute"
    },

    // signupButtDark: {
    //     height: 30,
    //     marginBottom: 30,
    //     color: '#FFFFFF',
    // }
});

export default ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { colors } = useTheme();
    const styles = makeStyles(colors);

    const login = async () => {
        try {
            let response = await api.post('/user/login', {
                username: username,
                password: password
            });
            await AsyncStorage.setItem("token", response.data.token);

            // console.log('Response');
            // console.log(response);
            // console.log('here');
            // console.log(response.config.data.username);

            // get user info
            let userResponse = await api.get(`/user/${username}`);

            // saves data for the profile page
            // is there a better way to do this?
            await AsyncStorage.setItem("first", userResponse.data.first_name);
            await AsyncStorage.setItem("last", userResponse.data.last_name);
            await AsyncStorage.setItem("email", userResponse.data.email);
            await AsyncStorage.setItem("username", userResponse.data.username);

            //notifyMessage("Success!");
            navigation.navigate('Profile', { screen: 'Profile' });
            // return json;
        } catch (error) {
            notifyMessage("Invalid username/password");
            // notifyMessage(error.toString);

            console.error(error);
        }
    };

    function notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }

    return (
        // <View style={styles.container}>
        <SafeAreaView style={[styles.container, {marginTop: statusBarHeight}]}>

            {/* <StatusBar style="light-content" barStyle="light-content" backgroundColor="white" /> */}
            {/* <StatusBar style={colors.background === 'white' ? 'dark-content' : 'light-content'}  backgroundColor={colors.background}/> */}
            <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}/>

            <Image style={styles.image} source={colors.background === 'white' ? logo : darkLogo} />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity>
                <Text style={styles.forgotButt} onPress={() => navigation.navigate('ResetPassword')}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButt}
                // activeOpacity={username === '' || password === '' ? 1 : 0.5}
                disabled={!Boolean(username && password)}
                onPress={() => login()}>
                <Text>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.signupButt} onPress={() => navigation.navigate('Signup')}>or Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text onPress={() => navigation.navigate('Profile', { screen: 'Pantry' })}>[]</Text>
            </TouchableOpacity>
            </SafeAreaView>
        // </View>
    );
}
