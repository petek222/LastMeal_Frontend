import React, { useState, useEffect } from 'react';
import {
    Dimensions,
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
    Switch,
    Modal,
    TouchableWithoutFeedback
} from "react-native";

import DatePicker from 'react-native-datepicker'
import moment, { min } from 'moment';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
var stringSimilarity = require("string-similarity");
import ModalDropdown from 'react-native-modal-dropdown';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@react-navigation/native';
import { notifyDays, notifyTime } from './Notifications';
import {
    useRecoilState
} from 'recoil';
import { Ionicons } from '@expo/vector-icons';
import DismissKeyboard from "../config/DismissKeyboard.js";

// Code below surpresses warning log boxes at bottom of app
import { LogBox, YellowBox } from 'react-native';
LogBox.ignoreAllLogs();

// JSON data for use in autocomplete
const ingredientData = require('../assets/ingredientList.json')

const window = Dimensions.get('window');
const windowWidth = window.width;
const windowHeight = window.height;

const makeStyles = (colors) => StyleSheet.create({
    modalView: {
        margin: '10%',
        // backgroundColor: "white",
        backgroundColor: colors.background,
        borderRadius: 50,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: colors.text,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        // elevation: 2
    },
    buttonClose: {
        backgroundColor: "#6be3d9",
        width: 200
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})

// Styles to match profile
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        marginBottom: 40,
        marginTop: -20,
        height: "20%",
        resizeMode: 'contain',
        tintColor: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    inputView: {
        backgroundColor: "#6be3d9",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
        flexDirection: 'row',
        // justifyContent: 'center'
    },

    switchView: {
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
        // marginBottom: 30,
        // position: "absolute"
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        width: "30%",
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
    },
    notificationSwitch: { // add/tweak styling more as needed
        // marginTop: 8,
        marginRight: 5
    }
});

export default ({ navigation }) => {

    const [date, setDate] = useState(moment().format('MM-DD-YYYY'));

    const [ingredientName, setIngredientName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [expiration, setExpiration] = useState(new Date().toISOString().slice(0, 10)); // Set a value for the expiration date
    const [expirationSuggestion, setExpirationSuggestion] = useState(new Date().toISOString().slice(0, 10)); // Set a value for the expiration date

    const [renderDropdown, setRenderDropdown] = useState(false);
    const [suggestionList, setSuggestionList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const toggleSwitch = () => setIsNotificationEnabled(previousState => !previousState);

    const [days, setDays] = useRecoilState(notifyDays);
    const [time, setTime] = useRecoilState(notifyTime);

    const { colors } = useTheme();

    function notifyMessage(msg) {
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert(msg);
        }
    }

    const addPantryItem = async () => {


        // Upon adding the item to the pantry, check if they want to schedule a push notification
        // This will currently schedule the notification for a day before the expiration date; we 
        // want this to be configurable in the options menu eventually
        if (isNotificationEnabled) {
            console.log("Enabling Notifications")
            console.log(ingredientName);
            console.log(quantity)
            console.log(expiration);
            console.log(new Date(expiration).getTime());
            console.log(Date.now());
            // console.log('start of day');
            // let startOfDay = new Date();

            // normalize to the start of the day
            // startOfDay.setHours(0, 0, 0, 0);

            // console.log(startOfDay);
            // console.log(startOfDay.getTime());

            // for (let i = 0; i < days.length; ++i) {
            //     if (days[i] === true) {
            //         // Generates seconds for each
            //         let expirationDate = (new Date(expiration).getTime()) / 1000
            //         console.log("Testing date computation")
            //         console.log(expirationDate - 86400)
            //         await schedulePushNotification(ingredientName, expirationDate);
            //     }
            // }

            for (let i = 0; i < days.length; ++i) {
                if (days[i] === true) {

                    // Generates seconds for each
                    // get the distance in time
                    // minus number of days in advance times 86400 seconds in a day
                    // and then plus 18000 + (3600 * 10) means remind me at 10 am? (could customize this as well) // hold up, let me check this first
                    // (startOfDay.getTime() / 1000) -
                    // expiration is at 7 pm?

                    // for some reason this works on mine but not main ?
                    let expirationDate = ((new Date(expiration).getTime() / 1000) - (Date.now() / 1000) - i * 86400 + 18000 + (3600 * time));

                    console.log("Testing date computation:")
                    console.log(`remind within ${i} days`);
                    console.log(expirationDate)

                    await schedulePushNotification(ingredientName, expirationDate, i);
                }
            }
        }

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

            // console.log("Ingredient Addition Response")
            // console.log(response)
            // notifyMessage("Ingredient Added to Pantry");
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

        comparisonList.sort(function (a, b) {
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



    const ExpirationModal = (props) => {
        const { colors } = useTheme();
        const styles = makeStyles(colors);
    
        // const [modalVisible, setModalVisible] = useState(false);
        if (modalVisible == true) {
            return (
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <TouchableOpacity
                            style={styles.centeredView}
                            activeOpacity={1}
                            onPressOut={() => { setModalVisible(false) }}
                        >
                            <View style={styles.centeredView}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Suggested Expiration Date For {props.item}: {props.expiration}</Text>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                                setExpiration(props.expiration)
                                            }}
                                        >
                                            <Text style={styles.textStyle}>Accept</Text>
                                        </TouchableOpacity>
                                        <Text>  </Text>
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => {
                                                setModalVisible(!modalVisible);
                                                // if they select no, nothing else to do
                                            }}
                                        >
                                            <Text style={styles.textStyle}>Enter Manually</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>
            );
        }
        else {
            return (
                <View></View>
            )
        }
    }




    const expirationSearch = async (item) => {

        try {
            let response = await api.get(`/exp?ingredient=${item}`);

            let ingredientData = response.data;
            // console.log(ingredientData)
            let expResult = minExpDate(ingredientData)
            console.log("Checking Exp Result")
            console.log(expResult)
            setModalVisible(true)
            setExpirationSuggestion(expResult)

        }
        catch (error) {
            console.log("Error in Expiration Fetapich")
            console.log(error)
        }
    }

    const DropdownMenuSelection = () => {

        // We can render this default option if we want
        const defaultOption = suggestionList[0];
        const { colors } = useTheme();

        return (
            <ModalDropdown
                style={[styles.inputView, { backgroundColor: "#f2c572" }]}
                defaultValue={'Ingredient Options (Click Me)'}
                placeholderTextColor="gray"
                dropdownTextStyle={{ backgroundColor: colors.background, fontSize: 18, color: colors.text }}/*Style here*/
                textStyle={{ fontSize: 14, color: '#2a3439', alignSelf: 'flex-start', marginLeft: 30 }}
                dropdownStyle={{ flex: 1, width: '70%', marginVertical: 10, borderWidth: 1, borderColor: '#D3D3D3' }}
                options={suggestionList}
                onSelect={(value) => {
                    setIngredientName(suggestionList[value])
                    setRenderDropdown(false)

                    // Here is where we make a call to the expiration-suggestion database
                    let expSuggestion = expirationSearch(suggestionList[value])

                }}
            />
        )
    }

    const BackArrow = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} >
            {/* <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: 370}}/> */}
            <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: '90%'}}/>
        </TouchableOpacity>
        )
    }

    return (
       <DismissKeyboard>
      
        <View style={styles.container}>
            
            <BackArrow></BackArrow>

            <Image style={[styles.image, { tintColor: colors.text }]} source={require("../assets/add_ingredient.png")} />

            {/* Ingredient Name */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Ingredient Name"
                    placeholderTextColor="gray"
                    // placeholderTextColor="#003f5c"
                    autoCapitalize="none"
                    textContentType='none'
                    onChangeText={(ingredient) => setIngredientName(ingredient)}
                    value={ingredientName}
                />

                <TouchableOpacity style={styles.smallButt}
                    disabled={!Boolean(ingredientName)} // Add notification here if fields not input
                    onPress={() => {
                        setRenderDropdown(true);
                        ingredientSearch(ingredientName);
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
                    // placeholderTextColor="#003f5c"
                    placeholderTextColor="gray"
                    textContentType='none'
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
                    placeholderTextColor="gray"
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
                            marginLeft: 56,
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

            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Enable Item Notifications"
                    placeholderTextColor="#003f5c"
                    textContentType='none'
                    // placeholderTextColor="gray"
                    // secureTextEntry={true}
                    editable={false}
                    selectTextOnFocus={false}
                />
                <Switch
                    style={styles.notificationSwitch}
                    trackColor={{ false: "#767577", true: "#eb6fbb" }}
                    thumbColor={isNotificationEnabled ? "#f2c572" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isNotificationEnabled}
                />
                <ExpirationModal item={ingredientName} expiration={expirationSuggestion}></ExpirationModal>

            </View>
            
            <TouchableOpacity style={styles.bigButt}
                disabled={!Boolean(ingredientName && quantity && expiration)} // Add notification here if fields not input
                onPress={() => addPantryItem()}>
                <Text style={styles.loginText}>Add Item to Pantry</Text>
            </TouchableOpacity>

        </View>

        </DismissKeyboard>

    );
}

// Function that actually schedules notifications
async function schedulePushNotification(ingredientName, timer, numDays) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Expiration Notification",
            body: `Your ${ingredientName} is going to expire in ${numDays} day(s)`, // If time is configurable, change this message
            data: { data: 'data' }, // add any data here if desired
        },
        trigger: { seconds: timer },
    });
}

// Return both the date string (?)
// Implementation Detail: Ignoring the min value if it is the same as current day
const minExpDate = (object) => {

    // Grab Objects
    let freezer = object["freezer_expiration"]
    let fridge = object["fridge_expiration"]
    let pantry = object["pantry_expiration"]

    let freezer_date = new Date(freezer).getTime()
    let fridge_date = new Date(fridge).getTime()
    let pantry_date = new Date(pantry).getTime()

    let stringArray = [freezer, fridge, pantry_date]
    let dateArray = [freezer_date, fridge_date, pantry_date];

    let minIndex = dateArray.indexOf(Math.min(...dateArray));

    console.log("Min Index / Date:")
    console.log(minIndex)
    console.log(stringArray[minIndex])

    return stringArray[minIndex]
}