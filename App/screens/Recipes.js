import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import Constants from 'expo-constants';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const statusBarHeight = Constants.statusBarHeight;

const window = Dimensions.get('window');
const cardWidth = window.width * 0.9;
const cardHeight = window.height * 0.12;

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight
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
        borderColor: '#E2E2E2',
        borderWidth: 2,
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
    recipeNameText: {
        fontSize: 16
    },
    cardButtons: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 5   
    },
});

const RecipeCard = (props) => {
    return (
        <TouchableOpacity style={styles.itemCard} onPress={() => props.nav.navigate('RecipeInfo')}>
            <View style={styles.itemCardContent} >
                <Thumbnail source={require('../assets/chicken.jpg')} />
                <View style={styles.itemCardText}>
                    <Text style={styles.recipeNameText} >{props.title}</Text>
                </View>
            </View>
            <View style={styles.cardButtons}>
                <Ionicons name="heart-outline" style={{fontSize: 25}} />
            </View>
        </TouchableOpacity>
    )
}

export default ({navigation}) => {

    let [ingredients, setIngredients] = useState([]);
    // let [imageArray, setImageArray] = useState([]);
    // let [ingredientSelections, setIngredientSelections] = useState([]);
    // let [search, setSearch] = useState('');

    const isFocused = useIsFocused()

    useEffect(() => {
        async function generateRecipes() {
            // Note that we will only want to grab whatever is here if user hasnt selected anything and navigated
            // via the 'Generate Recipes' Button (ie. this will grab whatever the default is)
            const currentPantry = await AsyncStorage.getItem('ingredients');

            // console.log("TESTING PANTRY STORAGE")
            // console.log(currentPantry)

            let recipeList = await getRecipes(currentPantry);

            // Here is where we want to work on the recipe data sent from the API to build our cards
            console.log("RECIPES")
            console.log(recipeList)
        }
        generateRecipes()
    }, [isFocused]);


    const getRecipes = async (currentPantry) => {

        try {
            let response = await api.get('/recipes', {
                ingredients: currentPantry
            });

            return response
        }
        catch (error) {
            return "Error in grabbing recipe data";
        }
    }


    return (
        <SafeAreaView style={styles.safeAreaView}>
            <StatusBar barStyle="dark-content" ></StatusBar>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <RecipeCard title="Chicken Souvlaki" nav={navigation}/>
            </ScrollView>
        </SafeAreaView>
    )
}