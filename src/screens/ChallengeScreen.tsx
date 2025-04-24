import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserDataStore } from '../store/userDataStore';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useRequireAuth } from '../hooks/useRequireAuth';

const ChallengeScreen = () => {
  const navigation = useNavigation();
  const { totalImpact, userInfo } = useUserDataStore();

  const checklist = [
    { label: 'Empreinte Carbone Annuel < 8 Tonnes', done: totalImpact < 8000, category: 'info' },
    { label: 'Ajouter un ami', done: false, category: 'info' },
    { label: 'Répondre à 0 / 3 quizz journalier', done: false, category: 'quizz' },
    { label: 'Répondre à 0 / 2 quizz hebdo', done: false, category: 'quizz' },
    { label: "Passer l'examen !", done: false, category: 'quizz' },
  ];

  const completed = checklist.filter((item) => item.done).length;
  const progress = completed / checklist.length;

  return (
    <View style={styles.container}>
      {/* Barre de progression avec badges */}
      <View style={styles.progressRow}>
        <ImageBackground
          source={require('../assets/images/debutant.png')}
          style={styles.badge1}
          resizeMode="contain"
        />
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            height={25}
            borderRadius={25}
            color="#facc15"
            unfilledColor="#e5e7eb"
            borderWidth={0}
          />
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
        <ImageBackground
          source={require('../assets/images/apprenti.png')}
          style={styles.badge2}
          resizeMode="contain"
        />
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.levelLabel}>Débutant</Text>
        <Text style={styles.levelLabel}>Apprenti</Text>
      </View>

      {/* Liste des défis */}
      <View style={styles.checklist}>
        {checklist.map((item, index) => (
          <View
            key={index}
            style={[styles.checkItem, item.done ? styles.checkDone : styles.checkTodo]}
          >
            {item.done && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="#10b981"
                style={{ marginRight: 10 }}
              />
            )}
            <Text style={[styles.checkText, item.done && styles.textDone]}>{item.label}</Text>

            <Ionicons
              name="help-circle"
              size={24}
              color="#3b82f6" // bleu vif, attire l’œil
              style={{ marginLeft: 'auto' }}
              onPress={() => {
                if (item.category === 'quizz') {
                  // navigation.navigate('QuizzScreen', { from: item.label });
                } else {
                  Alert.alert('Information', `Voici quelques infos sur :\n${item.label}`, [
                    { text: 'OK', style: 'default' },
                  ]);
                }
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge1: { width: 100, height: 100 },
  badge2: { width: 60, height: 60 },
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
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  levelLabel: { fontSize: 14, color: '#4b5563', fontStyle: 'italic' },
  checklist: { gap: 12 },
  checkItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 12 },
  checkDone: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  checkTodo: { backgroundColor: 'rgba(201, 201, 201, 0.8)' },
  checkText: { fontSize: 14, color: '#111827' },
  textDone: { fontWeight: '500' },
});

export default ChallengeScreen;
