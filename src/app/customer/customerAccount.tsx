import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { userStore } from "@/store/userStore"; // si tu as un store utilisateur
import * as FileSystem from "expo-file-system";


const MonCompte = () => {
  const user = userStore((state) => state.user);
  const [imageUri, setImageUri] = useState<string | null>(null);


  // Récupère la photo enregistrée si elle existe
  useEffect(() => {
    (async () => {
      const savedImage = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + "profile-photo.txt"
      ).catch(() => null);
      if (savedImage) setImageUri(savedImage);
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission refusée", "Nous avons besoin de l’accès à la galerie.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      // Sauvegarde localement le chemin
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "profile-photo.txt",
        uri
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              typeof imageUri === "string" && imageUri.length > 0
                ? { uri: imageUri }
                : require("@/assets/icons/user-placeholder.png") // ✅ assure-toi que ce fichier existe
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.phone}>📞 {user?.phone}</Text>
        <TouchableOpacity onPress={pickImage} style={styles.editPhoto}>
          <Ionicons name="camera-outline" size={18} color="#007AFF" />
          <Text style={styles.editText}>Modifier la photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MonCompte;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    marginTop:19,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phone: {
    fontSize: 14,
    color: "#666",
  },
  editPhoto: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  editText: {
    marginLeft: 5,
    color: "#007AFF",
    fontSize: 14,
  },
});
