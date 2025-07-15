import CustomText from "@/components/shared/CustomText";
import { roleStyles } from "@/styles/roleStyles";
import { router } from "expo-router";
import React from "react";
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
        source={require("@/assets/images/logo.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily="Medium" variant="h6">
        Choisissez votre type d'utilisateur
      </CustomText>

      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.jpg")}
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
          source={require("@/assets/images/rider.jpg")}
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
