import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View, PanResponder, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../utils/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useUserAnswers } from '../context/UserAnswersContext';
import { calculateCarbonFootprint } from '../utils/calculateCarbon';
import { UserAnswers } from '../context/UserAnswersContext';

const { width } = Dimensions.get('window');

type QuestionnaireScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Questionnaire'>;

const questions = [
  { id: 1, question: 'Utilisez-vous principalement une voiture ?', field: 'transportMode', value: 'car', icon: require('../assets/images/car.png')},
  { id: 2, question: 'Parcourez-vous plus de 100 km par semaine ?', field: 'weeklyDistance', value: 150, icon: require('../assets/images/car.png') },
  { id: 3, question: 'Votre logement est-il de grande taille (> 90 m²) ?', field: 'homeSize', value: 100, icon: require('../assets/images/house.png') },
  { id: 4, question: 'Votre consommation d’énergie dépasse-t-elle 3000 kWh/an ?', field: 'energyConsumption', value: 3500, icon: require('../assets/images/house.png') },
  { id: 5, question: 'Consommez-vous régulièrement de la viande rouge ?', field: 'dietType', value: 'omnivore', icon: require('../assets/images/shopping.png') },
  { id: 6, question: 'Prenez-vous plus de 2 vols long-courriers par an ?', field: 'yearlyFlights', value: 4, icon: require('../assets/images/plane.png') },
  { id: 7, question: 'Ces vols sont-ils principalement longs (> 5000 km) ?', field: 'flightDistance', value: 'long', icon: require('../assets/images/plane.png') },
];

const QuestionnaireScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { answers, setAnswers } = useUserAnswers();
  const navigation = useNavigation<QuestionnaireScreenNavigationProp>();
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          handleSwipe('right');
        } else if (gesture.dx < -120) {
          handleSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const handleSwipe = (direction: string) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width : -width, y: 0 },
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 }); // Réinitialiser la position
  
      // Passe à la question suivante ou calcule les résultats
      setCurrentIndex((prevIndex) => {
        console.log('currentIndex :', prevIndex);
        const currentQuestion = questions[prevIndex];
        const nextIndex = prevIndex + 1;
  
        // Mettre à jour les réponses avec l'état précédent
        setAnswers((prevAnswers) => {
          const updatedAnswers = {
            ...prevAnswers,
            [currentQuestion.field]: direction === 'right' ? currentQuestion.value : answers[currentQuestion.field as keyof UserAnswers],
          };
  
          console.log('Updated answers:', updatedAnswers);
  
          // Si c'est la dernière question, calculer les résultats
          if (nextIndex >= questions.length) {
            const totalImpact = calculateCarbonFootprint(updatedAnswers);
            navigation.navigate('Résultats', { totalImpact });
          }
  
          return updatedAnswers;
        });
  
        // Avancer à la prochaine question si disponible
        return nextIndex < questions.length ? nextIndex : prevIndex;
      });
    });
  };
  

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  if (currentIndex >= questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Vous avez terminé le questionnaire !</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        key={questions[currentIndex].id}
        style={[
          styles.card,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              {
                rotate: position.x.interpolate({
                  inputRange: [-width / 2, width / 2],
                  outputRange: ['-10deg', '10deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={questions[currentIndex].icon} style={styles.icon} />
        <Text style={styles.question}>{questions[currentIndex].question}</Text>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/cross.png')} style={styles.cross} />
          <Image source={require('../assets/images/checked.png')} style={styles.checked} />
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
    backgroundColor: '#f4f4f4',
  },
  card: {
    position: 'absolute',
    width: width * 0.8,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
  }
});

export default QuestionnaireScreen;
