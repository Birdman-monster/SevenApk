import { useState } from "react";
import { SafeAreaView, ScrollView, View, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "@/components/shared/CustomButton";
import CustomText from "@/components/shared/CustomText";
import { authStyles } from "@/styles/authStyles";
import TextField from "@/components/shared/TextField";
import { signin } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { BASE_URL } from "@/service/config";

const DriverProfileForm = () => {
  const router = useRouter();
  const { phone: rawPhone } = useLocalSearchParams();
  const phone = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone; // ✅ conversion string | string[] -> string

  const { updateAccessToken } = useWS();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cni, setCni] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");

  const handleRegisterDriver = async () => {
    if (!firstName || !lastName || !cni || !drivingLicense) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      // 1️⃣ Création du compte chauffeur côté backend
      await axios.post(`${BASE_URL}/auth/signin`, {
        phone,
        role: "rider",
        firstName,
        lastName,
        cni,
        drivingLicense,
      });

      // 2️⃣ Authentification après avoir rempli le profil
      await signin({ role: "rider", phone, firstName, lastName }, updateAccessToken);

      Alert.alert("Succès", "Compte chauffeur créé !");
      router.replace("/rider/home"); 
    } catch (error: any) {
      let message = "Impossible de créer le compte";

      if (error?.response?.data) {
        message = error.response.data.message || JSON.stringify(error.response.data);
      } else if (error?.message) {
        message = error.message;
      }

      console.error("Erreur:", message);
      Alert.alert("Erreur", message);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <CustomText fontFamily="Medium" variant="h6">
          Crée ton profil chauffeur 🚖
        </CustomText>

        <TextField placeholder="Prénom" value={firstName} onChangeText={setFirstName} label="" />
        <TextField placeholder="Nom" value={lastName} onChangeText={setLastName} label="" />
        <TextField placeholder="Numéro CNI" value={cni} onChangeText={setCni} label="" />
        <TextField placeholder="Numéro de permis" value={drivingLicense} onChangeText={setDrivingLicense} label="" />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomButton title="Créer mon compte chauffeur" onPress={handleRegisterDriver} />
      </View>
    </SafeAreaView>
  );
};

export default DriverProfileForm;
