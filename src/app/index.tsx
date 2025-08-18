import CustomText from "@/components/shared/CustomText";
import { refresh_tokens } from "@/service/apiInterceptors";
import { logout } from "@/service/authService";
import { mmkvStorage } from "@/store/storage";
import { userStore } from "@/store/userStore";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { useFonts } from "expo-font";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Alert, Image, View } from "react-native";

interface DecodedToken {
  exp: number;
}

const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  });

  const { user } = userStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    const access_token = await mmkvStorage.getItem("access_token");
    const refresh_token = await mmkvStorage.getItem("refresh_token");

    // 👉 Si aucun token → rediriger vers le choix du rôle
    if (
      !access_token || typeof access_token !== "string" || access_token === "" ||
      !refresh_token || typeof refresh_token !== "string" || refresh_token === ""
    ) {
      console.log("❌ Aucun token. Redirection vers /role");
      logout();
      resetAndNavigate("/role");
      return;
    }

    try {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);
      const currentTime = Date.now() / 1000;

      // 👉 Token refresh expiré → retour au choix du rôle
      if (decodedRefreshToken?.exp < currentTime) {
        console.log("❌ Refresh token expiré");
        logout();
        Alert.alert("Session expirée", "Veuillez vous reconnecter.");
        resetAndNavigate("/role");
        return;
      }

      // 👉 Token d’accès expiré → essayer de rafraîchir
      if (decodedAccessToken?.exp < currentTime) {
        console.log("⚠️ Access token expiré, tentative de rafraîchissement...");
        try {
          await refresh_tokens();
          console.log("✅ Tokens rafraîchis avec succès");
        } catch (err) {
          console.error("❌ Échec du rafraîchissement :", err);
          logout();
          resetAndNavigate("/role");
          return;
        }
      }

      // 👉 Navigation selon le rôle
      if (user?.role === "customer") {
        resetAndNavigate("/customer/home");
      } else if (user?.role === "rider") {
        resetAndNavigate("/rider/home");
      } else {
        resetAndNavigate("/role"); // rôle non reconnu ou manquant
      }

    } catch (error) {
      console.error("❌ Erreur dans le décodage JWT :", error);
      Alert.alert("Erreur", "Session invalide. Veuillez vous reconnecter.");
      logout();
      resetAndNavigate("/role");
    }
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated, user]);

  if (!loaded) return null;

  return (
    <View style={commonStyles.container}>

      <Image
        source={require("@/assets/images/sevengif.gif")}
        style={splashStyles.img}
      />
      <CustomText variant="h5" fontFamily="Bold" style={splashStyles.text}>
       Un instant...
      </CustomText>
    </View>
  );
};

export default Main;

