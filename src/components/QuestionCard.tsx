import React from 'react';
import { Animated, Image, Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Question } from '../utils/types';

const { width } = Dimensions.get('window');

interface QuestionCardProps {
  question: Question;
  position: any;
  panHandlers: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, position, panHandlers, onSwipeLeft, onSwipeRight }) => {
  return (
    <Animated.View
      style={[styles.card, {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate: position.x.interpolate({
              inputRange: [-width / 2, width / 2],
              outputRange: ['-10deg', '10deg'],
              extrapolate: 'clamp',
            }),
          },
        ],
      }]}
      {...panHandlers}
    >
      <Image source={question.icon} style={styles.icon} />
      <Text style={styles.question}>{question.question}</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={onSwipeLeft}>
          <Image source={require('../assets/images/cross.png')} style={styles.cross} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwipeRight}>
          <Image source={require('../assets/images/checked.png')} style={styles.checked} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});

export default QuestionCard;
