import React from 'react';
import { Dimensions, StyleSheet, SafeAreaView, ScrollView, Text, View } from "react-native";
import Constants from 'expo-constants';
import { Thumbnail } from 'native-base';
import { useTheme } from '@react-navigation/native';

// import moment from 'moment';
// import api from '../api/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default ({navigation}) => {
    const {colors} = useTheme();
    const styles = makeStyles(colors);

    // replace require with prop json data passed into this component
    const recipeData = require('../assets/recipeData.json');

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