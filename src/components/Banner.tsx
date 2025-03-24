import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BannerProps {
  theme: 'light' | 'dark';
}

const Banner: React.FC<BannerProps> = ({ theme }) => {
  const bannerStyles = {
    light: {
      backgroundColor: '#61C6FF', // Couleur pour le thème clair
    },
    dark: {
      backgroundColor: '#1f1f1f', // Couleur pour le thème sombre
    },
  };

  return (
    <View style={[styles.container, bannerStyles[theme]]}>
      <Image
        source={require('../assets/images/ecobuddy_nametag_2.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    height: 110,
  },
});

export default Banner;
