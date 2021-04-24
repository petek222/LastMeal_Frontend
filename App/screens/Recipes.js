import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Thumbnail } from 'native-base';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from "@react-navigation/native";
import Constants from 'expo-constants';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../config/Loader'

import { useTheme } from '@react-navigation/native';

const statusBarHeight = Constants.statusBarHeight;

const window = Dimensions.get('window');
const cardWidth = window.width * 0.9;
const cardHeight = window.height * 0.12;

const makeStyles = (colors) => StyleSheet.create({
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
    recipeNameText: {
        fontSize: 16,
        color: colors.text
    },
    cardButtons: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 5
    },
    fab: { // Check this styling absolutism
        position: 'absolute',
        right: 10,
    },
});

const RecipeCard = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const [color, setColor] = useState("#000000")

    return (
        <TouchableOpacity style={colors.background === 'white' ? styles.lightItemCard : styles.itemCard} onPress={() => {
            
            props.nav.navigate('RecipeInfo', {
                recipeID: props.id
            })
        }}>
            <View style={styles.itemCardContent} >
                <Thumbnail source={props.image ? { uri: props.image } : { source: require('../assets/chicken.jpg') }} />
                <View style={styles.itemCardText}>
                    <Text style={styles.recipeNameText} >{props.title}</Text>
                </View>
            </View>
            <View style={styles.cardButtons}>
            <TouchableOpacity onPress={async () => {
                    if (color !== '#FF69B4') {
                        setColor('#FF69B4')
                        // Here we will want to add the item to some favorites object that can be sent to the user's profile
                    }
                    else {
                        setColor('#000000')
                        // Here we will want to remove the item from the object described above
                    }
                }}>
            <Ionicons name="heart-outline" color={color} style={{ fontSize: 25 }} />
        </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default ({route, navigation}) => {

    let [recipes, setRecipes] = useState([]);
    const [recipesAreSelected, setRecipesAreSelected] = useState(false)

    const isFocused = useIsFocused()
    const { colors } = useTheme();
    const styles = makeStyles(colors);

    useEffect(() => {

        async function generateRecipes() {
            const currentPantry = await AsyncStorage.getItem('ingredients');

            let requestParam = currentPantry;

            // If the route contains a list, we know we were sent via the Generate Recipes button
            if (route.params != undefined) {
                requestParam = route.params.recipeList.join() // Using join for array-json compatibility
                await setRecipesAreSelected(true)
            }

            let recipeList = await getRecipes(requestParam);
                
            await setRecipes(recipeList)
        }
        generateRecipes()
    }, [isFocused, recipesAreSelected]);

    const ResetRecipesButton = (props) => {
        const { colors } = useTheme();
        const styles = makeStyles(colors);
        if (recipesAreSelected == true) {
            return (
                <FAB
                    style={styles.fab}
                    small
                    label="Reset Generated Recipes"
                    onPress={() => {
                        console.log("Selected Ingredients")
                        setRecipesAreSelected(false)
                        route.params = undefined // Setting to undefined to reload generation
                    }}
                />
            )
        }
        else {
            return (<View></View>)
        }
    }


    const getRecipes = async (currentPantry) => {

        try {
            let config = {
                headers: {
                  'Content-Type': 'application/json',
                }
              }

            let response = await api.post('/recipes', {
                ingredients: currentPantry
            }, config);

            let recipeInformation = response.data.recipe_data.recipe_data;

            return recipeInformation
        }
        catch (error) {
            console.log(error)
            return "Error in requesting recipe data";
        }
    }

    if (recipes.length > 0) {
        return (
            <View>
            <ResetRecipesButton></ResetRecipesButton>
            <SafeAreaView style={styles.safeAreaView}>
                {/* <StatusBar barStyle="dark-content" ></StatusBar> */}
                <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View>
                        {
                            recipes.map((recipe, i) => {
    
                                let recipe_name = recipe.title;
                                let recipe_id = recipe.id;
                                
                                // This regex doesn't display any recipes with numbers in them, since hose are usually
                                // random lists and not particular recipes (we will probably want to refine this/put
                                // it on the backend later)
                                if (!/\d/.test(recipe.title)) { 
                                    return (
                                        <RecipeCard key={i} image={recipe.image} title={recipe_name} nav={navigation} id={recipe_id}></RecipeCard>
                                    )
                                }
    
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
            </View>
        )
    }
    else {
        let loadText = "Add items to your Pantry to generate Recipes!"
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
