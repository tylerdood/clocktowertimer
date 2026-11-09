import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Press } from './Press';
import { useFlash } from './Roles';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { useT } from '../i18n';

function Tracker({ icon, value, glyph, glow, onMinus, onPlus, minusLabel, plusLabel }: { icon: any; value: number; glyph: string; glow: string; onMinus: () => void; onPlus: () => void; minusLabel: string; plusLabel: string }) {
  const flash = useFlash();
  return (
    <View style={styles.col}>
      <Press onPress={() => { if (value > 0) { flash.fire(); onMinus(); } }} style={[styles.ring, { borderColor: colors.gold }]} accessibilityLabel={minusLabel}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Animated.Text pointerEvents="none" style={[styles.glyph, { color: glow, textShadowColor: glow }, flash.style]}>{glyph}</Animated.Text>
      </Press>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Press onPress={onPlus} style={styles.plus} accessibilityLabel={plusLabel}>
          <FontAwesome5 name="plus" size={14} color="#111" />
        </Press>
      </View>
    </View>
  );
}

export function Trackers() {
  const t = useT();
  const hearts = useStore((s) => s.hearts);
  const votes = useStore((s) => s.votes);
  const h = useStore((s) => s.hearts_);
  const v = useStore((s) => s.votes_);
  return (
    <View style={styles.row}>
      <Tracker icon={require('../../assets/images/heart.png')} value={hearts} glyph="✕" glow="#ef4444" onMinus={() => h(-1)} onPlus={() => h(1)} minusLabel={t('btn-alive-minus')} plusLabel={t('btn-alive-plus')} />
      <Tracker icon={require('../../assets/images/box.png')} value={votes} glyph="✓" glow="#4ade80" onMinus={() => v(-1)} onPlus={() => v(1)} minusLabel={t('btn-vote-minus')} plusLabel={t('btn-vote-plus')} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 56 },
  col: { alignItems: 'center', gap: 6 },
  ring: { width: 84, height: 84, borderRadius: 42, borderWidth: 2, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', shadowColor: colors.gold, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  icon: { width: 56, height: 56 },
  glyph: { position: 'absolute', fontSize: 52, fontWeight: 'bold', textShadowRadius: 14, textShadowOffset: { width: 0, height: 0 } },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  value: { fontFamily: fonts.title, fontSize: 34, color: colors.text, minWidth: 40, textAlign: 'center' },
  plus: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
});
