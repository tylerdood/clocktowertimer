import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Press } from './Press';
import { colors, fonts } from '../theme';
import { useStore } from '../store';

const label = { DAY: 'Day', ENDOFDAY: 'End of Day', NIGHT: 'Night' } as const;
const next = { DAY: 'End of Day', ENDOFDAY: 'Night', NIGHT: 'Day' } as const;
const nextIcon = { DAY: 'cloud', ENDOFDAY: 'moon', NIGHT: 'sun' } as const;

export function PhaseTitle() {
  const phase = useStore((s) => s.phase);
  const day = useStore((s) => s.day);
  return <Text style={styles.title}>{label[phase]} {day}</Text>;
}

export function PhaseButton() {
  const phase = useStore((s) => s.phase);
  const advance = useStore((s) => s.advance);
  const previous = useStore((s) => s.previous);
  const canBack = useStore((s) => !(s.day === 1 && s.phase === 'NIGHT'));
  return (
    <View style={styles.wrap}>
      <Press onPress={previous} disabled={!canBack} accessibilityLabel="Previous phase" style={styles.back}>
        <FontAwesome5 name="chevron-left" size={18} color={colors.text} />
      </Press>
      <Press onPress={advance} accessibilityLabel="Advance phase" style={styles.main}>
        {phase === 'NIGHT' ? <Ionicons name="sunny" size={24} color="#fff" /> : <FontAwesome5 name={nextIcon[phase]} size={20} color="#fff" />}
        <Text style={styles.mainText} numberOfLines={1} adjustsFontSizeToFit>Advance to {next[phase]}</Text>
      </Press>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text, textAlign: 'center' },
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
  back: { width: 52, height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  main: { flex: 1, paddingHorizontal: 14, height: 56, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.18)', flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' },
  mainText: { color: '#fff', fontFamily: fonts.title, fontSize: 20, flexShrink: 1 },
});
