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
import { useTheme } from '@react-navigation/native';
import DismissKeyboard from "../config/DismissKeyboard.js";
import Ionicons from 'react-native-vector-icons/Ionicons';

const logo = require("../assets/lastmeal2.png");
const darkLogo = require("../assets/lastmealdark2.png");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        height: "25%",
        resizeMode: 'contain',
        margin: "10%"
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
    const [userEmail, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // for show/hide password functionality
    const [hidePass, setHidePass] = useState(true);
    const [hideNewPass, setHideNewPass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true)

    const { colors } = useTheme();

    const BackArrow = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} >
            <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: '90%'}}/>
        </TouchableOpacity>
        )
    }

    // Function for performing password reset
    const changePassword = async () => {
        try {

            let response = await api.get(`/user/${username}`);

            console.log("HELP Password Response")
            console.log(response)

            // If username-email combo correct
            if (response.data.email == userEmail) {
                // If the confirm password matches the new password
                if (newPassword === confirmNewPassword) {
                    console.log("Properly Matched! Executing Reset Request...") // Make the request
                    try {
                        let response = await api.put(`/user/password/${username}`, {
                            password: newPassword
                        });
                        console.log(response)
                        if (response.status == 201) {
                            notifyMessage("Password Changed Successfully");
                            navigation.navigate('Login', { screen: 'Login' }); // navigate back to login upon success
                        }
                    }
                    catch (error) {
                        console.log(error)
                        notifyMessage("An Error Has Occurred");
                    }
                }
                // If the confirm password doesnt match the new password
                else {
                    console.log("New Password and Confirm Password do not Match")
                    notifyMessage("New Passwords Do Not Match");
                }
            }
            // If username-password combo incorrect / doesnt exist
            else {
                console.log("Username/Email Incorrect")
                notifyMessage("Username/Email Incorrect");
            }

        } catch (error) {
            notifyMessage("Username/Email Incorrect"); 
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
        <DismissKeyboard>
            <View style={styles.container}>
                <BackArrow/>
                <Image style={styles.image} source={colors.background === 'white' ? logo : darkLogo} />

                {/* <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background} /> */}


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

                {/* Email */}
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="#003f5c"
                        autoCapitalize="none"
                        // secureTextEntry={true}
                        onChangeText={(userEmail) => setEmail(userEmail)}
                    />
                </View>

                {/* New Password */}
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="New Password"
                        placeholderTextColor="#003f5c"
                        // secureTextEntry={true}
                        secureTextEntry={hideNewPass ? true : false}
                        onChangeText={(password) => setNewPassword(password)}
                    />

                    <Icon style={styles.hidePassButt}
                        name={hideNewPass ? 'eye-slash' : 'eye'}
                        size={18}
                        color="grey"
                        onPress={() => setHideNewPass(!hideNewPass)}
                    />
                </View>

                {/* Confirm New Password */}
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Confirm New Password"
                        placeholderTextColor="#003f5c"
                        // secureTextEntry={true}
                        secureTextEntry={hideConfirmPass ? true : false}
                        onChangeText={(password) => setConfirmNewPassword(password)}
                    />

                    <Icon style={styles.hidePassButt}
                        name={hideConfirmPass ? 'eye-slash' : 'eye'}
                        size={18}
                        color="grey"
                        onPress={() => setHideConfirmPass(!hideConfirmPass)}
                    />
                </View>


                <TouchableOpacity style={styles.bigButt}
                    disabled={!Boolean(username && userEmail && newPassword && confirmNewPassword)}
                    onPress={() => changePassword()}>
                    <Text style={styles.loginText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </DismissKeyboard>
    );
}
