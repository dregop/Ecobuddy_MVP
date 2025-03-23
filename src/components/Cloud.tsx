import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface CloudProps {
  startDelay: number;
  top: number;
  size: number;
  image: any; // Image spécifique en fonction du thème
}

const Cloud: React.FC<CloudProps> = ({ startDelay, top, size, image }) => {
  const translateX = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: width,
          duration: 20000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -150,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => animation.start(), startDelay);
  }, []);

  return (
    <Animated.Image
      source={image}
      style={[
        styles.cloud,
        { top, width: size, height: size / 2, transform: [{ translateX }] },
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    opacity: 0.8,
  },
});

export default Cloud;
