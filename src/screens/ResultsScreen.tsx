import React from 'react';
import { View, Text, StyleSheet, Button, Dimensions, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserDataStore } from '../store/userDataStore';
import ImpactBreakdown from '../components/ImpactBreakdown';
import { useRequireAuth } from '../hooks/useRequireAuth';

type ResultsScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Résultats'>;

const { width } = Dimensions.get('window');

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { totalImpact, categoryDetails, resetAnswers, userInfo } = useUserDataStore();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* En-tête utilisateur */}
        <View style={styles.userInfoContainer}>
          {userInfo?.photoUri ? (
            <Image source={{ uri: userInfo.photoUri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {userInfo?.pseudo ? userInfo.pseudo[0].toUpperCase() : '?'}
              </Text>
            </View>
          )}
          <Text style={styles.pseudoText}>{userInfo?.pseudo ?? 'Utilisateur'}</Text>
        </View>

        {/* Résultat */}
        <Text style={styles.breakdownTitle}>
          Tu as émis <Text style={styles.strong}>{(totalImpact / 1000).toFixed(1)} Tonnes</Text> de
          Co₂ en 2024 d’après tes réponses
        </Text>
        <Text style={styles.comparisonText}>
          Pour info, la moyenne pour un·e français·e est d’environ 9 tonnes de CO₂/an.
        </Text>

        <ImpactBreakdown />

        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: '#10b981',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate('Challenge')}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Suivant</Text>
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
    padding: 20,
    backgroundColor: 'transparent',
  },
  card: {
    position: 'absolute',
    width: width * 0.9,
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555',
  },
  pseudoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  breakdownTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  strong: {
    color: 'darkred',
    fontWeight: 'bold',
  },
  comparisonText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  refineText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ResultsScreen;
