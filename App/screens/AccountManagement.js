import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image, Alert, Button, FlatList, TextInput} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../api/api';

import { SafeAreaView } from 'react-native-safe-area-context';
import SwitchWithIcons from "react-native-switch-with-icons";

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';
import {
    atom,
    useRecoilState
} from 'recoil';
// import { darkState } from '../config/Navigation';
import { useTheme } from '@react-navigation/native';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';

const statusBarHeight = Constants.statusBarHeight;


const styles = StyleSheet.create({
    imageStyle: {
        marginLeft: 15,
        alignSelf: 'center',
        height: 30,
        width: 30
    },
    titleInfoStyle: {
        fontSize: 16,
        color: '#8e8e93'
    },
    inputView: {
        backgroundColor: "#6be3d9",
        borderRadius: 30,
        width: "90%",
        height: 45,
        marginBottom: 20,
        marginLeft: '5%',
        alignItems: "center",
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
    smallButt: {
        height: 45,
        // marginBottom: 30,
        // position: "absolute"
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        width: "40%",
        borderRadius: 25
    },
    bigButt: {
        width: "95%",
        borderRadius: 25,
        height: 45,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#FF6961",
        marginBottom: 20,
    }
});

// // default notify day before and on the day
// export const notifyDays = atom({
//     key: 'notifyDays', // unique ID
//     default: [false, true, false, false], // initial value
// });

// export const notifyTime = atom({
//     key: 'notifyTime', // unique ID
//     default: 13.5, // initial value, 1:30pm
// });

function notifyMessage(msg) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        Alert.alert(msg);
    }
}

// Currently just a template: Fill in with Functionality later
export default ({ navigation }) => {

    const { colors } = useTheme();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [confirmDelete, setConfirmDelete] = useState("")
    const [currentUsername, setCurrentUsername] = useState("")

    useEffect(() => {
        async function getAccount() {
            let currentUsername = await AsyncStorage.getItem("username")
            await setCurrentUsername(currentUsername)
        }
        getAccount()
    }, []);

    const BackArrow = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} >
            {/* <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: 370}}/> */}
            <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: '90%'}}/>
        </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor: colors.background, flex: 1 }}>
        <BackArrow></BackArrow>
        <Text style={{ fontSize: 40, color: colors.text, fontWeight: 'bold', marginTop: '5%' }}> Account Management </Text>
        <View style={{ backgroundColor: colors.background, flex: 1, marginTop: 15}}>
            <SettingsList borderColor='#fff' defaultItemSize={50}>
            <SettingsList.Header headerText='Profile Updates:' headerStyle={{ color: colors.text, fontSize: 20 }} />

            {/*Username Update*/}
            <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Username"
                        placeholderTextColor="gray"
                        // placeholderTextColor="#003f5c"
                        autoCapitalize="none"
                        textContentType='none'
                        onChangeText={(username) => setUsername(username)}
                        value={username}
                    />
                    <TouchableOpacity style={styles.smallButt}
                        disabled={false} // Add notification here if fields not input
                        onPress={async () => {
                            try {
                                console.log("IN HERE")
                                console.log(currentUsername)
                                // Here is where we call username update API
                                let response = await api.put(`/user/update/${currentUsername}`, {
                                    username: username
                                })

                                console.log("RESPONSE")
                                console.log(response)

                                if (response.status == 201) {

                                    // update stored username
                                    await AsyncStorage.setItem("username", username)

                                    // navigate back to the profile page
                                    navigation.navigate('Profile')
                                }
                            }
                            catch (error) {
                                console.log(error)
                                console.log("Error in updating username")
                            }
                        }}>
                <Text style={styles.loginText}>Update Username</Text>
                </TouchableOpacity>
            </View> 

            {/*Email Update*/}
            <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="gray"
                        // placeholderTextColor="#003f5c"
                        autoCapitalize="none"
                        textContentType='none'
                        onChangeText={(email) => setEmail(email)}
                        value={email}
                    />
                    <TouchableOpacity style={styles.smallButt}
                        disabled={false} // Add notification here if fields not input
                        onPress={async () => {
                            try {
                            console.log("IN HERE")
                            console.log(currentUsername)
                            // Here is where we call the email update API
                            let response = await api.put(`/user/update/${currentUsername}`, {
                                    email: email
                                })

                                console.log("RESPONSE")
                                console.log(response)

                                if (response.status == 201) {

                                    // update stored username (not needed for email)
                                    // await AsyncStorage.setItem("username", username)

                                    // navigate back to the profile page
                                    navigation.navigate('Profile')
                                }
                            }
                            catch (error) {
                                console.log(error)
                                console.log("Error in updating username")
                            }
                        }}>
                <Text style={styles.loginText}>Update Email</Text>
                </TouchableOpacity>
            </View> 

            {/*Password Update (Placeholder spot for now)*/}
            {/* <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="gray"
                        // placeholderTextColor="#003f5c"
                        autoCapitalize="none"
                        textContentType='none'
                        // onChangeText={(ingredient) => setIngredientName(ingredient)}
                        // value={ingredientName}
                    />
                    <TouchableOpacity style={styles.smallButt}
                        disabled={false} // Add notification here if fields not input
                        onPress={() => {
                            // setRenderDropdown(true);
                            // ingredientSearch(ingredientName);
                        }}>
                <Text style={styles.loginText}>Update Password</Text>
                </TouchableOpacity>
            </View>  */}

        <SettingsList.Header headerText='Account Deletion:' headerStyle={{ color: colors.text, fontSize: 20 }} />
            <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Type 'permanently delete', Confirm with Button"
                        placeholderTextColor="gray"
                        // placeholderTextColor="#003f5c"
                        autoCapitalize="none"
                        textContentType='none'
                        onChangeText={(confirmation) => setConfirmDelete(confirmation)}
                        value={confirmDelete}
                    />
            </View> 
            <View style={{marginLeft: '5%'}}>
            <TouchableOpacity style={styles.bigButt}
                        disabled={false} // Add notification here if fields not input
                        onPress={async () => {
                            try {
                                if (confirmDelete == "permanently delete") {
                                    // Here is where we call the deletion API
                                    let response = await api.delete(`/user/delete/${currentUsername}`)
        
                                    if (response.status == 201) {
                                        // navigate back to the profile page
                                        navigation.navigate('Login')
                                    }
                                    else {
                                        notifyMessage("Error performing account deletion")
                                    }
                                }
                                else {
                                    console.log("confirmation typo")
                                    notifyMessage("Deletion Failed (check confirmation spelling)")
                                }
                                
                                }
                                catch (error) {
                                    console.log(error)
                                    console.log("Error in updating username")
                                }
                        }}>
                <Text style={styles.loginText}>Delete Account</Text>
            </TouchableOpacity>
            </View>
        </SettingsList>
        </View>
    </SafeAreaView>
    );
}