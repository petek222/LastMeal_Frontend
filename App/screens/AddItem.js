import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
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
    Alert
} from "react-native";

import DatePicker from 'react-native-datepicker'
import moment from 'moment';

// JSON data for use in autocomplete
const ingredientData = require('../assets/ingredientList.json')

// Styles to match profile
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

export default ({navigation}) => {

    const [date, setDate] = useState(moment().format('MM-DD-YYYY'));

    const [ingredientName, setIngredientName] = useState("");
    const [quantity, setQuantity] = useState(0); 
    const [expiration, setExpiration] = useState(new Date()); // Set a value for the expiration date

    function notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }

    const addPantryItem = async () => {

        // Figure out how to grab username of logged in user
        let username = "test"

        try {

            console.log("Ingredient Params")
            console.log(ingredientName)
            console.log(quantity)
            console.log(expiration)

            let response = await fetch(`http://localhost:5000/v1/pantry/create/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: ingredientName,
                    quantity: quantity,
                    expiration_date: expiration
                })
            })
            // let json = await response.json();

            if (!response.ok) {
                notifyMessage("Invalid input");
            } else {
                notifyMessage("Ingredient Added to Pantry");
                navigation.navigate('Pantry');
            }
            // return json;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>

            {/* Ingredient Name */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingredient Name"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    onChangeText={(ingredient) => setIngredientName(ingredient)}
                />
            </View>

            {/* Quantity */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Quantity"
                    placeholderTextColor="#003f5c"
                    // secureTextEntry={true}
                    onChangeText={(quantity) => setQuantity(quantity)}
                />
            </View>

            {/* Expiration Date: NOTE WE WANT TO ABSTRACT THIS AWAY AT SOME POINT */}
            <View style={styles.inputView}>
            <DatePicker
                date={expiration}
                mode="date"
                placeholder="select expiration date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                dateIcon: {
                    position: 'absolute',
                    left: 2,
                    top: 4,
                    marginLeft: 0
                },
                dateInput: {
                    marginLeft: 36
                },
                dateText: "Select Expiration Date"
                // ... You can check the source to find the other keys.
                }}
            onDateChange={(date) => {setExpiration(date)}}
            />
            </View>

            <TouchableOpacity style={styles.bigButt}
                disabled={!Boolean(ingredientName && quantity && expiration)}
                onPress={() => addPantryItem()}>
                <Text style={styles.loginText}>Add Item to Pantry</Text>
            </TouchableOpacity>

        </View>
    );
}