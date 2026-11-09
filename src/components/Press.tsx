import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle, Platform } from 'react-native';

const native = Platform.OS !== 'web';

/** Pressable with a springy scale-down, used for every tappable thing. */
export function Press({ style, children, disabled, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: native, speed: 40, bounciness: 6 }).start();
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={() => !disabled && to(0.92)}
      onPressOut={() => to(1)}
      hitSlop={8}
    >
      <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.35 : 1 }, style]}>{children}</Animated.View>
    </Pressable>
  );
}
