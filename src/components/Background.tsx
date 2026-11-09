import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Phase } from '../logic';
import { useStore } from '../store';

const imgs: Record<Phase, any> = {
  DAY: require('../../assets/images/bg-day.jpg'),
  ENDOFDAY: require('../../assets/images/bg-end-of-day.jpg'),
  NIGHT: require('../../assets/images/bg-night.jpg'),
};
const order: Phase[] = ['DAY', 'ENDOFDAY', 'NIGHT'];

export function Background() {
  const phase = useStore((s) => s.phase);
  const vals = useRef(order.map((p) => new Animated.Value(p === phase ? 1 : 0))).current;
  useEffect(() => {
    order.forEach((p, i) =>
      Animated.timing(vals[i], { toValue: p === phase ? 1 : 0, duration: 2000, useNativeDriver: Platform.OS !== 'web' }).start(),
    );
  }, [phase, vals]);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {order.map((p, i) => (
        <Animated.Image key={p} source={imgs[p]} resizeMode="cover" style={[StyleSheet.absoluteFill, { opacity: vals[i], width: '100%', height: '100%' }]} />
      ))}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
    </View>
  );
}
