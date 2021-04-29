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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // const [themeButton, setThemeButton] = useState(false)
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

    const onThemeChange = async (value) => {
        if (theme === 'light') {
            console.log("SETTING DARK")
            setTheme('dark');
            await AsyncStorage.setItem("animation-theme", 'dark') // Adding extra value for animation-state-management
            // setThemeButton(value)
            toggleSwitch();
        }
        else {
            await AsyncStorage.setItem("animation-theme", 'white') // Adding extra value for animation-state-management
            console.log("SETING LIGHT")
            setTheme('light');
            // setThemeButton(value)
            toggleSwitch();
        }
    }

    return (
        // <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
        <SafeAreaView style={{ marginTop: statusBarHeight * 0.5, backgroundColor: colors.background, flex: 1 }}>
            {/* <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
            <Text style={{alignSelf:'center',marginTop:30,marginBottom:10,fontWeight:'bold',fontSize:16}}></Text>
          </View> */}
            <Text style={{ fontSize: 40, color: colors.text, fontWeight: 'bold' }}> Options </Text>

            <View style={{ backgroundColor: colors.background, flex: 1 }}>
                <SettingsList borderColor='#fff' defaultItemSize={50}>
                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        backgroundColor={colors.background}
                        icon={
                            <Ionicons name="fast-food-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />
                        }
                        hasSwitch={true}
                        switchState={passiveRecipes}
                        switchOnValueChange={onRecipeChange}
                        hasNavArrow={false}
                        title='Stop Passive Recipe Generation'
                        titleStyle={{ color: colors.text }}
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="moon-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        title='Dark Theme'
                        titleStyle={{ color: colors.text }}
                        hasSwitch={true}
                        switchState={dark}
                        hasNavArrow={false}
                        switchOnValueChange={onThemeChange}
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="code-working-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        title='Recipe Generation Settings'
                        titleStyle={{ color: colors.text }}
                        titleInfoStyle={styles.titleInfoStyle}
                        onPress={() => Alert.alert('Route to Algorithm Settings Page')}
                    />

                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="notifications-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        title='Notifications'
                        titleStyle={{ color: colors.text }}
                        onPress={() => navigation.navigate('Notifications')}
                    />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="people-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        title='Account Management'
                        titleStyle={{ color: colors.text }}
                        onPress={() => Alert.alert('Route To Account Management Page')}
                    />

                    <SettingsList.Header headerStyle={{ marginTop: 15 }} />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/general.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="help-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        title='About the Developers'
                        titleStyle={{ color: colors.text }}
                        onPress={() => Alert.alert('Route To About Page')}
                    />
                </SettingsList>
            </View>
        </SafeAreaView>

        // </View>
    );
}