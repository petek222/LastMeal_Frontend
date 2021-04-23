import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, ScrollView, Text, View } from "react-native";
import Constants from 'expo-constants';
import { Thumbnail } from 'native-base';
import { useIsFocused } from "@react-navigation/native";

// import moment from 'moment';
import api from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const window = Dimensions.get('window');
const windowWidth = window.width;
const windowHeight = window.height;

const statusBarHeight = Constants.statusBarHeight;

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight
    },
    scrollViewContent: {
        paddingLeft: windowWidth * 0.05,
        paddingRight: windowWidth * 0.05,
        
    },
    headerContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: windowWidth * 0.9,
        paddingTop: windowHeight * 0.02
    },
    nameContainer: {
        maxWidth: windowWidth * 0.50
    },
    recipeNameText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    thumbnail: {
        height: windowWidth * 0.35,
        width: windowWidth * 0.35
    },
    bodyContainer: {
        padding: windowHeight * 0.015,
    },
    infoHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContent: {
        flex: 1,
        flexDirection: "column",
        fontSize: 18,
        lineHeight: 25,
        paddingTop: windowHeight * 0.01,
        paddingBottom: windowHeight * 0.02
    },
    contentItem: {
        paddingBottom: windowHeight * 0.015,
        flex: 1,
        fontSize: 18,
        lineHeight: 25
    },
    listItem: {
        paddingBottom: windowHeight * 0.015,
        paddingLeft: windowWidth * 0.015,
        flex: 1,
        fontSize: 18,
        lineHeight: 25
    },
    listItemIndicator: {
        fontSize: 18,
        lineHeight: 25
    }
});

export default ({route, navigation}) => {

    // replace require with prop json data passed into this component
    const recipeData = require('../assets/recipeData.json');

    console.log("CARD GEN ID TEST");
    console.log(route.params)

    const isFocused = useIsFocused()

    useEffect(() => {

        async function generateRecipe() {
            // Note that we will only want to grab whatever is here if user hasnt selected anything and navigated
            // via the 'Generate Recipes' Button (ie. this will grab whatever the default is)

            console.log("Making Spoonacular API Request for Recipe Info")

            let recipeData = await getRecipeInfo(route.params);
    
            // Here is where we want to work on the recipe data sent from the API to build our cards
            console.log("Returned Recipe")
            console.log(recipeData)
                
            // await setRecipes(recipeList)

            // Otherwise, set the recipe list again (?)
        }
        generateRecipe()
    }, [isFocused]);

    const getRecipeInfo = async (recipe_id) => {

        try {
            // console.log("MAKING RECIPE REQUEST")
            // console.log(currentPantry)

            let response = await api.get(`/recipes/${recipe_id}`);

            console.log("API Response")
            console.log(response)

            return response
        }
        catch (error) {
            console.log(error)
            return "Error in requesting recipe data";
        }
    }


    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                <View style={styles.headerContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.recipeNameText}>{recipeData.title}</Text>
                    </View>
                    <View>
                        <Thumbnail style={styles.thumbnail} source={{uri: recipeData.image}}/>
                    </View>
                </View>

                <View style={styles.bodyContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Description</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.contentItem}>{recipeData.summary.replace(/(<([^>]+)>)/gi, "")}</Text>
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Time</Text>
                        <View style={styles.infoContent}>
                            <Text style={styles.contentItem}>Preparation: {recipeData.preparationMinutes} mins</Text>
                            <Text style={styles.contentItem}>Cooking: {recipeData.cookingMinutes} mins</Text>
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Ingredients</Text>
                        <View style={styles.infoContent}>
                            {
                                recipeData.extendedIngredients.map((ingredient) => {
                                    return (
                                        <View key={ingredient.id} style={{flexDirection: 'row'}}>
                                            <Text style={styles.listItemIndicator}>-</Text>
                                            <Text style={styles.listItem}>{ingredient.originalString}</Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Instructions</Text>
                        <View style={styles.infoContent}>
                            {
                                recipeData.analyzedInstructions[0].steps.map((step) => {
                                    return (
                                        <View key={step.number} style={{flexDirection: 'row'}}>
                                            <Text style={styles.listItemIndicator}>{step.number}. </Text>
                                            <Text style={styles.listItem}>{step.step}</Text>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}