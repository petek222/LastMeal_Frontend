
// import React from 'react';
// import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';

// const screen = Dimensions.get('window');

// const styles = StyleSheet.create({
//     safeAreaView: {
//         height: "100%",
//         width: "200%"
//     }
// })

// export default ({navigation}) => {
//     return (
//         <SafeAreaView style={{styles}}>
//             <Text>Option Screen</Text>
//         </SafeAreaView>
//     )

// }


import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import SwitchWithIcons from "react-native-switch-with-icons";

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';
import {
    useRecoilState
} from 'recoil';
import { darkState } from '../config/Navigation';
import { useTheme } from '@react-navigation/native';

const statusBarHeight = Constants.statusBarHeight;


const styles = StyleSheet.create({
    imageStyle: {
        marginLeft: 15,
        alignSelf: 'center',
        height: 30,
        width: 30
    },
    titleInfoStyle: {
        fontSize: 16,
        color: '#8e8e93'
    }
});

export default ({ navigation }) => {

    // [onValueChange, setOnValueChange] = useState("")
    const [passiveRecipes, setPassiveRecipes] = useState(false)
    const [themeButton, setThemeButton] = useState(false)
    const [theme, setTheme] = useState("light")

    const [dark, setDark] = useRecoilState(darkState);
    const { colors } = useTheme();

    const onRecipeChange = (value) => {
        setPassiveRecipes(value)
    }

    const toggleSwitch = () => {
        setDark(!dark);
        console.log(dark)
    };

    const onThemeChange = (value) => {
        if (theme === 'light') {
            console.log("SETTING DARK")
            setTheme('dark');
            setThemeButton(value)
            toggleSwitch();
        }
        else {
            console.log("SETING LIGHT")
            setTheme('light');
            setThemeButton(value)
            toggleSwitch();
        }
    }

    return (
        // <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
        <SafeAreaView style={{ marginTop: statusBarHeight, backgroundColor: colors.background, flex: 1 }}>
            {/* <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
            <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}></Text>
          </View> */}
            <Text style={{ fontSize: 40, color: colors.text }}> Options </Text>

            <View style={{ backgroundColor: colors.background, flex: 1 }}>
                <SettingsList borderColor='#fff' defaultItemSize={50}>
                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        icon={
                            <Ionicons name="fast-food-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />
                        }
                        hasSwitch={true}
                        switchState={passiveRecipes}
                        switchOnValueChange={onRecipeChange}
                        hasNavArrow={false}
                        title='Passively Generate Recipes'
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
                        icon={<Ionicons name="moon-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />}
                        title='Dark Theme'
                        hasSwitch={true}
                        switchState={themeButton}
                        hasNavArrow={false}
                        switchOnValueChange={onThemeChange}
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
                        icon={<Ionicons name="code-working-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />}
                        title='Recipe Generation Settings'
                        titleInfoStyle={styles.titleInfoStyle}
                        onPress={() => Alert.alert('Route to Algorithm Settings Page')}
                    />

                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
                        icon={<Ionicons name="notifications-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />}
                        title='Notifications'
                        onPress={() => Alert.alert('Route To Notifications Page')}
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
                        icon={<Ionicons name="people-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />}
                        title='Account Management'
                        onPress={() => Alert.alert('Route To Account Management Page')}
                    />

                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/general.png')}/>}
                        icon={<Ionicons name="help-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center' }} />}
                        title='About the Developers'
                        onPress={() => Alert.alert('Route To About Page')}
                    />
                </SettingsList>
            </View>
        </SafeAreaView>

        // </View>
    );
}