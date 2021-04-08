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
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    // for show/hide password functionality
    const [hidePass, setHidePass] = useState(true);
    const [hideNewPass, setHideNewPass] = useState(true);
    const [hideConfirmPass, setHideConfirmPass] = useState(true)

    // Function for performing password reset
    const resetPassword = async () => {
        try {
            let response = await api.post('/user/login', {
                username: username,
                password: password
            });

            console.log("Reset Password Response")
            console.log(response)

            // If username-password combo correct
            if (response.status == 200) {
                // If the confirm password matches the new password
                if (newPassword === confirmNewPassword && newPassword !== password) {
                    console.log("Properly Matched! Executing Reset Request...") // Make the request
                    try {
                        let response = await api.put(`/user/password/${username}`, {
                            password: newPassword
                        });
                        console.log(response)
                        if (response.status == 201) {
                            notifyMessage("Password Reset Successfully");
                            navigation.navigate('Login', { screen: 'Login' }); // navigate back to login upon success
                        }
                    }
                    catch (error) {
                        console.log(error)
                        notifyMessage("An Error Has Occurred");
                    }
                }
                else if (newPassword === password) {
                    console.log("New Password must be different than old Password")
                    notifyMessage("New Password must be different than old Password");
                }
                // If the confirm password doesnt match the new password
                else {
                    console.log("New Password and Confirm Password do not Match")
                    notifyMessage("New Passwords Do Not Match");
                }
            }
            // If username-password combo incorrect / doesnt exist
            else {
                console.log("An Error Has Occurred")
                notifyMessage("An Error Has Occurred");
            }

        } catch (error) {
            notifyMessage("Username/Original Password Incorrect"); 
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
                disabled={!Boolean(username && password && newPassword)}
                onPress={() => resetPassword()}>
                <Text style={styles.loginText}>Reset Password</Text>
            </TouchableOpacity>

        </View>
    );
}
