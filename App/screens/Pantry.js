import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, ScrollView, SafeAreaView, Text, View, StatusBar, Alert, Modal, Pressable } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Thumbnail } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import Constants from 'expo-constants';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Autocomplete from 'react-native-autocomplete-input'
import { useIsFocused } from "@react-navigation/native";
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';


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
      }
  });

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
                    setModalVisible(!modalVisible)
                    props.remove(false)
                }}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <Text>  </Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    setModalVisible(!modalVisible)
                    props.remove(true)
                }}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity key={props.title} onPress={() => setModalVisible(true)}>
            <Ionicons name="ios-close-circle-outline" style={{fontSize: 25, marginTop: 20}} />
        </TouchableOpacity>
      </View>
    );
}

const PantryCard = (props) => {

    console.log("CHECK")
    console.log(props)

    const [viewComponent, setViewComponent] = useState(true);
    const [viewDeletion, setViewDeletion] = useState(false);
    const [deletionChoice, setDeletionChoice] = useState(false)

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
            console.log(props.title)
            console.log(props.quantity)
            console.log(props.expr)

            // Below is where the actual API call will be made; update Pantry API accordingly
            // try {            

            //     let response = await api.delete(`/pantry/delete/${props.title}`);
    
            //     console.log("Ingredient Deletion Response")
            //     console.log(response)
            //     // return json;
            // } catch (error) {
            //     notifyMessage("Deletion Failed");
            //     console.error(error);
            // }

        }

    }

    if (viewComponent) {
        return (
            <View style={styles.itemCard} id={props.title}>
                <View style={styles.itemCardContent}>
                    <Thumbnail source={props.image ? {uri: props.image} : {source: require('../assets/chicken.jpg')}} /> 
                    <View style={styles.itemCardText}>
                        <Text style={styles.foodNameText}>{props.title}</Text>
    
                        <Text style={styles.expirationText}>Expiration: {props.expr ? formatDate(props.expr) : "Not specified"}</Text>
    
                        <Text style={styles.expirationText}>Quantity: {props.quantity ? props.quantity : "Not specified"}</Text>
                    </View>
                </View>
                {/* {viewDeletion ? <DeletionModal item={props.title} delete_init={true}></DeletionModal> : null} */}
                <View style={styles.cardButtons}>
                    <Ionicons name="heart-outline" style={{fontSize: 25}} />
                    <DeletionModal item={props.title} remove={stateCallback} ></DeletionModal>
                </View>
            </View>
        )
    }

    else {
        return null;
    }
}

export default ({navigation}) => {

    let [ingredients, setIngredients] = useState([]);
    let [imageArray, setImageArray] = useState([]);

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

    return (
        <SafeAreaView style={styles.safeAreaView}>
            {/* To make notification bar same color as background */}
            <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar>
            <SearchBar platform="ios" placeholder="Search"></SearchBar>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>    
                <View>
                    {
                        // generate ingredient cards
                        ingredients.map((ingredient, i) => {
                            return (
                                <PantryCard
                                    image={imageArray[i]}
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