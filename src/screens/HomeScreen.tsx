import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';
import * as Progress from 'react-native-progress';
import ImpactBreakdown from '../components/ImpactBreakdown';
import DateRangeCard from '../components/DateRangeCard';
import CarbonSummaryCard from '../components/CarbonSummaryCard';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useUserDataStore } from '../store/userDataStore';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { getApiUrl } from '../utils/getApiUrl';

type NavigationProp = StackNavigationProp<AppStackParamList>;
type HomeScreenRouteProp = RouteProp<AppStackParamList, 'Accueil'>;

const HomeScreen = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { isLoggedIn } = useRequireAuth();
  const screenWidth = Dimensions.get('window').width;

  const userInfo = useUserDataStore((state) => state.userInfo);
  const fetchImpact = useUserDataStore((state) => state.fetchImpactFromBackend);
  const totalImpact = useUserDataStore((state) => state.totalImpact);

  const askQuestionToChatGpt = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: "Quels sont les impacts du changement climatique sur la biodiversité ?"
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Réponse de ChatGPT:', data);
      // Optionnel : afficher la réponse dans un Toast ou une alerte
      // Alert.alert('Réponse', data.answer || JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de l’appel à /ask :', error);
    }
  };
  

  // Fetch l'impact utilisateur quand userInfo.id est dispo
  useEffect(() => {
    if (userInfo?.id) {
      fetchImpact(userInfo.id);
    }
  }, [userInfo?.id]);

  if (!isLoggedIn) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBadge}>
        <ImageBackground
          source={require('../assets/images/debutant.png')}
          style={styles.badgeImage}
          resizeMode="contain"
        />
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={0.33}
            width={screenWidth * 0.8}
            height={15}
            borderRadius={25}
            color="#facc15"
            unfilledColor="#e5e7eb"
            borderWidth={0}
          />
          <Text style={styles.progressText}>{Math.round(0.33 * 100)}%</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', padding: 16 }}>
        <DateRangeCard year={2024} range="Janvier à Déc" />
        <CarbonSummaryCard
          totalTons={Number((totalImpact / 1000).toFixed(1))}
          flights={2}
          kilometers={9000}
        />
      </View>

      <ImpactBreakdown />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => navigation.navigate('Questionnaire', { type: 'day' })}
        >
          <Ionicons name="leaf-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Faire son quizz journalier</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quizButton} onPress={() => navigation.navigate('Chat')}>
  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
  <Text style={styles.buttonText}>Discuter avec l’expert climat</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  topBadge: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeImage: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 12,
    paddingHorizontal: 20,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
