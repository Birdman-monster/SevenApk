// storage.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

export const mmkvStorage = {
    // Méthodes existantes (setItem, getItem, removeItem)
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error(`Erreur lors du stockage de la clé "${key}" :`, e);
        }
    },

    getItem: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (e) {
            console.error(`Erreur lors de la récupération de la clé "${key}" :`, e);
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error(`Erreur lors de la suppression de la clé "${key}" :`, e);
        }
    },

    // 🌟 LA MODIFICATION NÉCESSAIRE : Ajout de la méthode clearAll
    clearAll: async () => {
        try {
            await AsyncStorage.clear(); // C'est la méthode native d'AsyncStorage
            console.log("Tout le stockage AsyncStorage a été effacé via mmkvStorage.clearAll().");
        } catch (e) {
            console.error("Erreur lors de l'effacement de tout le stockage AsyncStorage :", e);
            // Il est souvent bon de propager l'erreur ou de la gérer davantage si nécessaire
            throw e; 
        }
    }
};

// Fonctions utilitaires qui utilisent mmkvStorage
export const saveToken = async (token: string) => {
    await mmkvStorage.setItem('userToken', token);
};

export const getToken = async () => {
    return await mmkvStorage.getItem('userToken');
};

export const removeToken = async () => {
    await mmkvStorage.removeItem('userToken');
};

export const saveUserData = async (data: string) => {
    await mmkvStorage.setItem('userData', data);
};

export const getUserData = async () => {
    return await mmkvStorage.getItem('userData');
};