import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Cloud from './Cloud';

const { width, height } = Dimensions.get('window');

interface BackgroundProps {
  theme: 'light' | 'dark';
}

const Background: React.FC<BackgroundProps> = ({ theme }) => {
  const rotateEarth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateEarth, {
          toValue: 1,
          duration: 500000,
          easing: (t) => t,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();
  }, []);

  const rotateInterpolate = rotateEarth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const backgroundStyles = {
    light: {
      gradientColors: ['#FFFFFF', '#78DCE8'] as [string, string],
      earthImage: require('../assets/images/planet-earth-4.png'),
      cloudImage: require('../assets/images/cloud-2.png'),
    },
    dark: {
      gradientColors: ['#ff0000', '#ff6c00', '#25337a', '#1f1f1f'] as [string, string, string, string],
      earthImage: require('../assets/images/planet-earth-7.png'),
      cloudImage: require('../assets/images/cloud-with-lightning.png'),
    },
  };

  const { gradientColors, earthImage, cloudImage } = backgroundStyles[theme];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.1, 0.3, 1]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.mask}>
        <Animated.Image
          source={earthImage}
          style={[styles.backgroundImage, { transform: [{ rotate: rotateInterpolate }] }]}
          resizeMode="contain"
        />
      </View>
      <Cloud startDelay={0} top={600} size={120} image={cloudImage} />
      <Cloud startDelay={1000} top={650} size={100} image={cloudImage} />
      <Cloud startDelay={5000} top={550} size={150} image={cloudImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    height: 200,
    overflow: 'hidden',
  },
  backgroundImage: {
    height: 800,
    position: 'absolute',
    top: 0,
  },
});

export default Background;
