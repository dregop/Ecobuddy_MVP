import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';
import { useUserDataStore } from '../store/userDataStore';

type UserInfoScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UserInfo'>;

const UserInfoScreen = () => {
  const navigation = useNavigation<UserInfoScreenNavigationProp>();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { answers, totalImpact, categoryDetails, setUserInfo } = useUserDataStore.getState();

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission d'accéder à la caméra refusée");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!pseudo || !email) {
      alert('Merci de donner un pseudo et un email.');
      return;
    }

    try {
      const baseUrl = process.env.API_URL?.replace(/\/$/, '')
      const response = await fetch(`${baseUrl}/user/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          pseudo,
          answers,
          totalImpact,
          categoryDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setUserInfo({ pseudo, email, age: Number(age), photoUri });

      alert('Un email t’a été envoyé pour finaliser ton inscription.');

      // Redirection vers un écran d’attente ou vers les résultats
      navigation.navigate('Résultats');
    } catch (error: any) {
      console.error('Invite error:', error.message);
      alert('Erreur lors de l’invitation : ' + error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renseigne tes informations</Text>

      <TouchableOpacity onPress={handleImagePick}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text>Prendre une photo (optionnel)</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Pseudo"
        value={pseudo}
        onChangeText={setPseudo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Âge"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Button title="Valider et voir mes résultats" onPress={handleSubmit} disabled={!pseudo || !email || !age} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10, borderRadius: 5,
  },
  photo: { width: 100, height: 100, borderRadius: 50, marginBottom: 20, alignSelf: 'center' },
  photoPlaceholder: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20,
  },
});

export default UserInfoScreen;
