import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '@react-navigation/native';


export default LoaderFuncComp = () => {
  const { colors } = useTheme();

  const [themeColor, setThemeColor] = useState(colors)

  useEffect(() => {
    async function generateTheme() {
      console.log("Reloading theme")
      console.log(colors)
      await setThemeColor(colors)
    }
    generateTheme()
  }, [colors]);

  return (<Loader background={themeColor.background}></Loader>)
}


class Loader extends React.Component {

  constructor(props) {
      super(props)
      this.state = {pantry: []}
      this.state = {background: props.background}
      this.state = {text: props.text}
  }

  async componentDidMount() {

    this.animation.play();
    const currentPantry = await AsyncStorage.getItem('ingredients'); // async storage is kinda tricky here, be careful
    this.setState({ 
        pantry: currentPantry
     });
    // Or set a specific startFrame and endFrame with:
    // this.animation.play(30, 120);
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  render() {

    // console.log("RENDERING")
    // console.log(this.state.background)

    // Fix the conditional rendering here: also make sure AsyncStorage is up to date / makes sense
    return (
      <View style={styles.animationContainer}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#eee',
          }}
          source={require('../assets/loading.json')}
          // OR find more Lottie files @ https://lottiefiles.com/featured
          // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
        />
        <View style={styles.buttonContainer}>
          <Text>"Add items to your Pantry to generate Recipes!"</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  darkAnimationContainer: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 16,
    color: '#8e8e93'
}
});