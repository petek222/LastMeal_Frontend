import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, View, Image, TextInput, Button, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import { Thumbnail } from 'native-base';

// import moment from 'moment';
// import api from '../api/api';
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
        paddingTop: 10
    },
    nameContainer: {
        maxWidth: windowWidth * 0.6
    },
    recipeNameText: {
        fontSize: 36,
        fontWeight: 'bold',
    },
    thumbnail: {
        height: 125,
        width: 125
    },
    bodyContainer: {
        padding: 10,
    },
    infoHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    infoContent: {
        fontSize: 16,
        paddingTop: 5,
        paddingBottom: 10
    },
});

export default ({navigation}) => {

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.headerContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.recipeNameText}>Chicken Souvlaki</Text>
                    </View>
                    <View>
                        <Thumbnail style={styles.thumbnail} source={require('../assets/chicken.jpg')}/>
                    </View>
                </View>
                <View style={styles.bodyContainer}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Description</Text>
                        <Text style={styles.infoContent}>Recipe description goes here, might not be necessary</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Ingredients</Text>
                        <Text style={styles.infoContent}>Recipe ingredients go here.</Text>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoHeader}>Steps</Text>
                        <Text style={styles.infoContent}>Recipe steps go here.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

}