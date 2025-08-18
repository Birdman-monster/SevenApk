// /rider/personalInfo.tsx
import React, { useState } from "react";
import { View, TextInput, Text, Button, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute } from "@react-navigation/native";


const PersonalInfoScreen = () => {

    const route = useRoute();
    const { phone } = route.params as { phone: string };

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [idFront, setIdFront] = useState<string | null>(null);
    const [idBack, setIdBack] = useState<string | null>(null);
    const [license, setLicense] = useState<string | null>(null);


    const pickImage = async (setImageFunc: React.Dispatch<React.SetStateAction<string | null>>) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageFunc(result.assets[0].uri);
        }
    };


    const handleSubmit = () => {
        // Envoie toutes les infos au back-end
        console.log({
            firstName,
            lastName,
            profilePhoto,
            idFront,
            idBack,
            license,
        });
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Nom</Text>
            <TextInput value={lastName} onChangeText={setLastName} style={{ borderWidth: 1, marginBottom: 10 }} />

            <Text>Prénom</Text>
            <TextInput value={firstName} onChangeText={setFirstName} style={{ borderWidth: 1, marginBottom: 10 }} />

            <Text>Photo de profil</Text>
            <Button title="Choisir une image" onPress={() => pickImage(setProfilePhoto)} />
            {profilePhoto && (
                <Image source={{ uri: profilePhoto }} style={{ width: 80, height: 80 }} />
            )}


            <Text>Carte d'identité - Recto</Text>
            <Button title="Uploader recto" onPress={() => pickImage(setIdFront)} />
            {idFront && <Image source={{ uri: idFront }} style={{ width: 80, height: 80 }} />}

            <Text>Carte d'identité - Verso</Text>
            <Button title="Uploader verso" onPress={() => pickImage(setIdBack)} />
            {idBack && <Image source={{ uri: idBack }} style={{ width: 80, height: 80 }} />}

            <Text>Permis de conduire</Text>
            <Button title="Uploader permis" onPress={() => pickImage(setLicense)} />
            {license && <Image source={{ uri: license }} style={{ width: 80, height: 80 }} />}

            <TouchableOpacity style={{ marginTop: 20, backgroundColor: "#007AFF", padding: 10 }} onPress={handleSubmit}>
                <Text style={{ color: "white", textAlign: "center" }}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PersonalInfoScreen;
