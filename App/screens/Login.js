import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import api from "../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        // marginBottom: 40,
        height: "30%",
        resizeMode: 'contain',
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
    },

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
        // position: "absolute"
    }
});

export default ({ navigation }) => {
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            let response = await api.post('/user/login', {
                    username: username,
                    password: password
                });
            await AsyncStorage.setItem("token", response.data.token);

            notifyMessage("Success!");
            navigation.navigate('Profile', { screen: 'Pantry' });
            // return json;
        } catch (error) {
            notifyMessage("Invalid username/password");
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
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/logo.png")} />

            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    onChangeText={(username) => setusername(username)}
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
                <Text style={styles.forgotButt}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButt}
                // activeOpacity={username === '' || password === '' ? 1 : 0.5}
                disabled={!Boolean(username && password)}
                onPress={() => login()}>
                <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.signupButt} onPress={() => navigation.navigate('Signup')}>or Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text onPress={() => navigation.navigate('Profile', { screen: 'Pantry' })}>Click Me</Text>
            </TouchableOpacity>
        </View>
    );
}
