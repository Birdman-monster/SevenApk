import { riderStore } from "@/store/riderStore";
import { mmkvStorage } from "@/store/storage";
import { userStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const signin = async (
  payload: {
    role: "customer" | "rider";
    phone: string;
    firstName: string;
    lastName: string;

  },
  updateAccessToken: () => void
) => {
  const { setUser } = userStore.getState();
  const { setUser: setRiderUser } = riderStore.getState();

  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, payload);
    
    if (res.data.user.role === "customer") {
      setUser(res.data.user);
    } else {
      setRiderUser(res.data.user);
    }

    
    await mmkvStorage.setItem("access_token", res.data.access_token);
    await mmkvStorage.setItem("refresh_token", res.data.refresh_token);
    console.log("Tokens stockés avec succès après la connexion ! ✅");

    if (res.data.user.role === "customer") {
      resetAndNavigate("/customer/home");
    } else {
      resetAndNavigate("/rider/home");
    }

   
    updateAccessToken(); 
  } catch (error: any) {
    Alert.alert("Oups !", error?.response?.data?.msg || "Une erreur est survenue lors de la connexion.");
    console.error("Erreur de connexion : ", error?.response?.data?.msg || error.message);
  }
};

export const logout = async (disconnect?: () => void) => {
  if (disconnect) {
    disconnect(); 
  }
  const { clearData } = userStore.getState();
  const { clearRiderData } = riderStore.getState();


  try {
      await mmkvStorage.clearAll(); 
      console.log("Tout le stockage a été effacé via clearAll.");
  } catch (e) {
     
      console.warn("clearAll non disponible ou a échoué, suppression individuelle des tokens.");
      await mmkvStorage.removeItem("access_token");
      await mmkvStorage.removeItem("refresh_token");
  }


  clearRiderData(); 
  clearData();    
  
  console.log("Utilisateur déconnecté et données effacées. Redirection vers /role.");
  resetAndNavigate("/role");
};