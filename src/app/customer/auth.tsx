import CustomButton from "@/components/shared/CustomButton";
import CustomText from "@/components/shared/CustomText";
import PhoneInput from "@/components/shared/PhoneInput";
import TextField from "@/components/shared/TextField";
import { signin } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");

  // --- Nouveaux états pour le nom et le prénom ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  const handleNext = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Veuillez entrer votre prénom et nom");
      return;
    }

    if (!phone || phone.length !== 9) {
      Alert.alert("Entrez un numéro de téléphone valide (9 chiffres)");
      return;
      
    }

    signin({ role: "customer", phone, firstName, lastName }, updateAccessToken);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/seven.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText fontFamily="Medium" variant="h7">
              Aide
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Medium" variant="h6">
          Quel est ton numéro ?
        </CustomText>

        <CustomText
          variant="h7"
          fontFamily="Regular"
          style={commonStyles.lightText}
        >
          Entrez votre numéro de téléphone pour continuer
        </CustomText>

        <PhoneInput onChangeText={setPhone} value={phone} />
        <TextField
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
            error={lastName.trim() === "" ? "Nom requis" : ""}
        />

        <TextField
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
            error={lastName.trim() === "" ? "Prenom requis" : ""}
        />

      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Regular"
          style={
            commonStyles.lightText}
        >
          En continuant, vous acceptez les conditions et la politique de confidentialité.
        </CustomText>

        <CustomButton
          title="Suivant"
          onPress={handleNext}
          loading={false}
          disabled={false}

        />
      </View>
    </SafeAreaView>
  );
};




export default Auth;
