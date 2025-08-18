import React, { FC } from "react";
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputFocusEventData, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText"; 


interface NameInputProps {
  label: string; 
  placeholder?: string; 
  value: string; 
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void; 
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; 
  autoCorrect?: boolean; 
}

const NameInput: FC<NameInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  autoCapitalize = 'words', // Par défaut, met en majuscule le début des mots
  autoCorrect = false, // Par défaut, désactive la correction automatique pour les noms
}) => {
  return (
    <View style={styles.container}>
      {/* Libellé du champ (ex: "Nom" ou "Prénom") */}
      <CustomText fontFamily="Medium" style={styles.label}>
        {label}
      </CustomText>
      {/* Le composant TextInput principal */}
      <TextInput
        placeholder={placeholder}
        keyboardType="default" // Clavier par défaut (alphanumérique)
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={"#aaa"} // Couleur du texte du placeholder
        autoCapitalize={autoCapitalize} // Gère la capitalisation (ex: majuscule au début de chaque mot)
        autoCorrect={autoCorrect} // Désactive la correction automatique (souvent préférable pour les noms propres)
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%', // Prend toute la largeur disponible
  },
  label: {
    fontSize: RFValue(12),
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Medium',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: RFValue(14),
    fontFamily: 'Medium',
    color: '#000', // Couleur du texte saisi par l'utilisateur
    backgroundColor: '#fff',
  },
});

export default NameInput;