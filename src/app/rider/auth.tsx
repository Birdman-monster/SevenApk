import { useState } from "react";
import { SafeAreaView, ScrollView, View, Alert, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/shared/CustomButton";
import CustomText from "@/components/shared/CustomText";
import PhoneInput from "@/components/shared/PhoneInput";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";

const AuthRider = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  const handleNext = () => {
    if (!phone || phone.length !== 9) {
      Alert.alert("Entrez un numéro valide");
      return;
    }

    // 🚀 Redirige vers le formulaire de profil avec le numéro
    router.push({ pathname: "/rider/DriverProfileForm", params: { phone } });
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image source={require("@/assets/images/seven.png")} style={authStyles.logo} />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText fontFamily="Medium" variant="h7">Aide</CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Medium" variant="h6">Quel est ton numéro ?</CustomText>
        <CustomText variant="h7" fontFamily="Regular" style={commonStyles.lightText}>
          Entrez votre numéro de téléphone pour continuer
        </CustomText>

        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText variant="h8" fontFamily="Regular" style={commonStyles.lightText}>
          En continuant, vous acceptez les conditions et la politique de confidentialité.
        </CustomText>

        <CustomButton title="Suivant" onPress={handleNext} loading={false} disabled={false} />
      </View>
    </SafeAreaView>
  );
};

export default AuthRider;
