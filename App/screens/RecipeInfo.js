import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, ScrollView, Text, View, StatusBar } from "react-native";
import Constants from 'expo-constants';
import { Thumbnail } from 'native-base';
import { useIsFocused } from "@react-navigation/native";
import Loader from '../config/Loader'

// import moment from 'moment';
import api from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';

const window = Dimensions.get('window');
const windowWidth = window.width;
const windowHeight = window.height;

const statusBarHeight = Constants.statusBarHeight;

const makeStyles = (colors) => StyleSheet.create({
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
        color: colors.text,
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
        color: colors.text,
    },
    infoContent: {
        flex: 1,
        flexDirection: "column",
        fontSize: 18,
        color: colors.text,
        lineHeight: 25,
        paddingTop: windowHeight * 0.01,
        paddingBottom: windowHeight * 0.02
    },
    contentItem: {
        paddingBottom: windowHeight * 0.015,
        flex: 1,
        fontSize: 18,
        color: colors.text,
        lineHeight: 25
    },
    listItem: {
        paddingBottom: windowHeight * 0.015,
        paddingLeft: windowWidth * 0.015,
        flex: 1,
        fontSize: 18,
        color: colors.text,
        lineHeight: 25
    },
    listItemIndicator: {
        fontSize: 18,
        color: colors.text,
        lineHeight: 25
    }
});

export default ({route, navigation}) => {
    const {colors} = useTheme();
    const styles = makeStyles(colors);

    // replace require with prop json data passed into this component
    // const recipeData = require('../assets/recipeData.json');
    // const { colors } = useTheme();

    const [recipeData, setRecipeData] = useState(null)

    console.log("CARD GEN ID TEST");
    console.log(route.params)

    const isFocused = useIsFocused()

    useEffect(() => {

        async function generateRecipe() {
            // Note that we will only want to grab whatever is here if user hasnt selected anything and navigated
            // via the 'Generate Recipes' Button (ie. this will grab whatever the default is)

            let recipeData = await getRecipeInfo(route.params.recipeID);
    
            // Here is where we want to work on the recipe data sent from the API to build our cards
            console.log("Returned Recipe")
            console.log(recipeData)
                
            await setRecipeData(recipeData)

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

    if (recipeData != null) {
        console.log("Generation")
        let recipeDataParsed = recipeData.data.recipe_data.recipe_info
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
    
                    <View style={styles.headerContainer}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.recipeNameText}>{recipeDataParsed.title}</Text>
                        </View>
                        <View>
                            <Thumbnail style={styles.thumbnail} source={recipeDataParsed.image ? {uri: recipeDataParsed.image} : {source: require('../assets/default.png')}}/>
                        </View>
                    </View>
    
                    <View style={styles.bodyContainer}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoHeader}>Description</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.contentItem}>{(recipeDataParsed.summary) ? recipeDataParsed.summary.replace(/(<([^>]+)>)/gi, "") : "Recipe Summary Unavailable"}</Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoHeader}>Time</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.contentItem}>Preparation: {(recipeDataParsed.preparationMinutes) ? recipeDataParsed.preparationMinutes : "N/A"} mins</Text>
                                <Text style={styles.contentItem}>Cooking: {(recipeDataParsed.cookingMinutes) ? recipeDataParsed.cookingMinutes : "N/A"} mins</Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoHeader}>Ingredients</Text>
                            <View style={styles.infoContent}>
                                {
                                    (recipeDataParsed.extendedIngredients ? recipeDataParsed.extendedIngredients.map((ingredient) => {
                                        return (
                                            <View key={ingredient.id} style={{flexDirection: 'row'}}>
                                                <Text style={styles.listItemIndicator}>-</Text>
                                                <Text style={styles.listItem}>{ingredient.originalString}</Text>
                                            </View>
                                        );
                                    }) : <Text style={styles.listItem}>Ingredient Unavailable</Text>)
                                }
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoHeader}>Instructions</Text>
                            <View style={styles.infoContent}>
                                {
                                    (recipeDataParsed.analyzedInstructions[0] ? recipeDataParsed.analyzedInstructions[0].steps.map((step) => {
                                        return (
                                            <View key={step.number} style={{flexDirection: 'row'}}>
                                                <Text style={styles.listItemIndicator}>{step.number}. </Text>
                                                <Text style={styles.listItem}>{step.step}</Text>
                                            </View>
                                        );
                                    }) : <Text style={styles.listItem}>Instruction Unavailable</Text>)
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    else {
        let loadText = "Generating Recipes..."
        return (
            <View>
            <SafeAreaView style={styles.safeAreaView}>
                {/* <StatusBar barStyle="dark-content" ></StatusBar> */}
                <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View>
                        <Loader color={colors} text={loadText}></Loader>
                    </View>
                </ScrollView>
            </SafeAreaView>
            </View>
        )
    }

}