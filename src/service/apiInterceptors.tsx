import axios from "axios";
import { logout } from "./authService";
import { BASE_URL } from "./config";
// 🎯 MODIFICATION ICI : Importer mmkvStorage au lieu de tokenStorage
import { mmkvStorage } from "@/store/storage";
import { Alert } from "react-native"; // Import Alert pour les messages utilisateur

export const refresh_tokens = async () => {
  try {
    // 🎯 MODIFICATION ICI : Utiliser await mmkvStorage.getItem pour récupérer le token
    const refreshToken = await mmkvStorage.getItem("refresh_token");

    // Ajouter une vérification pour s'assurer que le refresh token existe
    if (!refreshToken || typeof refreshToken !== 'string' || refreshToken === '') {
      console.log("REFRESH TOKEN ERROR: Refresh token manquant ou invalide.");
      await mmkvStorage.removeItem("access_token"); // Nettoyer l'ancien access token
      await mmkvStorage.removeItem("refresh_token"); // Nettoyer l'ancien refresh token
      logout(); // Déconnecter l'utilisateur
      Alert.alert("Session expirée", "Veuillez vous reconnecter. (Refresh token manquant)");
      return null; // Retourner null car le rafraîchissement a échoué
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });

    const new_access_token = response.data.access_token;
    const new_refresh_token = response.data.refresh_token;

    // 🎯 MODIFICATION ICI : Utiliser await mmkvStorage.setItem pour stocker les nouveaux tokens
    await mmkvStorage.setItem("access_token", new_access_token);
    await mmkvStorage.setItem("refresh_token", new_refresh_token);
    
    return new_access_token;
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error); // Utiliser console.error pour les erreurs
    // 🎯 MODIFICATION ICI : Utiliser await mmkvStorage.removeItem ou clearAll
    await mmkvStorage.removeItem("access_token"); 
    await mmkvStorage.removeItem("refresh_token");
    // Ou si vous avez une méthode clearAll dans mmkvStorage
    // await mmkvStorage.clearAll(); 
    logout(); // S'assurer que la déconnexion est appelée
    Alert.alert("Session expirée", "Veuillez vous reconnecter. (Erreur de rafraîchissement)");
    return null; // Retourner null en cas d'échec
  }
};

export const appAxios = axios.create({
  baseURL: BASE_URL,
});

appAxios.interceptors.request.use(async (config) => {
  // 🎯 MODIFICATION ICI : Utiliser await mmkvStorage.getItem pour récupérer le token
  const accessToken = await mmkvStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Vérifier si c'est une erreur 401 et si la requête n'a pas déjà été retentée
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marquer la requête comme retentée
      try {
        const newAccessToken = await refresh_tokens(); // Tenter de rafraîchir le token
        if (newAccessToken) {
          // Si un nouveau token est obtenu, mettre à jour l'en-tête et rejouer la requête
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return appAxios(originalRequest); // Utiliser appAxios pour rejouer avec les intercepteurs
        }
      } catch (refreshError) {
        // Gérer les erreurs si le rafraîchissement échoue (déjà géré dans refresh_tokens, mais bon de le log ici)
        console.error("Erreur lors du re-tentative de rafraîchissement après 401:", refreshError);
        // Si refresh_tokens a déjà appelé logout, il n'y a rien de plus à faire ici.
      }
    }
    // Si ce n'est pas une 401 ou si le rafraîchissement a échoué, rejeter l'erreur
    return Promise.reject(error);
  }
);