import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from "react-native";
import React, { FC } from "react";
import { useWS } from "@/service/WSProvider";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "../shared/CustomText";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { resetAndNavigate } from "@/utils/Helpers";
import { Phone } from "lucide-react-native";

type VehicleType = "sevenCity" | "sevenFlex" | "sevenVip";

interface RideItem {
  _id: string;
  vehicle?: VehicleType;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  otp?: string;
  rider: any;
  status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowGap}>
          {item.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles.rideIcon}
            />
          )}
          <View>
            <CustomText fontSize={10}>
              {item?.status === "START"
                ? "Chauffeur près de chez vous"
                : item?.status === "ARRIVED"
                ? "HAPPY JOURNEY"
                : "WOHOO 🎉"}
            </CustomText>

            <CustomText>
              {item?.status === "START" ? `OTP - ${item?.otp}` : "🕶️"}
            </CustomText>

            {/* === Nom & prénom du chauffeur === */}
            {item?.rider?.firstName && item?.rider?.lastName && (
              <CustomText fontSize={12} fontFamily="SemiBold" style={{ marginTop: 4 }}>
                {item.rider.firstName} {item.rider.lastName}
              </CustomText>
            )}

            {/* === Bouton téléphone cliquable === */}
            {item?.rider?.phone && (
              <TouchableOpacity
                style={styles.phoneButton}
                onPress={() => Linking.openURL(`tel:+237${item.rider.phone}`)}
              >
                <Phone size={16} color="#fff" style={{ marginRight: 6 }} />
                <CustomText style={styles.phoneText} fontSize={11} fontFamily="Medium">
                  +237 {item.rider.phone.slice(0, 5) + item.rider.phone.slice(5)}
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={{ padding: 10 }}>
        <CustomText fontFamily="SemiBold" fontSize={12}>
          Détails de l'emplacement
        </CustomText>

        <View style={[commonStyles.flexRowGap, { marginVertical: 15, width: "90%" }]}>
          <Image source={require("@/assets/icons/marker.png")} style={rideStyles.pinIcon} />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.pickup?.address}
          </CustomText>
        </View>

        <View style={[commonStyles.flexRowGap, { width: "90%" }]}>
          <Image source={require("@/assets/icons/drop_marker.png")} style={rideStyles.pinIcon} />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.drop?.address}
          </CustomText>
        </View>

        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons name="credit-card" size={24} color="black" />
              <CustomText style={{ marginLeft: 10 }} fontFamily="SemiBold" fontSize={12}>
                Payment
              </CustomText>
            </View>

            <CustomText fontFamily="SemiBold" fontSize={14}>
              {item.fare?.toFixed(2)} XAF 
            </CustomText>
          </View>

          <CustomText fontSize={10}>Payer en cash</CustomText>
        </View>
      </View>

      <View style={rideStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
          }}
        >
          <CustomText style={rideStyles.cancelButtonText}>Quitter</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles.backButton2}
          onPress={() => {
            if (item?.status === "COMPLETED") {
              resetAndNavigate("/customer/home");
              return;
            }
          }}
        >
          <CustomText style={rideStyles.backButtonText}>Back</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#228B22",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 25,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  phoneText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default LiveTrackingSheet;
