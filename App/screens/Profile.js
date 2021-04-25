import React, { createContext, useState, useEffect, useReducer, Fragment } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
        marginTop: statusBarHeight
    },
    lightItemCard: {
        flex: 1,
        flexDirection: 'row',
        width: cardWidth,
        height: cardHeight,
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
    section: {
        // flex: 1,
        // flexDirection: 'row',
        width: cardWidth,
        height: cardHeight / 1.5,
        margin: '2%',
        borderRadius: 10,
        // borderColor: '#E2E2E2',
        // borderWidth: 2,
        // shadowOffset: {
        //     width: 2,
        //     height: 4,
        // },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // backgroundColor: 'white'
    },
    sectionTitle: {
        color: '#6be3d9',
        fontSize: 20,
        // padding
    },
    sectionInfo: {
        // color: 'cyan',
        fontSize: 16,
        // padding
    },
    separator: {
        backgroundColor: "gray",
        height: StyleSheet.hairlineWidth,
        // marginLeft: 20,
        // marginRight: 20,
    },
    image: {
        // marginBottom: 40,
        height: "30%",
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    // safeAreaView: {
    //     height: "100%",
    //     width: "200%"
    // },
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
        backgroundColor: 'black'
    }
})

const cardStyles = (colors) => StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "100%",
       marginTop: statusBarHeight // We need this styling for the reset generated recipes button to appear properly
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
    favfab: { // Check this styling absolutism
        position: 'absolute',
        left: 10,
        backgroundColor: '#FF69B4'
    },
})

// Component for each bit of user info
const UserInfo = ({ title, info, themeText }) => {
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

const FavoriteRecipeCard = (props) => {
    const { colors } = useTheme();
    // const styles = cardStyles(colors);
    // const [color, setColor] = useState("#808080")

    return (
        <TouchableOpacity style={styles.lightItemCard} onPress={() => {
            
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
                    // Code for popping up deletion modal to remove recipe from favorites

                }}>
                <Ionicons name="trash-outline" style={{ fontSize: 25 }} />
        </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const fetchFavoriteRecipes = async (username) => {

    try {
        console.log("PARAM CGHECK")
        console.log(username)
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

export default ({ navigation }) => {
    // const [user, dispatch] = useReducer(userReducer, {});
    const [first, setFirst] = useState("Developer");
    const [name, setName] = useState("Developer Account");
    const [email, setEmail] = useState("none");
    const [username, setUsername] = useState("none");
    const [avatarUrl, setAvatar] = useState("");
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    const { colors } = useTheme();
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

            // Extra Stuff for Favorite Recipe Generation
            let favorites = await fetchFavoriteRecipes(username)

            console.log("CHECKING USEEFFECT FAV")
            console.log(favorites)

            await setFavoriteRecipes(favorites.favorites)
        }
        fetchUser();
    }, [isFocused]);

    // Add in component/section for displaying the favorited recipes
    return (
        <Fragment>
        <SafeAreaView style={{flex: 0}} />
        <View style={styles.container}>
            {/* <StatusBar barStyle="dark-content" backgroundColor={'#ffffff'}></StatusBar> */}
            <StatusBar barStyle={colors.background === 'white' ? 'dark-content' : "light-content"} backgroundColor={colors.background}></StatusBar>

            <Text style={{ fontSize: 40, marginBottom: screen.height * 0.05, color: colors.text }}>Hi, {first}</Text>

            <Gravatar options={{
                email: email,
                parameters: { "size": "500", "d": "mm" },
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

            <ScrollView>
            <View>
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
            <View style={{ position: 'absolute', bottom: 10 }}>
                {/* <View style={{flexDirection: 'row-reverse'}}> */}

                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.clear();
                    navigation.navigate('Login');
                }}>
                    <Text style={{color: colors.text}}>Log Out</Text>
                </TouchableOpacity>
            </View>

        </View>
        </Fragment>
    )
}
