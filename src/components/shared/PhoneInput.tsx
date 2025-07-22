import React, { FC } from "react";
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputFocusEventData, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

// Définition de l'interface des props pour PhoneInput
interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void; // onBlur est optionnel
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void; // onFocus est optionnel
}

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
}) => {
  return (
    <View style={styles.container}>
      <CustomText fontFamily="Medium" style={styles.text}>
       🇨🇲 +237 {/* Note: Le code du pays est hardcodé ici */}
      </CustomText>
      <TextInput
        placeholder="0000000000"
        keyboardType="phone-pad"
        value={value}
        maxLength={10}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={"#ccc"}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
    paddingHorizontal: 10,
    color:"black"
  },
  input: {
    fontSize: RFValue(13),
    // Attention : 'Medium' ici fait référence à une police chargée,
    // assurez-vous qu'elle est bien disponible pour TextInput.
    // Sinon, utilisez juste 'normal' ou 'bold' pour la fontFamily de base.
    fontFamily: "Medium", 
    height: 45,
    width: "90%",
    // Ajoutez une couleur de texte pour que l'entrée de l'utilisateur soit visible
    color: '#000', // Exemple: couleur noire
  },
  text: {
    fontSize: RFValue(13),
    top: -1,
    fontFamily: "Medium",
    color: '#000', // Couleur du texte du code pays
  },
});

export default PhoneInput;