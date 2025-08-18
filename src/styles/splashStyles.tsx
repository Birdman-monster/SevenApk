import { screenHeight, screenWidth } from "@/utils/Constants";
import { StyleSheet } from "react-native";

export const splashStyles = StyleSheet.create({
    img: {
        width: screenWidth * 1.0,
        height: screenHeight * 1.0,
        resizeMode: 'contain'
    },
    text: {
        position: "absolute",
        bottom: 40,
    }
})