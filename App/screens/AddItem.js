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
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
var stringSimilarity = require("string-similarity");
import ModalDropdown from 'react-native-modal-dropdown';

// Code below surpresses warning log boxes at bottom of app
import {LogBox, YellowBox} from 'react-native';
LogBox.ignoreAllLogs();


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
        marginBottom: 40,
        marginTop: -20,
        height: "20%",
        resizeMode: 'contain'
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
        height: 45,
        marginBottom: 30,
        // position: "absolute"
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        width: "50%",
        borderRadius: 25
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

    const [renderDropdown, setRenderDropdown] = useState(false);
    const [suggestionList, setSuggestionList] = useState([]);

    function notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }

    const addPantryItem = async () => {

        navigation.navigate('Pantry');

        let username = await AsyncStorage.getItem("username");

        console.log("Adding item to pantry")
        console.log(ingredientName)
        console.log(quantity)
        console.log(expiration)

        try {            

            let response = await api.post(`/pantry/create/${username}`, {
                name: ingredientName,
                quantity: quantity,
                expiration_date: expiration
            });

            console.log("Ingredient Addition Response")
            console.log(response)
            notifyMessage("Ingredient Added to Pantry");
            navigation.navigate('Pantry'); // navigate to pantry upon ingredient submission
            // return json;
        } catch (error) {
            notifyMessage("Invalid input");
            console.error(error);
        }
    };

    const ingredientSearch = (ingredientName) => {

        let match = stringSimilarity.findBestMatch(ingredientName, ingredientData);

        let comparisonList = match.ratings;
        let resultList = [];

        comparisonList.sort(function(a, b) {
            return a.rating - b.rating
        })

        comparisonList.reverse()

        // Limiting suggestions to 10 possible; can be longer if desired
        for (let i = 0; i < 10; i++) {
            resultList.push(comparisonList[i].target);
        }

        // return the list of value suggestions
        console.log("HOLA");
        console.log(resultList);

        setSuggestionList(resultList);
        return resultList;
    }

    const DropdownMenuSelection = () => {

        // We can render this default option if we want
        const defaultOption = suggestionList[0];

        return (
            <ModalDropdown 
                style={styles.inputView}
                defaultValue={'Ingredient Options (Click Me):'}
                dropdownTextStyle={{ backgroundColor: '#fff', fontSize: 18, color: '#000000' }}/*Style here*/
                textStyle={{ fontSize: 14, color: '#2a3439', alignSelf: 'flex-start', marginLeft: 30, height: 50, marginTop: 15}}
                dropdownStyle={{ flex: 1, width: '70%', marginVertical: 10, borderWidth: 1, borderColor: '#D3D3D3' }}
                options={suggestionList}
                onSelect={(value) => {
                    setIngredientName(suggestionList[value])
                    setRenderDropdown(false)
                }}
            />
        )
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/add_ingredient.png")} />

            {/* Ingredient Name */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingredient Name"
                    placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    onChangeText={(ingredient) => setIngredientName(ingredient)}
                    value={ingredientName}
                />

            <TouchableOpacity style={styles.smallButt}
                disabled={!Boolean(ingredientName)} // Add notification here if fields not input
                onPress={() => {
                    setRenderDropdown(true);
                    ingredientSearch(ingredientName)
                    }}>
                <Text style={styles.loginText}>Search</Text>
            </TouchableOpacity>
            </View>

            {renderDropdown ? <DropdownMenuSelection /> : null}

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
                    marginLeft: 20
                },
                dateInput: {
                    marginLeft: 56
                },
                placeholderText: "Select Expiration Date",
                dateText: "Select Expiration Date",
                // ... You can check the source to find the other keys.
                }}
            onDateChange={(date) => {
                setExpiration(date)
            }}
            />
            </View>

            <TouchableOpacity style={styles.bigButt}
                disabled={!Boolean(ingredientName && quantity && expiration)} // Add notification here if fields not input
                onPress={() => addPantryItem()}>
                <Text style={styles.loginText}>Add Item to Pantry</Text>
            </TouchableOpacity>

        </View>
    );
}