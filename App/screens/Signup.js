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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import api from '../api/api';

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
        marginBottom: 20,
        // alignItems: "center",
        flexDirection: 'row',
        // justifyContent: 'center'
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
        // backgroundColor: 'red'
    },

    forgotButt: {
        height: 30,
        marginBottom: 60,
    },

    bigButt: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        marginBottom: 30,
    },
    smallButt: {
        height: 30,
        marginBottom: 30,
        // position: "absolute"
    },
    hidePassButt: {
        // backgroundColor: 'red',
        // height: 50,
        // flex: 1,
        // padding: 13,
        marginTop: 13,
        marginRight: 13,
        // marginLeft: 20,
    }
});

export default ({ navigation }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");

    // for show/hide password functionality
    const [hidePass, setHidePass] = useState(true);

    const register = async () => {
        try {
            let response = await api.post('/user/register', {
                username: username,
                password: password,
                email: email,
                first_name: first,
                last_name: last
            });
            // let json = await response.json();
            console.log('Response');
            console.log(response);

            // saves data for the profile page
            await AsyncStorage.setItem("first", first);
            await AsyncStorage.setItem("last", last);
            await AsyncStorage.setItem("email", email);
            await AsyncStorage.setItem("username", username);

            notifyMessage("Success!");
            navigation.navigate('Login');
            // return json;
        } catch (error) {
            notifyMessage("Invalid input");
            // notifyMessage(error);

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
            <Image style={styles.image} source={require("../assets/lastmeal.png")} />

            <StatusBar style="auto" />

            {/* Username */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>

            {/* Password */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    // secureTextEntry={true}
                    secureTextEntry={hidePass ? true : false}
                    onChangeText={(password) => setPassword(password)}
                />

                <Icon style={styles.hidePassButt}
                    name={hidePass ? 'eye-slash' : 'eye'}
                    size={18}
                    color="grey"
                    onPress={() => setHidePass(!hidePass)}
                />
            </View>

            {/* Email */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            {/* First Name */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="First Name"
                    placeholderTextColor="#003f5c"
                    onChangeText={(first) => setFirst(first)}
                />
            </View>

            {/* Last Name */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Last Name"
                    placeholderTextColor="#003f5c"
                    onChangeText={(last) => setLast(last)}
                />
            </View>

            <TouchableOpacity style={styles.bigButt}
                disabled={!Boolean(username && password && email && first && last)}
                onPress={() => register()}>
                <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.smallButt} onPress={() => navigation.navigate('Login')}>or Log In</Text>
            </TouchableOpacity>

        </View>
    );
}
