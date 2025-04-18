import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';
import { useRedirectIfAuthenticated } from '../hooks/useRedirectIfAuthenticated';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { refreshUser } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useRedirectIfAuthenticated();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Merci de remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      console.log('Connexion réussie');
      refreshUser();
    } catch (error) {
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Questionnaire', {})} style={styles.returnLink}>
            <Text style={styles.returnText}>← Inscription</Text>
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
    returnLink: {
    marginTop: 15,
    alignSelf: 'center',
    },
    returnText: {
    fontSize: 14,
    color: '#10b981',
    textDecorationLine: 'underline',
    },
});

export default LoginScreen;
