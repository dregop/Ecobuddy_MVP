import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../utils/types';

type NavigationProp = StackNavigationProp<AppStackParamList>;

const Menu = () => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Accueil')}>
                <Image
                    source={require('../assets/images/avatar.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    bottom: 0,
    flexDirection: "row", // Aligner les éléments horizontalement
    justifyContent: "space-evenly", // Espacement égal entre les éléments
    width: "100%",
  },
  button: {
    width: 50,
    height: 50, // Taille du bouton
    justifyContent: 'center', // Centrer l'image verticalement
    alignItems: 'center', // Centrer l'image horizontalement
    borderRadius: 50, // Bordures arrondies pour le bouton (facultatif)
    margin: "10%",
    borderWidth: 1,
    backgroundColor: '#D9D9D9',
    borderColor: '#767676',
    boxShadow: '4px 8px 15px rgba(0, 0, 0, 0.5)',
  },
  image: {
    height: 50,
    width: 50,

  },
});

export default Menu;

