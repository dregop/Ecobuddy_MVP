// components/QuestionnaireLayout.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QuestionCard from './QuestionCard';

export const QuestionnaireLayout = ({
  question,
  questionIndex,
  totalQuestions,
  position,
  panHandlers,
  onSwipeLeft,
  onSwipeRight,
  isLoggedIn,
  onLoginPress,
}: {
  question: any;
  questionIndex: number;
  totalQuestions: number;
  position: any;
  panHandlers: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isLoggedIn?: boolean;
  onLoginPress?: () => void;
}) => (
  <View style={styles.container}>
    <View style={styles.progressContainer}>
      <Text style={styles.progressText}>
        Question : {questionIndex + 1} / {totalQuestions}
      </Text>
    </View>

    <QuestionCard
      question={question}
      position={position}
      panHandlers={panHandlers}
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
    />

    {!isLoggedIn && onLoginPress && (
      <TouchableOpacity onPress={onLoginPress} style={styles.returnLink}>
        <Text style={styles.returnText}>← Connexion</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  progressContainer: {
    position: 'absolute',
    top: 10,
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  returnLink: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  returnText: {
    fontSize: 20,
    color: '#FFF',
    textDecorationLine: 'underline',
  },
});
