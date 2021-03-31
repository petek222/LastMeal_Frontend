import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, View, StatusBar } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import Constants from 'expo-constants';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input'
import { createClient } from 'pexels';
import { useIsFocused } from "@react-navigation/native";

const window = Dimensions.get('window');
const client = createClient('563492ad6f91700001000001c65e60214fe9449e892de0345e0272ab');

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

    const formatDate = (obj) => {

        console.log("TESTING DATE")
        console.log(obj);

        let epochDate = obj.$date
        let convDate = new Date(epochDate)
        return convDate.toLocaleDateString()
    }

    const generateThumbnail = () => {

        let query = props.title;

        let image_link = ""

        client.photos.search({ query, per_page: 1 }).then(photos => {
            console.log("HERE I AM!")
            console.log(photos)

            let image = photos.photos[0].src.small;
            console.log("TEST")
            console.log(image)
            // We can then throw the image into an array of some kind
            // Refer to these individually in the ingredient-generating loop portion

            image_link = image
            return image_link
        });

        // return image_link
    }

    // Thumbnail source
    // source={require(`../assets/chicken.jpg`)

    console.log("HERE")
    console.log(props.image);
    console.log(props.expr)

    // Figure out why image not rendering here
    return (
        <View style={styles.itemCard}>
            <View style={styles.itemCardContent}>
                <Thumbnail source={props.image ? {uri: props.image} : {source: require('../assets/chicken.jpg')}} /> 
                <View style={styles.itemCardText}>
                    <Text style={styles.foodNameText}>{props.title}</Text>

                    <Text style={styles.expirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text>

                    <Text style={styles.expirationText}>Quantity: {props.quantity ? props.quantity : "Not specified"}</Text>
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

    let [ingredients, setIngredients] = useState([]);
    let [imageArray, setImageArray] = useState([]);

    const isFocused = useIsFocused()

    //let test = [{"name": "apple", "quantity": 2, "expiration_date": "2021-3-24"}, {"name": "cucumber", "quantity": 5, "expiration_date": "2021-3-23"}];

    useEffect(() => {
        async function generatePantry() {
            let ingredientList = await getItems();
            console.log("In pantry generation")
            console.log(ingredientList)
            // await generateThumbnail(ingredientList)
        }
        generatePantry()
    }, [isFocused]);

    const getItems = async () => {
        try {
            let username = await getUsername();
            console.log("USERNAME")
            console.log(username)
            let response = await api.get(`/pantry/${username}`);
            if(response.data.ingredients) {
                await setIngredients(response.data.ingredients);
                return response.data.ingredients
            }
        } catch(err) {
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

    // Example Links
    // Apple: https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&h=130
    // Ginger: https://images.pexels.com/photos/1337585/pexels-photo-1337585.jpeg?auto=compress&cs=tinysrgb&h=130

    const generateThumbnail = (props) => {

        // console.log("IN HERE!")
        // console.log(props);

        let imageLinkArray = []

        props.forEach(ingredient => {
            let query = ingredient.name;
            let object = ingredient
            
            client.photos.search({ query, per_page: 1 }).then(photos => {

                console.log("Checking Photos")
                console.log(photos)
    
                let image = photos.photos[0].src.small;
                // We can then throw the image into an array of some kind
                // Refer to these individually in the ingredient-generating loop portion
    
                image_link = image

                console.log("CHECK ING OBJECT")
                console.log(ingredient)

                console.log("Check link")
                console.log(image_link)
                object['image'] = image_link

                console.log("CHECK ING OBJECT AFTER")
                console.log(object)

                imageLinkArray.push(object)
                // setIngredients(imageLinkArray)


                // console.log("Check Array")
                // imageLinkArray.push(image)
                // console.log(imageLinkArray)
                // setImageArray(imageLinkArray)
                // return image_link

            });

            // console.log("SETTING FINAL ARRAY")
            // console.log(imageLinkArray)
            // setIngredients(imageLinkArray)

        })

        
        // console.log("SETTING FINAL ARRAY")
        // console.log(imageLinkArray)
        // setIngredients(imageLinkArray)

        // console.log("Setting image links")
        // console.log(imageLinkArray)
        // setImageArray(imageLinkArray)

        // let query = props.name;

        // // let image_link = ""

        // client.photos.search({ query, per_page: 1 }).then(photos => {
        //     console.log("HERE I AM!")
        //     console.log(photos)

        //     let image = photos.photos[0].src.small;
        //     console.log("TEST")
        //     console.log(image)
        //     // We can then throw the image into an array of some kind
        //     // Refer to these individually in the ingredient-generating loop portion

        //     image_link = image
        //     return image_link
        // });

        // return image_link
    }

    exampleDate  = {"Object": {
        "$date": 1617148800000
      }
    }


    return (
        <SafeAreaView style={styles.safeAreaView}>
            {/* To make notification bar same color as background */}
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>
            <SearchBar platform="ios" placeholder="Search"></SearchBar>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>    
                <View>
                    <PantryCard title={"Apple"} expr={{"$date": 1617148800000}} quantity={5} image={"https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&h=130"}></PantryCard>
                    <PantryCard title={"Ginger"} expr={{"$date": 1718848800000}} quantity={1} image={"https://images.pexels.com/photos/1337585/pexels-photo-1337585.jpeg?auto=compress&cs=tinysrgb&h=130"}></PantryCard>

                    {
                        // key starts at 0 here
                        ingredients.map((ingredient, i) => {

                            // Prop to include for thumbnail generation
                            // image={ingredient.image}
                            return (
                                <PantryCard
                                    image={"https://images-na.ssl-images-amazon.com/images/I/719JxkiwTVL._SL1500_.jpg"}
                                    key={i}
                                    title={ingredient.name} 
                                    expr={ingredient.expiration_date} 
                                    quantity={ingredient.quantity}>
                                </PantryCard>
                            );
                        })
                    }
                </View>
            </ScrollView>
            <AddIngredientButton nav={navigation}></AddIngredientButton>
        </SafeAreaView>
    );
}


// data.ingredients.forEach(ingredient => {

    // let query = ingredient.name;

    // client.photos.search({ query, per_page: 1 }).then(photos => {
    //     console.log("HERE I AM!")
    //     console.log(photos)
    //     // We can then throw the image into an array of some kind
    //     // Refer to these individually in the ingredient-generating loop portion
    // });

// })
