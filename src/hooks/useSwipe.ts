// /src/hooks/useSwipe.ts
import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const useSwipe = (onSwipe: (direction: 'left' | 'right') => void) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) onSwipe('right');
        else if (gesture.dx < -120) onSwipe('left');
        else resetPosition();
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  return { position, panResponder, resetPosition };
};
