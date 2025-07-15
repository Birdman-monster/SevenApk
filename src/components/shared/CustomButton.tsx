import { Colors } from "@/utils/Constants";
import React, { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

// Define the props interface for CustomButton
interface CustomButtonProps {
  onPress: () => void; // A function that takes no arguments and returns nothing
  title: string;       // The text displayed on the button
  disabled?: boolean;  // Optional: if the button is disabled
  loading?: boolean;   // Optional: if the button is in a loading state
}

const CustomButton: FC<CustomButtonProps> = ({
  onPress,
  title,
  disabled,
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? Colors.secondary : Colors.primary,
        },
      ]}
      disabled={disabled || loading} // 💡 Important: Disable button when loading too
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} size="small" />
      ) : (
        <CustomText
          fontFamily="SemiBold"
          style={{
            fontSize: RFValue(12),
            color: disabled ? "#fff" : Colors.text, // Adjusted color for disabled state
          }}
        >
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default CustomButton;