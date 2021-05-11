import React, { createContext, useState, useEffect, useReducer, Fragment } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { Thumbnail } from 'native-base';
import { Avatar } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import { Gravatar, GravatarApi } from 'react-native-gravatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '@react-navigation/native';

import Constants from 'expo-constants';
import { Component } from 'react';
import api from '../api/api';

const screen = Dimensions.get('window');

const statusBarHeight = Constants.statusBarHeight;
const cardWidth = screen.width * 0.9;
const cardHeight = screen.height * 0.12;

const makeStyles = (colors) => StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight
    },
    lightItemCard: {
        flex: 1,
        flexDirection: 'row',
        width: screen.width * 0.85,
        height: screen.height * 0.1133,
        marginTop: screen.height * 0.01,
        marginBottom: screen.height * 0.01,
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: 'white'
    },
    recipeNameText: {
        fontSize: 16,
        color: colors.text
    },
    section: {
        width: cardWidth,
        height: cardHeight / 1.5,
        margin: '1%',
        borderRadius: 10,
    },
    favoritesSection: {
        width: cardWidth,
        alignItems: "center",
        borderRadius: 10,
    },
    sectionTitle: {
        color: '#6be3d9',
        fontSize: 18
    },
    sectionInfo: {
        fontSize: 16
    },
    separator: {
        backgroundColor: "gray",
        height: StyleSheet.hairlineWidth,
    },
    image: {
        height: "30%",
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    roundedProfileImage: {
        width: 150, height: 150, borderWidth: 3,
        borderColor: '#6be3d9', borderRadius: 75
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
        color: 'black' // Used to be colors.text; fix for actual styling
    },
    itemCard: {
        flex: 1,
        flexDirection: 'row',
        width: screen.width * 0.85,
        height: screen.height * 0.1133,
        marginTop: screen.height * 0.01,
        marginBottom: screen.height * 0.01,
        borderRadius: 10,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowColor: 'white',
        backgroundColor: colors.black
    },
    logoutButt: {
        width: 75,
        borderRadius: 20,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f2c572",
        marginLeft: 'auto',
        margin: screen.width * 0.01
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22
    },
    modalView: {
        margin: '10%',
        // backgroundColor: "white",
        backgroundColor: 'white', // MAKE CONFIGURABLE WITH THEME
        borderRadius: 50,
        padding: 30,
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
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: 'black' // MAKE CONFIGURABLE WITH THEME
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
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
    ioniconContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: cardWidth * 0.010
    }
})

// Component for each bit of user info
const UserInfo = ({ title, info, themeText }) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    return (
        <View style={styles.section}>
            <View style={{ padding: 10 }}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={[styles.sectionInfo, { color: themeText }]}>{info}</Text>
            </View>
            <View style={styles.separator} />
        </View>
    )
}

// const UserContext = createContext('nope');

const getFirst = async () => {
    try {
        const user = await AsyncStorage.getItem('first');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getName = async () => {
    try {
        const user = await AsyncStorage.getItem('first') + ' ' + await AsyncStorage.getItem('last');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getEmail = async () => {
    try {
        const user = await AsyncStorage.getItem('email');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const getUsername = async () => {
    try {
        const user = await AsyncStorage.getItem('username');
        return user;
    } catch (e) {
        console.log('Failed to fetch the data from storage');
    }
}

const DeletionModal = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);

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
                <TouchableOpacity
                    style={styles.centeredView}
                    activeOpacity={1}
                    onPressOut={() => { setModalVisible(false) }}
                >
                    <View style={styles.centeredView}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Are you sure you want to delete {props.item} from your favorite recipes?</Text>
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
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </Modal>
            <TouchableOpacity key={props.title} onPress={() => setModalVisible(true)} style={styles.ioniconContainer}>
                <Ionicons name="trash-outline" style={{ fontSize: 25, color: 'gray' }} />
            </TouchableOpacity>
        </View>
    );
}

const FavoriteRecipeCard = (props) => {
    const { colors } = useTheme();
    const styles = makeStyles(colors);
    // const [color, setColor] = useState("#808080")
    const [deletedItem, setDeletedItem] = useState('')

    // Callback function for deletion
    const stateCallback = async (result) => {

        if (!result) { // http://54.237.232.9/v1/favorite/delete/petek222?recipe_id=205099
            
            let username = await AsyncStorage.getItem('username')

            console.log("Removing item from favorites")
            console.log(username)
            console.log(props.id)
            console.log(props.recipe_name)
            console.log(props.picture)

            try {

                let response = await api.delete(`/favorite/delete/${username}?recipe_id=${props.id}`);

                console.log("Ingredient Deletion Response")
                console.log(response)
                setDeletedItem(props.id)

            }
            catch (error) {
                console.log("Error in deleting recipe from favorites")
                console.log(error)
            }
        }
    }

    // Boolean removes deleted card from view immediately
    if (props.id !== deletedItem) {
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
                    <DeletionModal item={props.title} remove={stateCallback}></DeletionModal>
                </View>
            </TouchableOpacity>
        )
    }
    else {
        return null
    }
}

const fetchFavoriteRecipes = async (username) => {

    try {
        // Make some API call here to actually generate the recipes
        let response = await api.get(`/favorite/${username}`);

        let res = response.data
        return res
    }
    catch (e) {
        console.log("Error in Generating Favorite Recipes")
        console.log(e)
    }

}

const generatePantry = async (username) => {
    try {
        let response = await api.get(`/pantry/${username}`);
        if (response.data.ingredients) {

            let ingredientNames = [];

            // loop to grab ingredient names for recipe gen
            for (let i = 0; i < response.data.ingredients.length; i++) {
                let entry = response.data.ingredients[i]
                let ingredientName = entry["name"]
                ingredientNames.push(ingredientName)
            }

            await AsyncStorage.setItem("ingredients", JSON.stringify(ingredientNames));
        }
    } catch (err) {
        console.log(err);
    }
}

export default ({ navigation }) => {
    // const [user, dispatch] = useReducer(userReducer, {});
    const [first, setFirst] = useState("Developer");
    const [name, setName] = useState("Developer Account");
    const [email, setEmail] = useState("none");
    const [username, setUsername] = useState("none");
    const [avatarUrl, setAvatar] = useState("");
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    const { colors } = useTheme();
    const styles = makeStyles(colors);
    const isFocused = useIsFocused()

    // fetch user info on load
    useEffect(() => {
        async function fetchUser() {
            const first = await getFirst();
            const name = await getName();
            const username = await getUsername();
            const email = await getEmail();
            setFirst(first);
            setName(name);
            setUsername(username);
            setEmail(email);

            // Extra Stuff for Recipe Generation

            // Fetching stored favorite recipes
            let favorites = await fetchFavoriteRecipes(username)
            await setFavoriteRecipes(favorites.favorites)

            // Fetching User's Current Pantry
            await generatePantry(username)

        }
        fetchUser();
    }, [isFocused]);

    // Add in component/section for displaying the favorited recipes

    // NOTE: CHECK ABSOLUTE STYLING/POSITION OF THE LOG OUT BUTTON
    return (
        <Fragment>
            <TouchableOpacity style={styles.logoutButt} onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('Login');
                }}>
                <Text>Log Out</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                {/* <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar> */}
                <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>

                
                
                    
                <Text style={{ fontSize: 40, marginBottom: screen.height * 0.025, color: colors.text }}>Hi, {first}</Text>

                <Gravatar options={{
                    email: email,
                    parameters: { "size": "400", "d": "mm" },
                    secure: true
                }}
                    style={styles.roundedProfileImage} />

                

                <UserInfo title={'Name'} info={name} themeText={colors.text} />
                <UserInfo title={'Username'} info={username} themeText={colors.text} />
                <UserInfo title={'Email'} info={email} themeText={colors.text} />
                
                <View style={styles.section}>
                    <View style={{ padding: 10 }}>
                        <Text style={styles.sectionTitle}>Favorite Recipes</Text>
                    </View>
                    <View style={styles.separator} />
                </View>

                {/* <View>
                    <View style={{ padding: 10 }}>
                        <Text style={styles.sectionTitle}>Favorite Recipes</Text>
                    </View>
                    <View style={styles.separator} />
                </View>            */}

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.favoritesSection}>
                    {
                        favoriteRecipes.map((recipe, i) => {
                
                            let recipe_name = recipe.recipe_name;
                            let recipe_id = recipe.recipe_id;
                            let recipe_image = recipe.picture
                            
                                return (
                                    <FavoriteRecipeCard 
                                    key={i}
                                    image={recipe_image}
                                    title={recipe_name} 
                                    nav={navigation} 
                                    id={recipe_id}
                                    ></FavoriteRecipeCard>
                                )
                        })
                    }
                    </View>
                </ScrollView> 

                {/* <View style={{position: 'absolute', right: 0}}> */}

            </View>
        </Fragment>
    )
}
