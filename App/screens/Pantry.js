import React from 'react';
import { Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, View, StatusBar } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import Constants from 'expo-constants';
import Autocomplete from 'react-native-autocomplete-input'

const window = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;

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
        margin: '2%',
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
    itemCardText :{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: (cardWidth * 0.05)
    },
    foodNameText: {
        fontSize: 20
    },
    expirationText: {
        fontSize: 12
    },
    cardButtons: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 5   
    },
    fab: { // Check this styling absolutism
        position: 'absolute',
        margin: 60,
        right: -50,
        bottom: 0,
    }
  });

//   <Text style={styles.smallButt} onPress={() => navigation.navigate('Login')}>or Log In</Text>

const AddIngredientButton = (props) => {
    return (
        <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => props.nav.navigate('AddItem')}
      />
    )
};

const PantryCard = (props) => {

    return (
        <View style={styles.itemCard}>
            <View style={styles.itemCardContent}>
                <Thumbnail source={require(`../assets/chicken.jpg`)} />
                <View style={styles.itemCardText}>
                    <Text style={styles.foodNameText}>{props.title}</Text>
                    <Text style={styles.expirationText}>Expiration: {props.expr}</Text>
                    <Text style={styles.expirationText}>Quantity: {props.quantity ? props.quantity : 'Not specified'}</Text>
                </View>
            </View>
            <View style={styles.cardButtons}>
                <Ionicons name="heart-outline" style={{fontSize: 20}} />
                <Ionicons name="ios-close-circle-outline" style={{fontSize: 20}} />
            </View>
        </View>
    )
}

export default ({navigation}) => {
    return (
        <SafeAreaView style={styles.safeAreaView}>
            {/* To make notification bar same color as background */}
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>

            <SearchBar platform="ios" placeholder="Search"></SearchBar>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>    
                <View>
                    <PantryCard title="Chicken Breast" expr="3/10" quantity={2}></PantryCard>
                    <PantryCard title="Broccoli" expr="3/17"></PantryCard>
                    <PantryCard title="Apple" expr="3/21"></PantryCard>
                    <PantryCard title="Yogurt" expr="4/1"></PantryCard>
                </View>
            </ScrollView>
            <AddIngredientButton nav={navigation}></AddIngredientButton>
        </SafeAreaView>
    );
}