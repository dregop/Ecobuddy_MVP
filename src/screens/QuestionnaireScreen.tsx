import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, PanResponder, Dimensions, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppStackParamList, Results } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserAnswers } from '../context/UserAnswersContext';
import { calculateCarbonFootprint } from '../utils/calculateCarbon';
import { UserAnswers } from '../context/UserAnswersContext';

// Obtient la largeur de l'écran, utilisée pour les calculs de swipe
const { width } = Dimensions.get('window');

// Typage pour la navigation
type QuestionnaireScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;
type QuestionnaireScreenRouteProp = RouteProp<AppStackParamList, 'Questionnaire'>;

// Liste des questions avec leurs propriétés (question, champ, valeur, icône associée)
const firstQuestions = [
  { id: 1, question: 'Utilisez-vous principalement une voiture ?', field: 'transportMode', value: 'car', icon: require('../assets/images/car.png') },
  { id: 2, question: 'Parcourez-vous plus de 100 km par semaine ?', field: 'weeklyDistance', value: 150, icon: require('../assets/images/car.png') },
  { id: 3, question: 'Votre logement est-il de grande taille (> 90 m²) ?', field: 'homeSize', value: 100, icon: require('../assets/images/house.png') },
  { id: 4, question: 'Votre consommation d’énergie dépasse-t-elle 3000 kWh/an ?', field: 'energyConsumption', value: 3500, icon: require('../assets/images/house.png') },
  { id: 5, question: 'Consommez-vous régulièrement de la viande rouge ?', field: 'dietType', value: 'omnivore', icon: require('../assets/images/shopping.png') },
  { id: 6, question: 'Prenez-vous plus de 2 vols long-courriers par an ?', field: 'yearlyFlights', value: 4, icon: require('../assets/images/plane.png') },
  { id: 7, question: 'Ces vols sont-ils principalement longs (> 5000 km) ?', field: 'flightDistance', value: 'long', icon: require('../assets/images/plane.png') },
  { id: 8, question: 'Achetez-vous plus de 10 vétements neuf par mois ?', field: 'clothingPurchases', value: 600, icon: require('../assets/images/shopping.png') },
  { id: 9, question: 'Changer vous de téléphones tous les 2 ans plus ou moins ?', field: 'electronicsPurchases', value: 400, icon: require('../assets/images/shopping.png') },

];

const QuestionnaireScreen = () => {
  const route = useRoute<QuestionnaireScreenRouteProp>();
  let questions: any = route.params ? route.params.questions : firstQuestions; // Récupération des paramètres

  console.log(questions);

  // Stocke l'index de la question actuelle
  const [currentIndex, setCurrentIndex] = useState(0);

  // Accède au contexte des réponses utilisateur
  const { answers, setAnswers } = useUserAnswers();

  // Utilise la navigation pour passer à l'écran des résultats
  const navigation = useNavigation<QuestionnaireScreenNavigationProp>();

  // Gère la position de la carte (pour les animations de swipe)
  const position = useRef(new Animated.ValueXY()).current;

  // Interpole la couleur de fond de la carte en fonction de la direction du swipe
  const backgroundColor = position.x.interpolate({
    inputRange: [-width / 2 - 120, 0, width / 2 + 120], // Plage de positions
    outputRange: ['rgba(255, 0, 0, 0.4)', 'rgb(234, 234, 234)', 'rgba(0, 255, 0, 0.4)'], // Couleurs associées (rouge -> blanc -> vert)
    extrapolate: 'clamp', // Évite que les valeurs dépassent la plage définie
  });

  // Configure le swipe avec PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20, // Déclenche le swipe si le mouvement horizontal dépasse 20 pixels
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }], // Met à jour la position pendant le swipe
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          handleSwipe('right'); // Swipe vers la droite
        } else if (gesture.dx < -120) {
          handleSwipe('left'); // Swipe vers la gauche
        } else {
          resetPosition(); // Réinitialise si le swipe est trop court
        }
      },
    })
  ).current;

  // Gère le swipe gauche ou droit
  const handleSwipe = (direction: string) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 }, // Anime la carte hors de l'écran
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 }); // Réinitialise la position

      // Passe à la question suivante ou calcule les résultats
      setCurrentIndex((prevIndex) => {
        const currentQuestion = questions[prevIndex];
        const nextIndex = prevIndex + 1;

        // Met à jour les réponses utilisateur
        setAnswers((prevAnswers) => {
          const updatedAnswers = {
            ...prevAnswers,
            [currentQuestion.field]: direction === 'right' ? currentQuestion.value : answers[currentQuestion.field as keyof UserAnswers], // Met la réponse selon le swipe
          };

          // Si c'est la dernière question, calcule l'empreinte carbone
          if (nextIndex >= questions.length) {
            const footprint: Results = calculateCarbonFootprint(updatedAnswers);
            navigation.navigate('Résultats', {
              totalImpact: footprint.totalImpact,
              categoryDetails: footprint.categoryDetails,
            });
          }

          return updatedAnswers; // Retourne les réponses mises à jour
        });

        return nextIndex < questions.length ? nextIndex : prevIndex; // Passe à la prochaine question
      });
    });
  };

  // Réinitialise la position de la carte si le swipe est annulé
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  // Affiche un écran de fin si toutes les questions ont été répondues
  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Vous avez terminé le questionnaire !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Questions : {currentIndex + 1} / {questions.length} {/* Affiche le numéro de la question */}
        </Text>
      </View>

      {/* Carte animée de la question */}
      <Animated.View
        key={questions[currentIndex].id}
        style={[
          styles.card,
          {
            backgroundColor, // Couleur interpolée en fonction du swipe
            transform: [
              { translateX: position.x }, // Position X
              { translateY: position.y }, // Position Y
              {
                rotate: position.x.interpolate({
                  inputRange: [-width / 2, width / 2],
                  outputRange: ['-10deg', '10deg'], // Rotation selon la position
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers} // Ajoute les gestuelles au composant
      >
        {/* Icône associée à la question */}
        <Image source={questions[currentIndex].icon} style={styles.icon} />
        {/* Texte de la question */}
        <Text style={styles.question}>{questions[currentIndex].question}</Text>
        {/* Boutons de swipe manuel */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => handleSwipe('left')}>
            <Image source={require('../assets/images/cross.png')} style={styles.cross} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSwipe('right')}>
            <Image source={require('../assets/images/checked.png')} style={styles.checked} />
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'absolute',
    bottom: 20, 
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  cross: {
    width: 40,
    height: 40,
    left:0,
  },
  checked: {
    width: 30,
    height: 30,
    right:0,
  },
  progressContainer: {
    position: 'absolute',
    top: 10, // Place le compteur en haut de l'écran
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default QuestionnaireScreen;
