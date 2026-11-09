import React, { useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View, Platform } from 'react-native';
import { Press } from './Press';
import { colors, fonts } from '../theme';
import { counts, useStore } from '../store';
import { play } from '../sound';
import * as Haptics from 'expo-haptics';

const native = Platform.OS !== 'web';

/** Pop-in glyph that flashes over an icon. */
export function useFlash() {
  const v = useRef(new Animated.Value(0)).current;
  const fire = () => {
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 650, useNativeDriver: native }).start();
  };
  const style = {
    opacity: v.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 1, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1.7] }) }],
  };
  return { fire, style };
}

function Role({ icon, glyph, color, label, sound }: { icon: any; glyph: string; color: string; label: string; sound: Parameters<typeof play>[0] }) {
  const flash = useFlash();
  const haptics = useStore((s) => s.haptics);
  return (
    <Press
      style={styles.role}
      onPress={() => {
        play(sound);
        flash.fire();
        if (haptics) Haptics.selectionAsync().catch(() => {});
      }}
    >
      <View>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Animated.Text pointerEvents="none" style={[styles.glyph, { color, textShadowColor: color }, flash.style]}>{glyph}</Animated.Text>
      </View>
      <Text style={[styles.count, { color, textShadowColor: color }]}>{label}</Text>
    </Press>
  );
}

export function Roles() {
  const players = useStore((s) => s.playerCount);
  const travelers = useStore((s) => s.travelerCount);
  const [t, o, m, d] = counts(players);
  return (
    <View style={styles.row}>
      <Role icon={require('../../assets/images/townsfolk.png')} glyph="✦" color={colors.blue} label={`${t} / ${o}`} sound="win" />
      <Role icon={require('../../assets/images/evil.png')} glyph="⚡" color={colors.evil} label={`${m} / ${d}`} sound="ambience" />
      <Role icon={require('../../assets/images/travelors.png')} glyph="✨" color={colors.traveler} label={`${travelers}`} sound="accept" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 22 },
  role: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { width: 38, height: 38 },
  glyph: { position: 'absolute', left: 0, right: 0, top: 2, textAlign: 'center', fontSize: 30, textShadowRadius: 12, textShadowOffset: { width: 0, height: 0 } },
  count: { fontFamily: fonts.title, fontSize: 28, textShadowRadius: 6, textShadowOffset: { width: 0, height: 0 } },
});
