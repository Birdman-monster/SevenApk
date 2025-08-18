import { View, Text, TouchableOpacity, Image, Modal, Platform, Linking } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { uiStyles } from "@/styles/uiStyles";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { userStore } from "@/store/userStore"; // <- à adapter à ton store réel
import { router } from "expo-router";


const cubes = [
  { name: "Seven City", imageUri: require("@/assets/icons/cab.png") },
  { name: "Seven Flex", imageUri: require("@/assets/icons/seven-flex.png") },
  { name: "Seven VIP", imageUri: require("@/assets/icons/seven-vip.png") },
];

const SheetContent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const user = userStore((state) => state.user); // <- récupère les infos du store

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <View style={{ height: "100%" }}>
      {/* 🟢 Barre de recherche */}
      <TouchableOpacity
        style={uiStyles.searchBarContainer}
        onPress={() => router.navigate("/customer/selectlocations")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="black" />
        <CustomText fontFamily="Medium" fontSize={11}>
          Où allez-vous ?
        </CustomText>
      </TouchableOpacity>

      {/* 🟢 Titre + bouton "Mon compte" */}
      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily="Medium" fontSize={11}>
          Nos courses
        </CustomText>

        <TouchableOpacity
          style={commonStyles.flexRow}
          onPress={() => setModalVisible(true)} // ✅ Ouvre la modale au lieu de router
        >
          <CustomText fontFamily="Regular" fontSize={10}>
            Mon profil
          </CustomText>
          <Ionicons name="chevron-forward" size={RFValue(14)} color="black" />
        </TouchableOpacity>
      </View>

      {/* 🟢 Grille de services */}
      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            style={uiStyles.cubeContainer}
            key={index}
            onPress={() => router.navigate("/customer/selectlocations")}
          >
            <View style={uiStyles.cubeIconContainer}>
              <Image source={item?.imageUri} style={uiStyles.cubeIcon} />
            </View>
            <CustomText
              fontFamily="Medium"
              fontSize={9.5}
              style={{ textAlign: "center" }}
            >
              {item?.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* 🟡 MODALE DU PROFIL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: "flex-end" }}
            >
              <Ionicons name="close-outline" size={28} color="#000" />
            </TouchableOpacity>

            <Image
              source={
                user.avatar
                  ? user.avatar
                  : require("@/assets/icons/user-placeholder.png")
              }
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 10,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={{ fontSize: 14, color: "#666" }}>{user.phone}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SheetContent;
