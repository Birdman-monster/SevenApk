import { Platform } from "react-native";

// Adresse IP locale de ton PC (trouvée avec `ipconfig` dans le terminal)
const LOCAL_IP = "http://192.168.1.24:3000"; // ← remplace par ton IP réelle si besoin

// Configuration des URLs selon la plateforme
export const BASE_URL =
  Platform.OS === "android"
    ? "http://192.168.1.24:3000"// pour les émulateurs Android
    : LOCAL_IP;              // pour iOS ou téléphone réel

// Socket.io utilise la même URL que BASE_URL
export const SOCKET_URL = BASE_URL;