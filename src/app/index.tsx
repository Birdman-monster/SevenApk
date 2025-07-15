import CustomText from "@/components/shared/CustomText";
import { refresh_tokens } from "@/service/apiInterceptors";
import { logout } from "@/service/authService";
import { mmkvStorage } from "@/store/storage"; // Assurez-vous que c'est bien l'implémentation AsyncStorage
import { userStore } from "@/store/userStore";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import { resetAndNavigate } from "@/utils/Helpers";
import { useFonts } from "expo-font";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
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

  // La fonction tokenCheck doit être asynchrone
  const tokenCheck = async () => {
    // 1. Récupérer les tokens de manière asynchrone avec getItem
    const access_token = await mmkvStorage.getItem("access_token");
    const refresh_token = await mmkvStorage.getItem("refresh_token");

    // 2. Vérifier si les tokens sont présents ET sont des chaînes valides
    if (!access_token || typeof access_token !== 'string' || access_token === '' ||
      !refresh_token || typeof refresh_token !== 'string' || refresh_token === '') {

      console.log("Tokens d'accès ou de rafraîchissement manquants ou invalides. Redirection vers l'authentification.");
      logout(); // Nettoyer toute session potentiellement corrompue
      resetAndNavigate("/"); // Redirige l'utilisateur vers la page de connexion ou d'accueil
      return; // Arrête l'exécution de la fonction
    }

    // 3. Tenter de décoder les tokens dans un bloc try-catch
    try {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      // 4. Logique de vérification d'expiration du Refresh Token
      if (decodedRefreshToken?.exp < currentTime) {
        console.log("Refresh token expiré. Déconnexion et redirection.");
        logout();
        Alert.alert("Session expirée", "Veuillez vous reconnecter.");
        resetAndNavigate("/");
        return;
      }

      // 5. Logique de vérification d'expiration de l'Access Token
      if (decodedAccessToken?.exp < currentTime) {
        console.log("Access token expiré. Tentative de rafraîchissement.");
        try {
          await refresh_tokens(); // Assurez-vous que refresh_tokens est aussi async
          console.log("Tokens rafraîchis avec succès.");
        } catch (err) {
          console.error("Échec du rafraîchissement des tokens:", err); // Utiliser console.error
          Alert.alert("Erreur de rafraîchissement", "Impossible de rafraîchir le token. Veuillez vous reconnecter.");
          logout();
          resetAndNavigate("/");
          return;
        }
      }

      // 6. Navigation finale si tout est bon
      if (user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/rider/home");
      }

    } catch (decodeError) {
      // 7. Gérer les erreurs si un token est malformé ou non décodable
      console.error("Erreur de décodage JWT (token malformé ou invalide):", decodeError);
      Alert.alert("Token invalide", "Un token de session est corrompu. Veuillez vous reconnecter.");
      logout();
      resetAndNavigate("/");
    }
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck(); // Appeler la fonction asynchrone
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated, user]); 

 
  if (!loaded) {
    return null; 
  }

  return (
    <View style={commonStyles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={splashStyles.img}
      />
      <CustomText variant="h5" fontFamily="Medium" style={splashStyles.text}>
        TheSeven notre vision votre confort...
      </CustomText>
    </View>
  );
};

export default Main;

