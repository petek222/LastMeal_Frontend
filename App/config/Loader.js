import React, {useEffect, useState} from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '@react-navigation/native';


// export default LoaderFuncComp = () => {
//   const { colors } = useTheme();

//   const [themeColor, setThemeColor] = useState(colors)

//   console.log("THEME LOAD")
//   console.log(colors)

//   useEffect(() => {
//     async function generateTheme() {
//       // console.log("Reloading theme")
//       // console.log(colors)
//       await setThemeColor(colors)
//     }
//     generateTheme()
//   }, [colors]);

//   return (<Loader background={colors}></Loader>)
// }


export default class Loader extends React.Component {

  constructor(props) {
      super(props)
      this.state = {pantry: []}
      this.state = {colors: ""}
      this.state = {text: props.text}
  }

  async componentDidUpdate(props) {
    let animationColor = await AsyncStorage.getItem('animation-theme')
    if (this.state.colors !== animationColor) {
      await this.setState({
        colors: animationColor
      })
    }
  }

  async componentDidMount(props) {

    let animationColor = await AsyncStorage.getItem("animation-theme")

    this.animation.play();
    // const currentPantry = await AsyncStorage.getItem('ingredients'); // async storage is kinda tricky here, be careful
    await this.setState({ 
        colors: animationColor
     });
    // Or set a specific startFrame and endFrame with:
    // this.animation.play(30, 120);
  }

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

  render() {

    let lottieColor = (this.state.colors == "white") ? "#222" : "#fff"

    // Fix the conditional rendering here: also make sure AsyncStorage is up to date / makes sense
    return (
      <View style={this.state.colors == "white" ? styles.darkAnimationContainer : styles.animationContainer}>
        <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: lottieColor,
          }}
          source={require('../assets/loading.json')}
          // OR find more Lottie files @ https://lottiefiles.com/featured
          // Just click the one you like, place that file in the 'assets' folder to the left, and replace the above 'require' statement
        />
        <View>
        <Text style={{ color: this.state.colors == "white" ? "white" : "black" }}>{this.state.text}</Text>
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
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});