import { View, TouchableOpacity, Linking, StyleSheet } from "react-native";
import React, { FC } from "react";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import SwipeButton from "rn-swipe-button";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "../shared/CustomText";
import { orderStyles } from "@/styles/riderStyles";
import { RFValue } from "react-native-responsive-fontsize";
import { Phone } from "lucide-react-native";

const RiderActionButton: FC<{
  ride: any;
  color?: string;
  title: string;
  onPress: () => void;
}> = ({ ride, color = Colors.iosColor, title, onPress }) => {
  const CheckoutButton = () => (
    <Ionicons
      name="arrow-forward-sharp"
      style={{ bottom: 2 }}
      size={32}
      color="#fff"
    />
  );

  return (
    <View style={rideStyles?.swipeableContaninerRider}>
      {/* === Entête avec nom et numéro === */}
      <View style={commonStyles?.flexRowBetween}>
        <CustomText
          fontSize={11}
          style={{ marginTop: 20, marginBottom: 6 }}
          numberOfLines={1}
          fontFamily="Medium"
        >
          Rencontrez le client
        </CustomText>

        <View style={{ alignItems: "flex-start" }}>
          {/* === Nom et prénom du client === */}
          {ride?.customer?.firstName && ride?.customer?.lastName && (
            <CustomText
              fontSize={14} // ↑ augmente la taille
              style={{ marginBottom: 6 }}
              fontFamily="SemiBold" // ↑ gras
              numberOfLines={1}
            >
              {ride?.customer?.firstName} {ride?.customer?.lastName}
            </CustomText>
          )}

          {/* === Bouton téléphone === */}
          <TouchableOpacity
            style={styles.phoneButton}
            onPress={() => Linking.openURL(`tel:+237${ride?.customer?.phone}`)}
          >
            <Phone size={16} color="#fff" style={{ marginRight: 6 }} />
            <CustomText
              fontSize={11}
              style={styles.phoneText}
              numberOfLines={1}
              fontFamily="Medium"
            >
              +237{" "}
              {ride?.customer?.phone &&
                ride?.customer?.phone?.slice(0, 5) +
                ride?.customer?.phone?.slice(5)}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {/* === Pickup & Drop === */}
      <View style={orderStyles.locationsContainer}>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.pickupHollowCircle} />
            <View style={orderStyles.continuousLine} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontSize={11} numberOfLines={1} fontFamily="SemiBold">
              {ride?.pickup?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontSize={9.5}
              fontFamily="Medium"
              style={orderStyles.label}
            >
              {ride?.pickup?.address}
            </CustomText>
          </View>
        </View>

        <View style={orderStyles.flexRowBase}>
          <View style={orderStyles.dropHollowCircle} />
          <View style={orderStyles.infoText}>
            <CustomText fontSize={11} numberOfLines={1} fontFamily="SemiBold">
              {ride?.drop?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontSize={9.5}
              fontFamily="Medium"
              style={orderStyles.label}
            >
              {ride?.drop?.address}
            </CustomText>
          </View>
        </View>
      </View>

      {/* === Swipe Button === */}
      <SwipeButton
        containerStyles={rideStyles.swipeButtonContainer}
        height={30}
        shouldResetAfterSuccess={true}
        resetAfterSuccessAnimDelay={200}
        onSwipeSuccess={onPress}
        railBackgroundColor={color}
        railStyles={rideStyles.railStyles}
        railBorderColor="transparent"
        railFillBackgroundColor="rgba(255,255,255,0.6)"
        railFillBorderColor="rgba(255,255,255,0.6)"
        titleColor="#fff"
        titleFontSize={RFValue(13)}
        titleStyles={rideStyles.titleStyles}
        thumbIconComponent={CheckoutButton}
        thumbIconStyles={rideStyles.thumbIconStyles}
        title={title.toUpperCase()}
        thumbIconBackgroundColor="transparent"
        thumbIconBorderColor="transparent"
        thumbIconHeight={50}
        thumbIconWidth={60}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  phoneButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#228B22",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginTop: 0,
    marginBottom: 3,
  },
  phoneText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  
});

export default RiderActionButton;
