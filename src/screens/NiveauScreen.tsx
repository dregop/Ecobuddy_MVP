import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserDataStore } from '../store/userDataStore';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

const NiveauScreen = () => {
  const navigation = useNavigation();
  const { totalImpact, userInfo } = useUserDataStore();

  const progress = 0.33;

  const checklist = [
    { label: "Empreinte carbone < 8T/an", done: totalImpact < 8000 },
    { label: "Valider ton email", done: false },
    { label: "Ajouter un ami", done: false },
    { label: "Répondre à 0 / 2 questionnaires hébdomadaire ", done: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {userInfo?.pseudo ?? 'Utilisateur'}, ton niveau actuel :
      </Text>
      <Text style={styles.level}>Débutant</Text>
      <Ionicons name="rocket-outline" size={48} color="#999" style={{ marginBottom: 20 }} />

      <Progress.Bar progress={progress} width={250} color="#10b981" />
      <Text style={styles.progressLabel}>Objectif : Niveau Apprenti</Text>

      <View style={styles.checklist}>
        {checklist.map((item, index) => (
          <View key={index} style={styles.checklistItem}>
            <Ionicons
              name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
              size={20}
              color={item.done ? '#10b981' : '#aaa'}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.checklistText}>{item.label}</Text>
          </View>
        ))}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  level: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  progressLabel: { fontSize: 12, marginTop: 8, marginBottom: 20 },
  checklist: { width: '100%', marginTop: 10 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checklistText: { fontSize: 14 },
  button: {
    marginTop: 30,
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default NiveauScreen;
