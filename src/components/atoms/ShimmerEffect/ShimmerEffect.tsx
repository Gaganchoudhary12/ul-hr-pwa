import React, { useEffect, useRef, ReactNode } from 'react';
import { View, Animated, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ShimmerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ShimmerEffect: React.FC<ShimmerProps> = ({ children, style }) => {
  const translateX = useRef(new Animated.Value(-600)).current;

  const startShimmer = () => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 600,
        duration: 2000,
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  };

  useEffect(() => {
    startShimmer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.shimmerContainer}>
      <Animated.View
        style={[
          styles.ShimmerEffect,
          {
            transform: [{ translateX }],
          },
        ]}
      />
      <View style={[style, styles.child]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  ShimmerEffect: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.4,
    zIndex: 1,
  },
  child: {
    position: 'relative',
  },
});

export default ShimmerEffect;