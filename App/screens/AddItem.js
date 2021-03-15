import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { View, LayoutAnimation, TouchableOpacity, Text, StyleSheet, FlatList} from 'react-native';


const ingredientData = require('../assets/ingredientList.json')

const styles = StyleSheet.create({
    flatList:{
        paddingLeft: 15, 
        marginTop:15, 
        paddingBottom:15,
        fontSize: 20,
        borderBottomColor: '#26a69a',
        borderBottomWidth:1
    }
  });

// Here we at least have the ingredients being grabbed and rendered; continue to work on search impl
export default ({ navigation }) => {

    const [data, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
        setData(ingredientData);
        setIngredients(ingredientData);
    };
    
    return (
    <FlatList data={ingredients}
        extraData = {query} 
        renderItem = {({item}) =>
    <Text style={styles.flatList}>{`${item}`}
    </Text>} 
    />
    )
}

