import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity, Image, Alert, Button, DatePickerIOS} from 'react-native';
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

// default notify day before and on the day
export const notifyDays = atom({
    key: 'notifyDays', // unique ID
    default: [false, true, false, false], // default is only the day prior
});

export const notifyTime = atom({
    key: 'notifyTime', // unique ID
    default: 12.5, // TODO: Figure out how to set this to a Date() object and we should be (relatively) set 
});

export default ({ navigation }) => {

    const [chosenDate, setChosenDate] = useState(new Date());

    // use an array to keep track of which settings are checked, and can iterate over it when creating notifications, in theory
    const [days, setDays] = useRecoilState(notifyDays);
    const [time, setTime] = useRecoilState(notifyTime);

    // default in 5 mins for demo purposes
    const [date, setDate] = useState(new Date(new Date().getTime() + 5*60000));
    const [mode, setMode] = useState('time');
    const [show, setShow] = useState(false);

    const { colors } = useTheme();

    const testFunc = async (params) => {
        console.log("IN THE TEST FUNC")
        console.log(params)
        await setChosenDate(params)
    }
    
    const BackArrow = () => {
        return (
            <TouchableOpacity onPress={() => navigation.goBack()} >
            {/* <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: 370}}/> */}
            <Ionicons name="chevron-back" size={35} color={colors.background == 'white' ? 'black' : 'white'} style={{marginRight: '90%'}}/>
        </TouchableOpacity>
        )
    }

    const onDayChange = (value) => {
        if (value === 0) {
            let newarr = [...days];
            newarr[0] = !newarr[0];
            // console.log('0');
            // console.log(days[0]);
            setDays(newarr);
            // console.log(days[0]);
        }
        else if (value === 1) {
            let newarr = [...days];
            newarr[1] = !newarr[1];
            // console.log('1');
            // console.log(days[1]);
            setDays(newarr);
            // console.log(days[1]);
        }
        else if (value === 2) {
            let newarr = [...days];
            newarr[2] = !newarr[2];
            // console.log('2');
            // console.log(days[2]);
            setDays(newarr);
            // console.log(days[2]);
        }
        else if (value === 3) {
            let newarr = [...days];
            newarr[3] = !newarr[3];
            // console.log('3');
            // console.log(days[3]);
            setDays(newarr);
            // console.log(days[3]);
            // console.log(days);
        }
    }

    const onChange = (event, selectedDate) => {
        // let startOfDay = new Date();

        // normalize to the start of the day
        // startOfDay.setHours(0, 0, 0, 0);
        // const currentDate = selectedDate;
        setShow(Platform.OS === 'ios');
        // setDate(currentDate);

        // console.log(event);
        // console.log(selectedDate.toLocaleTimeString());
        // console.log(startOfDay.toLocaleTimeString());

        // number of hrs from beginning of day
        // setTime((selectedDate.toLocaleTimeString() - startOfDay.toLocaleTimeString()) );
        // console.log((date - startOfDay) /1000 / 3600);
        console.log(selectedDate.getHours());
        console.log(selectedDate.getMinutes() / 60);

        // number of hrs from beginning of day
        setTime(selectedDate.getHours() + selectedDate.getMinutes() / 60);
        setDate(selectedDate);
        console.log(date);
        console.log(selectedDate);

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        console.log("HERE")
        showMode('time');
    };

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <SafeAreaView style={{backgroundColor: colors.background, flex: 1 }}>
            <BackArrow></BackArrow>
            <Text style={{ fontSize: 40, color: colors.text, fontWeight: 'bold', marginTop: '5%' }}> Notifications </Text>
            <View style={{ backgroundColor: colors.background, flex: 1, marginTop: 15}}>
                <SettingsList borderColor='#fff' defaultItemSize={50}>
                    <SettingsList.Header headerText='Remind Me:' headerStyle={{ color: colors.text, fontSize: 20 }} />
                    <SettingsList.Item
                        backgroundColor={colors.background}
                        hasSwitch={true}
                        switchState={days[0]}
                        switchOnValueChange={() => onDayChange(0)}
                        hasNavArrow={false}
                        title='The Day of Expiry'
                        titleStyle={{ color: colors.text }}
                    />
                    <SettingsList.Item
                        backgroundColor={colors.background}
                        hasSwitch={true}
                        switchState={days[1]}
                        switchOnValueChange={() => onDayChange(1)}
                        hasNavArrow={false}
                        title='One Day Before Expiry'
                        titleStyle={{ color: colors.text }}
                    />
                    <SettingsList.Item
                        backgroundColor={colors.background}
                        hasSwitch={true}
                        switchState={days[2]}
                        switchOnValueChange={() => onDayChange(2)}
                        hasNavArrow={false}
                        title='Two Days Before Expiry'
                        titleStyle={{ color: colors.text }}
                    />
                    <SettingsList.Item
                        backgroundColor={colors.background}
                        hasSwitch={true}
                        switchState={days[3]}
                        switchOnValueChange={() => onDayChange(3)}
                        hasNavArrow={false}
                        title='Three Days Before Expiry'
                        titleStyle={{ color: colors.text }}
                    />
                    <SettingsList.Header headerText={'Remind Me At:'} headerStyle={{ color: colors.text, fontSize: 20 }} />
                    <SettingsList.Item
                        // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
                        backgroundColor={colors.background}
                        icon={<Ionicons name="alarm-outline" style={{ fontSize: 25, marginLeft: 15, alignSelf: 'center', color: colors.text }} />}
                        // title={formatAMPM(date)}
                        title={"(feature in progress)"}
                        titleStyle={{ color: colors.text }}
                        titleInfoStyle={styles.titleInfoStyle}
                        onPress={showTimepicker}
                    />
                </SettingsList>
                {show && (
                    <View styl>
                        <DatePickerIOS
                          date={chosenDate}
                          mode={'time'}
                          onDateChange={testFunc}
                        />
                      </View>
                )}
            </View>
        </SafeAreaView>
    );
}