import CustomText from "@/components/shared/CustomText";
import { roleStyles } from "@/styles/roleStyles";
import { router } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };

  const handleRiderPress = () => {
    router.navigate("/rider/auth");
  };

  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/seven.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily="bold" variant="h6">
        Choisissez votre type d'utilisateur
      </CustomText>

      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/seven-client.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Client</CustomText>
          <CustomText style={roleStyles.description}>
            Êtes-vous client ? Commandez des courses facilement.
          </CustomText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={roleStyles.card} onPress={handleRiderPress}>
        <Image
          source={require("@/assets/images/seven-conducteur.png")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Chauffeur</CustomText>
          <CustomText style={roleStyles.description}>
            Vous êtes chauffeur routier ? Rejoignez-nous pour conduire.
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;
