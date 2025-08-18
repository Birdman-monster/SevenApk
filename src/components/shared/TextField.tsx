import React, { FC } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

// Interface des props
interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string; // 👈 message d'erreur à afficher
}

const TextField: FC<TextFieldProps> = ({
  label,
  value,
  placeholder,
  onChangeText,
  onFocus,
  onBlur,
  error,
}) => {
  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          error ? { borderColor: "red" } : { borderColor: "black" },
        ]}
      >
        <CustomText fontFamily="Medium" style={styles.text}>
          {label}
        </CustomText>
        <TextInput
          placeholder={placeholder || ""}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor="#ccc"
          style={styles.input}
        />
      </View>
      {error && (
        <CustomText style={styles.errorText}>{error}</CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 0,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: RFValue(13),
    fontFamily: "Medium",
    height: 45,
    width: "90%",
    color: "#000",
  },
  text: {
    fontSize: RFValue(13),
    top: -1,
    fontFamily: "Medium",
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: RFValue(11),
    marginTop: 2,
    marginLeft: 5,
  },
});

export default TextField;
