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
} from "react-native";

import Icon from 'react-native-vector-icons/FontAwesome5';



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
    const [email, setEmail] = useState("");
    // const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const [hidePass, setHidePass] = useState(true);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/logo.png")} />

            <StatusBar style="auto" />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            {/* <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    onChangeText={(users) => setUser(user)}
                />
            </View> */}

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

            <TouchableOpacity style={styles.loginButt} onPress={() => navigation.push('Home')}>
                <Text style={styles.loginText}>Sign Up</Text>
            </TouchableOpacity>

        </View>
    );
}
