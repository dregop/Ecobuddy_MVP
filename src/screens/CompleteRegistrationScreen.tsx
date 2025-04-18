import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';

type CompleteRegistrationScreenNavigationProp = StackNavigationProp<AppStackParamList, 'CompleteRegistration'>;

const CompleteRegistrationScreen = () => {
  const navigation = useNavigation<CompleteRegistrationScreenNavigationProp>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<{ email: string; pseudo?: string } | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await fetch(`${process.env.API_URL}/me`, {
  //         credentials: 'include',
  //       });
  //       const data = await response.json();

  //       if (response.ok) {
  //         setUser(data.user);
  //       } else {
  //         console.warn('Utilisateur non authentifié');
  //         navigation.navigate('Login');
  //       }
  //     } catch (err) {
  //       console.error('Erreur lors de la récupération de l’utilisateur :', err);
  //     }
  //   };

  //   fetchUser();
  // }, []);


    const handleSubmit = async () => {
    if (!password || !confirmPassword) {
        Alert.alert('Erreur', 'Merci de remplir tous les champs.');
        return;
    }

    if (password !== confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
        return;
    }

    if (password.length < 6) {
      Alert.alert('Mot de passe trop court', 'Veuillez choisir un mot de passe d’au moins 6 caractères.');
      return;
    }

    setStatus('verifying');

    try {
        const response = await fetch(`${process.env.API_URL}/user/complete-registration`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
        setStatus('error');
        Alert.alert('Erreur', data.error || 'Erreur lors de l’activation du compte.');
        return;
        }

        setStatus('success');
        Alert.alert('Succès', 'Votre compte est activé !');
        navigation.navigate('Accueil');
    } catch (err) {
        console.error('Erreur réseau :', err);
        setStatus('error');
        Alert.alert('Erreur', 'Une erreur réseau est survenue.');
    }
};


  return (
    <View style={styles.container}>

      {/* {user && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            Vous êtes connecté en tant que :
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            {user.pseudo ?? user.email}
          </Text>
        </View>
      )} */}

      <Text style={styles.title}>Créer votre mot de passe</Text>

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={status === 'verifying'}>
        {status === 'verifying' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Valider</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CompleteRegistrationScreen;
