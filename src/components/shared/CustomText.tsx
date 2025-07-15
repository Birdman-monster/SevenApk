import { Colors } from "@/utils/Constants"; // Assure-toi que Colors.text existe
import React, { FC, ReactNode } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// Définir les tailles de texte selon les variantes
const fontSizes = {
  h1: 24,
  h2: 22,
  h3: 20,
  h4: 18,
  h5: 16,
  h6: 14,
  h7: 10,
  h8: 9,
};


type Variant = keyof typeof fontSizes;

interface CustomTextProps {
  variant?: Variant;
  style?: TextStyle;
  fontFamily?: "Regular" | "Bold" | "Italic" | string; 
  fontSize?: number;
  numberOfLines?: number;
  children: ReactNode;
}

const CustomText: FC<CustomTextProps> = ({
  variant = "h6",
  style,
  fontFamily = "Regular",
  fontSize,
  numberOfLines,
  children,
}) => {
  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: RFValue(fontSize ?? fontSizes[variant]),
          fontFamily: `NotoSans-${fontFamily}`,
        },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.text ?? "#000", 
    textAlign: "left",
  },
});

export default CustomText;
