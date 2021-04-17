import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, View, StatusBar, Alert, Modal, Pressable, TouchableOpacity, Platform } from 'react-native';
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

var stringSimilarity = require("string-similarity");

const window = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;

const cardWidth = window.width * 0.9;
const cardHeight = window.height * 0.12;

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight,
    },
    scrollViewContent: {
        alignItems: 'center'
    },
    itemCard: {
        flex: 1,
        flexDirection: 'row',
        width: cardWidth,
        height: cardHeight,
        // margin: '2%',
        marginBottom: '2%',
        borderRadius: 10,
        borderColor: '#E2E2E2',
        borderWidth: 1,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
        paddingLeft: (cardWidth * 0.05)
    },
    foodNameText: {
        fontSize: 16
    },
    expirationText: {
        fontSize: 12
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
        margin: 20,
        right: 0,
        bottom: 30,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
        textAlign: "center"
    },
    sortButt: {
        // width: "80%", 
        borderRadius: 15,
        height: 30,
        width: 60,
        alignItems: "center",
        justifyContent: "center",
        // marginTop: 40,
        backgroundColor: "#f2c572",
        margin: 5,
        // marginBottom: 30,
    },
});

const AddIngredientButton = (props) => {
    return (
        <FAB
            style={styles.fab}
            medium
            icon="plus"
            onPress={() => props.nav.navigate('AddItem')}
        />
    )
};

const GenerateRecipesButton = (props) => {
    return (
        <FAB
            style={styles.fab}
            small
            label="Generate Recipes"
            onPress={() => {
                console.log("Selected Ingredients")
                console.log(props.items)
                recipeIngredients = props.items

                // Make some API call here to actually generate the recipes

                // navigate to recipe page
                props.nav.navigate('Recipes')
            }}
        />
    )
}

const DeletionModal = (props) => {

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
                <View style={styles.centeredView}>
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
                </View>
            </Modal>
            <TouchableOpacity key={props.title} onPress={() => setModalVisible(true)}>
                <Ionicons name="trash-outline" style={{ fontSize: 25, marginTop: 20 }} />
            </TouchableOpacity>
        </View>
    );
}

// Ingredient-Recipe Generation selection feature (ie. heart icons)
const IngredientSelect = (props) => {

    const [select, isSelected] = useState('')
    const [color, setColor] = useState('#000000');

    return (
        <TouchableOpacity onPress={async () => { // CHECK STATE-SETTING; A LITTLE DELAYED ON CLICK?
            console.log("HERE")
            if (color !== '#6be3d9') {
                setColor('#6be3d9')
                await props.selectIngredient(currentElements => [...currentElements, props.item])
            }
            else { // Here we will want to remove the element from the ingredientSelections array if this is accessed
                console.log("BLACK")
                setColor('#000000')
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

            console.log("Removing item to pantry")
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
                setDeletedItem(props.title)
                // setViewComponent(true);
                // return json;
            } catch (error) {
                notifyMessage("Deletion Failed");
                console.error(error);
            }

        }

    }

    if (props.title != deletedItem) {
        return (
            <View style={styles.itemCard} id={props.title}>
                <View style={styles.itemCardContent}>
                    <Thumbnail source={props.image ? { uri: props.image } : { source: require('../assets/chicken.jpg') }} />
                    <View style={styles.itemCardText}>
                        <Text style={styles.foodNameText}>{props.title}</Text>

                        {props.warnNotification ? <Text style={styles.warnExpirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text> : <Text style={styles.expirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text>}
                        {/* <Text style={styles.expirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text> */}

                        <Text style={styles.expirationText}>Quantity: {props.quantity ? props.quantity : "Not specified"}</Text>
                    </View>
                </View>
                {/* {viewDeletion ? <DeletionModal item={props.title} delete_init={true}></DeletionModal> : null} */}
                <View style={styles.cardButtons}>
                    {/* <Ionicons name="heart-outline" style={{fontSize: 25}} /> */}
                    <IngredientSelect item={props.title} ingredientSelections={props.ingredientSelections} selectIngredient={props.selectIngredient}></IngredientSelect>
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
    let [ingredientSelections, setIngredientSelections] = useState([]);
    let [search, setSearch] = useState('');


    const isFocused = useIsFocused()

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
            console.log("UPMYSLEEVES")
            ingredient_name = ingredient.name

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
                await setIngredients(response.data.ingredients);
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

    let actionButton = ingredientSelections.length > 0 ? <GenerateRecipesButton items={ingredientSelections} delete_init={true} nav={navigation}></GenerateRecipesButton> : <AddIngredientButton nav={navigation}></AddIngredientButton>

    updateSearch = (str) => {
        setSearch(str);
        // console.log(search);
        console.log("heres ingredint");
        // console.log(ingredients[0]);
        // console.log(search);

    };

    let button;

    if (Platform.OS === "ios") {
        button = (<Animatable.View animation={ingredientSelections.length > 0 ? 'slideInUp' : 'lightSpeedIn'}>
            {actionButton}
        </Animatable.View>)
    } else {
        button = actionButton;
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            {/* To make notification bar same color as background */}
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>
            <SearchBar
                platform={Platform.OS === "ios" ? "ios" : "android"}
                placeholder="Search"
                onChangeText={this.updateSearch}></SearchBar>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
                <Text>Sort: </Text>
                <TouchableOpacity
                    style={styles.sortButt}
                    onPress={() => {

                    }}>
                    <Text>Name</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.sortButt}
                    onPress={() => {

                    }}>
                    <Text>Date</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View>
                    {
                        // generate ingredient cards
                        ingredients.map((ingredient, i) => {

                            // Grab dates, convert to seconds
                            let currentDateSeconds = new Date().getTime() / 1000
                            let expirationDateSeconds = ingredient.expiration_date.$date / 1000
                            let warnNotification = false
                            
                            // If item is within 2 days (ie. 259200 seconds) of expiring, set styling
                            if (expirationDateSeconds - 259200 < currentDateSeconds) {
                                warnNotification = true
                            }

                            //search through cards
                            if (ingredient.name.indexOf(search.toLowerCase()) !== -1) {

                                return (
                                    <PantryCard
                                        image={imageArray[i]}
                                        key={i}
                                        title={ingredient.name}
                                        expr={ingredient.expiration_date}
                                        quantity={ingredient.quantity}
                                        view={true}
                                        selectIngredient={setIngredientSelections}
                                        ingredientSelections={ingredientSelections}
                                        warnNotification={warnNotification}
                                    >
                                    </PantryCard>
                                );
                            } else {
                                // console.log("no match");
                                return;
                            }
                        })
                    }
                </View>
            </ScrollView>
            {/* <Animatable.View animation={ingredientSelections.length > 0 ? 'slideInUp' : 'lightSpeedIn'}>
                {actionButton}
            </Animatable.View> */}
            {button}
        </SafeAreaView>
    );
}
