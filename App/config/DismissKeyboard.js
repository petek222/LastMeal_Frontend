import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";

export default DismissKeyboard = ({ children }) => {
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {children}
        </TouchableWithoutFeedback>
    );
}