import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';
import { useRedirectIfAuthenticated } from '../hooks/useRedirectIfAuthenticated';
import { useAuth } from '../context/AuthContext';
import { saveToken } from '../utils/tokenStorage';
import { getApiUrl } from '../utils/getApiUrl';

type LoginScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Login'>;
const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { refreshUser } = useAuth();
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
      const response = await fetch(`${getApiUrl()}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      if (!data.token) {
        throw new Error('Token manquant dans la réponse');
      }

      // 🔐 Enregistrer le token
      await saveToken(data.token);

      // 🔄 Charger l'utilisateur
      await refreshUser();

      console.log('Connexion réussie');
    } catch (error: any) {
      console.error('Erreur lors de la connexion :', error);
      Alert.alert('Erreur', error.message ?? 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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

        <TouchableOpacity
          onPress={() => navigation.navigate('Questionnaire', {})}
          style={styles.returnLink}
        >
          <Text style={styles.returnText}>← Inscription</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  card: {
    position: 'absolute',
    width: width * 0.8,
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    height: 45,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    width: '80%',
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
