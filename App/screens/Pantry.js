import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, View, StatusBar, Alert, Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import Constants from 'expo-constants';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input'
import { useIsFocused } from "@react-navigation/native";
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

import { useTheme } from '@react-navigation/native';
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from 'recoil';

var stringSimilarity = require("string-similarity");

const window = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;

const cardWidth = window.width * 0.9;
const cardHeight = window.height * 0.12;

export const selected = atom({
    key: 'selected', // unique ID
    default: [], // initial value
});

const makeStyles = (colors) => StyleSheet.create({
    screenHeaderContainer: {
        marginTop: statusBarHeight * 0.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    screenHeader: {
        fontSize: 40,
        color: colors.text,
        fontWeight: 'bold'
    },
    safeAreaView: {
        height: "100%",
        width: "100%",
        // marginTop: statusBarHeight,
    },
    scrollViewContent: {
        alignItems: 'center'
    },
    itemCard: {
        flex: 1,
        flexDirection: 'row',
        width: cardWidth,
        height: cardHeight,
        marginTop: window.height * 0.01,
        marginBottom: window.height * 0.01,
        borderRadius: 10,
        borderWidth: 1,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: 'white',
        backgroundColor: colors.black
    },
    lightItemCard: {
        flex: 1,
        flexDirection: 'row',
        width: cardWidth,
        height: cardHeight,
        marginTop: window.height * 0.01,
        marginBottom: window.height * 0.01,
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: 'white'
    },
    itemCardContent: {
        flex: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: (cardHeight * 0.15)
    },
    itemCardText: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: (cardWidth * 0.05),
        color: colors.text
    },
    foodNameText: {
        fontSize: 16,
        color: colors.text
    },
    expirationText: {
        fontSize: 12,
        color: colors.text
    },
    warnExpirationText: {
        fontSize: 12,
        color: '#ff6961'
    },
    cardButtons: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 5
    },
    fab: { // Check this styling absolutism
        position: 'absolute',
        bottom: window.height * 0.83,
        right: window.width * 0.08
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
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
    button: {
        borderRadius: 20,
        padding: 10
        // elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#ff5151",
        width: 100
    },
    buttonClose: {
        backgroundColor: "#6be3d9",
        width: 70
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: colors.text,
    },
    sortButt: {
        borderRadius: 15,
        height: 30,
        width: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2c572",
        margin: 5,
    },
    addItemButton: {
        borderRadius: 17,
        height: 35,
        width: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6be3d9",
        margin: 5
    },
    generateRecipesButton: {
        borderRadius: 17,
        height: 35,
        width: 130,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6be3d9",
        margin: 5
    }
});

const AddIngredientButton = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    return (
        // <FAB
        //     style={styles.fab}
        //     medium
        //     icon="plus"
        //     onPress={() => props.nav.navigate('AddItem')}
        // />
        <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => props.nav.navigate('AddItem')}>
            <Text>Add Item</Text>
        </TouchableOpacity>
    )
};

const GenerateRecipesButton = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    return (
        // <FAB
        //     style={styles.fab}
        //     small
        //     label="Generate Recipes"
        //     onPress={() => {
        //         console.log("Selected Ingredients")
        //         console.log(props.items)
        //         recipeIngredients = props.items

        //         // Make some API call here to actually generate the recipes

        //         // navigate to recipe page
        //         props.nav.navigate('Recipes', {
        //             recipeList: recipeIngredients
        //         })
        //     }}
        <TouchableOpacity
            style={styles.generateRecipesButton}
            onPress={() => {
                console.log("Selected Ingredients");
                console.log(props.items);
                let recipeIngredients = props.items;
                props.nav.navigate('Recipes', {
                    recipeList: recipeIngredients
                });
            }}>
            <Text>Generate Recipes</Text>
        </TouchableOpacity>
    )
}

const DeletionModal = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);

    const [modalVisible, setModalVisible] = useState(false);
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
                                <Text style={styles.modalText}>Are you sure you want to delete {props.item} from your pantry?</Text>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        props.remove(false);
                                    }}
                                >
                                    <Text style={styles.textStyle}>Yes</Text>
                                </TouchableOpacity>
                                <Text>  </Text>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        props.remove(true);
                                    }}
                                >
                                    <Text style={styles.textStyle}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity key={props.title} onPress={() => setModalVisible(true)}>
                <Ionicons name="trash-outline" style={{ fontSize: 25, color: 'gray' }} />
            </TouchableOpacity>
        </View>
    );
}

// Ingredient-Recipe Generation selection feature (ie. heart icons)
const IngredientSelect = (props) => {
    // const { colors } = useTheme();

    let resetTrigger = props.triggerReset

    // const [select, isSelected] = useState('')
    const [color, setColor] = useState('gray');
    const [select, setSelect] = useRecoilState(selected);

    // useEffect function clears recipe card buttons upon a sort
    // Also a bandaid fix but it works well enough for our purposes
    useEffect(() => {
        async function resetCards() {
            await setColor('gray')
            await props.setTriggerReset(false)
        }
        resetCards()
    }, [resetTrigger]);
    
    return (
        <TouchableOpacity onPress={async () => {

            console.log("TESTING SELECT")
            console.log(props.item)

            if (color !== '#6be3d9') {
                await setColor('#6be3d9')
                await props.selectIngredient(currentElements => [...currentElements, props.item])
            }
            else { // Here we will want to remove the element from the ingredientSelections array if this is accessed
                await setColor('gray')
                await props.selectIngredient(props.ingredientSelections.filter(item => item !== props.item))
            }
        }}>
            <Ionicons name="checkmark-circle-outline" color={color} style={{ fontSize: 25 }} />
        </TouchableOpacity>
    )

}

const PantryCard = (props) => {

    // console.log("CHECK")
    // console.log(props)

    const [viewComponent, setViewComponent] = useState(props.view);
    const [viewDeletion, setViewDeletion] = useState(false);
    const [deletionChoice, setDeletionChoice] = useState(false)
    const [deletedItem, setDeletedItem] = useState('')
    const [select, setSelect] = useRecoilState(selected);
    const [expiration, setExpiration] = useState(props.expr)

    const { colors } = useTheme();
    const styles = makeStyles(colors);

    const formatDate = (obj) => {
        let epochDate = obj.$date
        let convDate = new Date(epochDate)
        return convDate.toLocaleDateString()
    }

    const stateCallback = async (result) => {

        // Remove Card from Pantry if 'Yes' confirmation selected
        setViewComponent(result);

        // Delete card from Pantry storage is 'Yes' confirmation selected (ie. 'false' result)
        if (!result) {

            // Make call to API to delete ingredient from user account
            let username = await AsyncStorage.getItem("username");

            console.log("Removing item from pantry")
            console.log(username)
            console.log(props.title)
            console.log(props.quantity)
            console.log(props.expr)

            // Call the API to delete the object from db
            // http://localhost:5000/v1/pantry/delete/petek222?ingredient=Chicken
            try {

                let response = await api.delete(`/pantry/delete/${username}?ingredient=${props.title}`);

                console.log("Ingredient Deletion Response")
                console.log(response)
                await setDeletedItem(props.title)

                // Updating the ingredients array accordingly
                await props.setIngredients(props.ingredients.filter(item => item.name !== props.title))
                await props.selectIngredient(props.ingredientSelections.filter(item => item !== props.title))

                console.log("TESTING ARRAY")
                console.log(props.ingredients)

            } catch (error) {
                notifyMessage("Deletion Failed");
                console.error(error);
            }

        }
    }

    if (props.title != deletedItem) {

        // Check if date is within visual notary time
        let warnNotification = false
        let currentDateSeconds = new Date().getTime() / 1000
        let expirationDateSeconds = expiration.$date / 1000

        // If item is within 2 days (ie. 259200 seconds) of expiring, set styling
        if (expirationDateSeconds - 259200 < currentDateSeconds) {
            warnNotification = true
        }

        // render pantry card
        return (
            <View style={colors.background === 'white' ? styles.lightItemCard : styles.itemCard} id={props.title}>
                <View style={styles.itemCardContent}>
                    <Thumbnail source={props.image ? { uri: props.image } : { source: require('../assets/chicken.jpg') }} />
                    <View style={styles.itemCardText}>
                        <Text style={[styles.foodNameText, { color: colors.text }]}>{props.title}</Text>

                        {warnNotification
                            ? <Text style={styles.warnExpirationText}>Expiration: {expiration
                                ? formatDate(expiration) : "Not specified"}</Text>
                            : <Text style={[styles.expirationText, { color: colors.text }]}>Expiration: {expiration
                                ? formatDate(expiration) : "Not specified"}</Text>}
                        {/* <Text style={styles.expirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text> */}

                        <Text style={styles.expirationText}>Quantity (number): {props.quantity ? props.quantity : "Not specified"}</Text>
                    </View>
                </View>
                {/* {viewDeletion ? <DeletionModal item={props.title} delete_init={true}></DeletionModal> : null} */}
                <View style={styles.cardButtons}>
                    {/* <Ionicons name="heart-outline" style={{fontSize: 25}} /> */}
                    <IngredientSelect item={props.title} ingredientSelections={props.ingredientSelections} selectIngredient={props.selectIngredient} ingKey={props.val} triggerReset={props.triggerReset} setTriggerReset={props.setTriggerReset}></IngredientSelect>
                    <DeletionModal item={props.title} remove={stateCallback} ></DeletionModal>
                </View>
            </View>
        )
    }

    else {
        return null;
    }
}

export default ({ navigation }) => {

    let [ingredients, setIngredients] = useState([]);
    let [imageArray, setImageArray] = useState([]);

    let [selectionArray, setSelectionArray] = useState([]);

    let [ingredientSelections, setIngredientSelections] = useState([]);
    let [search, setSearch] = useState('');

    const [nameSort, setNameSort] = useState(false);
    const [dateSort, setDateSort] = useState(false);
    const [triggerReset, setTriggerReset] = useState(false)

    const { colors } = useTheme();
    const styles = makeStyles(colors);

    const isFocused = useIsFocused();

    useEffect(() => {
        async function generatePantry() {
            let ingredientList = await getItems();
            await generateThumbnail(ingredientList)
        }
        generatePantry()
    }, [isFocused]);

    const generateThumbnail = async (ingredientList) => {

        const promises = [];

        ingredientList.map((ingredient, i) => {
            let ingredient_name = ingredient.name

            let response = api.get(`/photos?ingredient=${ingredient_name}`)
            promises.push(response)
        })

        Promise.all(promises).then(resultArray => {

            let image_links = []

            resultArray.map((image, i) => {

                let link;

                // grab default food image if error in request
                if (image.error == "no ingredient was passed") {
                    link = '../assets/default.png'
                }

                // otherwise, grab the link
                else {
                    link = image.data.src;
                }

                image_links.push(link)
            })

            setImageArray(image_links)

        })
    }

    // get pantry items for account
    const getItems = async () => {
        try {
            let username = await getUsername();
            let response = await api.get(`/pantry/${username}`);
            if (response.data.ingredients) {

                console.log("TESTING PANTRY INGREDIENT ARRAY")
                console.log(response.data.ingredients)

                await setIngredients(response.data.ingredients);

                // Setting async storage for use in Recipe Screen (Band-Aid Solution)
                // await AsyncStorage.setItem("ingredients", JSON.stringify(response.data.ingredients));

                let ingredientNames = [];

                // loop to grab ingredient names for recipe gen
                for (let i = 0; i < response.data.ingredients.length; i++) {
                    let entry = response.data.ingredients[i]

                    // console.log("ENTRY")
                    // console.log(entry)

                    let ingredientName = entry["name"]

                    // console.log("CHECKING INGREDIENT NAMES")
                    // console.log(ingredientName)

                    ingredientNames.push(ingredientName)
                }

                await AsyncStorage.setItem("ingredients", JSON.stringify(ingredientNames));

                return response.data.ingredients
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getUsername = async () => {
        try {
            const user = await AsyncStorage.getItem('username');
            return user;
        } catch (e) {
            console.log('Failed to fetch the data from storage');
        }
    }

    const updateSort = async (sortType) => {
        // console.log(ingredients[0].expiration_date.$date);
        let ing = ingredients;
        // add id property so I can get their indexes
        for (let i = 0; i < ing.length; ++i) {
            ing[i]['id'] = i;
        }

        if (sortType === 'name') {
            ing.sort(function (a, b) {
                if (nameSort) {
                    return b.name.localeCompare(a.name);
                } else {
                    return a.name.localeCompare(b.name);
                }
            });
            setNameSort(!nameSort);
        } else if (sortType === 'date') {
            ing.sort(function (a, b) {
                if (dateSort) {
                    return b.expiration_date.$date - a.expiration_date.$date;

                } else {
                    return a.expiration_date.$date - b.expiration_date.$date;
                }
            });
            setDateSort(!dateSort);
        }

        // fix images
        
        const arr = [];
        // take out the ids from ingredients to make an array of indexes
        for (let i = 0; i < ing.length; ++i) {
            arr[i] = ing[i].id;
        }

        var img = [];
        // use the array of indexes to sort imageArray in the same way ingredients was sorted
        for (var i = 0; i < arr.length; i++) {
            img[i] = imageArray[arr[i]]
        }

        await setIngredients(ing);
        await setImageArray(img);

        // Setting selections to default state upon sort
        // Kind of a band-aid solution at this point, but it is functional
        await setIngredientSelections([])

        await setTriggerReset(true)

    }

    let button;

    if(ingredientSelections.length > 0 && ingredients.length > 0) {

        console.log("TESTING LENGTH FOR BUTTION")
        console.log(ingredients.length)

        if (Platform.OS === "ios") {
            button = (<Animatable.View animation={'lightSpeedIn'}>
                <GenerateRecipesButton items={ingredientSelections} delete_init={true} nav={navigation}></GenerateRecipesButton>
            </Animatable.View>)
        } else {
            button = <GenerateRecipesButton items={ingredientSelections} delete_init={true} nav={navigation}></GenerateRecipesButton>; 
        }
    }

    

    return (
        <SafeAreaView style={styles.safeAreaView}>
            {/* To make notification bar same color as background */}
            <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>
            <View style={styles.screenHeaderContainer}>
                <Text style={styles.screenHeader}> Pantry </Text>
                <AddIngredientButton nav={navigation}/>
                {button}
            </View>
            <SearchBar
                    // platform={'android'}
                    platform={Platform.OS === "ios" ? "ios" : "android"}
                    placeholder="Search"
                    // placeholderTextColor="black"
                    // searchIcon={{ color: "black" }}
                    // cancelIcon={{ color: "black" }}
                    // clearIcon={{ color: "black" }}
                    onChangeText={setSearch}
                    value={search}
                    inputStyle={{ color: colors.text }}
                    containerStyle={{ backgroundColor: colors.background, borderColor: 'white', text: 'white', paddingTop: window.height * 0.01, paddingBottom: 0 }} />
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 'auto', marginLeft: 'auto', marginTop: window.height * 0.005  }}>
                <Text style={{ color: colors.text }}>Sort: </Text>
                <TouchableOpacity
                    style={styles.sortButt}
                    onPress={() => {
                        updateSort('name')
                    }}>
                    <Text>Name</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.sortButt}
                    onPress={() => {
                        updateSort('date')
                    }}>
                    <Text>Date</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    {
                        // generate ingredient cards
                        ingredients.map((ingredient, i) => {

                            //search through cards
                            if (ingredient.name.indexOf(search.toLowerCase()) !== -1) {

                                // // This code reformats the date object (stored as UTC) to current timezone
                                let expDateConversion = new Date(ingredient.expiration_date.$date)
                                var timezoneAdjustedDate = expDateConversion.getTime() + (expDateConversion.getTimezoneOffset() * 60000);
                                ingredient.expiration_date.$date = timezoneAdjustedDate

                                return (
                                    <PantryCard
                                        image={imageArray[i]}
                                        key={i}
                                        val={i}
                                        title={ingredient.name}
                                        expr={ingredient.expiration_date}
                                        quantity={ingredient.quantity}
                                        view={true}
                                        // selected={selectionArray[i]}
                                        selectIngredient={setIngredientSelections}
                                        ingredientSelections={ingredientSelections}
                                        ingredients={ingredients}
                                        setIngredients={setIngredients}
                                        dateSort={dateSort}
                                        nameSort={nameSort}
                                        triggerReset={triggerReset}
                                        setTriggerReset={setTriggerReset}
                                    >
                                    </PantryCard>
                                );
                            } else {
                                // console.log("no match");
                                return;
                            }
                        }
                        )

                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
