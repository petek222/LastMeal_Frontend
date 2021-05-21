import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image, Alert, Button, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { SafeAreaView } from 'react-native-safe-area-context';
import SwitchWithIcons from "react-native-switch-with-icons";

import SettingsList from 'react-native-settings-list';

import Constants from 'expo-constants';
import {
    atom,
    useRecoilState
} from 'recoil';
// import { darkState } from '../config/Navigation';
import { useTheme } from '@react-navigation/native';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
// import DateTimePicker from '@react-native-community/datetimepicker';

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

// // default notify day before and on the day
// export const notifyDays = atom({
//     key: 'notifyDays', // unique ID
//     default: [false, true, false, false], // initial value
// });

// export const notifyTime = atom({
//     key: 'notifyTime', // unique ID
//     default: 13.5, // initial value, 1:30pm
// });

export default ({ navigation }) => {

    // use an array to keep track of which settings are checked, and can iterate over it when creating notifications, in theory
    // const [days, setDays] = useRecoilState(notifyDays);
    // const [time, setTime] = useRecoilState(notifyTime);

    // default in 5 mins for demo purposes
    const [date, setDate] = useState(new Date(new Date().getTime() + 5*60000));
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const { colors } = useTheme();
    
    const BackArrow = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} >
            {/* <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: 370}}/> */}
            <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: '90%'}}/>
        </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{backgroundColor: colors.background, flex: 1 }}>
            <BackArrow></BackArrow>
            <Text style={{ fontSize: 40, color: colors.text, fontWeight: 'bold', marginTop: '5%' }}> About </Text>
            <View style={{ backgroundColor: colors.background, flex: 1, marginTop: 15}}>
                <Text style={{color: colors.text, alignContent: "center", fontSize: 20, marginLeft: '5%', marginBottom: '5%'}}>Thanks so much 
                for using our app! This app was initially built as a final project for the Computer Science Major at Vanderbilt
                University by the following four students:</Text>
                <FlatList data={[
                    {key: 'John Mathena'},
                    {key: 'Peter Koncelik'},
                    {key: 'Robert Holmes'},
                    {key: 'Young-Rae Kim'},
                ]}
                renderItem={({item}) => <Text style={{color: colors.text, alignContent: "center", fontSize: 20, marginLeft: '5%'}}>{item.key}</Text>}
                />
                <Text style={{color: colors.text, alignContent: "center", fontSize: 20, marginLeft: '5%'}}></Text>
            </View>
        </SafeAreaView>
    );
}