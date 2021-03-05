
import React from 'react';
import { StatusBar, View, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    safeAreaView: {
        height: "100%",
        width: "200%"
    }
})

export default ({navigation}) => {
    return (
        <SafeAreaView style={{styles}}>
            <Text>Recipe Time</Text>
        </SafeAreaView>
    )
    
}