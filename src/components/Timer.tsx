import React, { useEffect, useRef, useState } from 'react';
import { Animated, Alert, Modal, StyleSheet, Text, TextInput, View, useWindowDimensions, Platform, Easing } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Press } from './Press';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { formatTime, parseTime } from '../logic';
import { useT } from '../i18n';

export function TimerDisplay() {
  const { width } = useWindowDimensions();
  const time = useStore((s) => s.timeRemaining);
  const phase = useStore((s) => s.phase);
  const running = useStore((s) => s.endAt !== null);
  const tick = useStore((s) => s.tick);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [running, tick]);

  const critical = running && time <= 10;
  useEffect(() => {
    if (!critical) { pulse.setValue(0); return; }
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }));
    loop.start();
    return () => loop.stop();
  }, [critical, pulse]);

  const color = pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [colors.text, colors.red, colors.text] });
  const size = Math.min(width * 0.25, 120);
  return (
    <View style={{ height: size * 1.1, justifyContent: 'center' }}>
      {phase !== 'NIGHT' && (
        <Animated.Text
          allowFontScaling={false}
          style={[styles.time, { fontSize: size, color: critical ? color : colors.text }]}
        >
          {formatTime(time)}
        </Animated.Text>
      )}
    </View>
  );
}

function IconBtn({ icon, onPress, disabled, label }: { icon: string; onPress: () => void; disabled?: boolean; label: string }) {
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityLabel={label} style={styles.btn}>
      <FontAwesome5 name={icon} size={22} color={colors.gold} />
    </Press>
  );
}

export function TimerControls() {
  const s = useStore();
  const t = useT();
  const running = s.endAt !== null;
  const night = s.phase === 'NIGHT';
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  const confirm = () => {
    const secs = parseTime(text);
    if (secs > 0 && secs <= 3599) { s.setTime(secs); setEditing(false); setText(''); }
    else Alert.alert(t('timer-invalid-title'), t('timer-invalid-text', { input: text }));
  };

  return (
    <>
      <View style={styles.row}>
        <IconBtn icon={running ? 'stop' : 'play'} label={t('btn-start-stop')} disabled={night} onPress={running ? s.stop : s.start} />
        <IconBtn icon="sync-alt" label={t('btn-timer-reset')} disabled={running || night} onPress={s.reset} />
        <IconBtn icon="keyboard" label={t('btn-timer-edit')} disabled={running || night} onPress={() => setEditing(true)} />
        <IconBtn icon="arrow-up" label={t('btn-timer-plus')} disabled={running || night} onPress={() => s.nudge(1)} />
        <IconBtn icon="arrow-down" label={t('btn-timer-minus')} disabled={running || night} onPress={() => s.nudge(-1)} />
        <IconBtn icon="bell" label={t('btn-recall')} disabled={night} onPress={s.recall} />
      </View>
      <Modal visible={editing} transparent animationType="fade" onRequestClose={() => setEditing(false)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>{t('timer-title')}</Text>
            <TextInput
              autoFocus
              value={text}
              onChangeText={setText}
              onSubmitEditing={confirm}
              placeholder="7:30   7.5   450s"
              placeholderTextColor="#777"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              style={styles.input}
            />
            <View style={styles.dialogRow}>
              <Press style={styles.dialogBtn} onPress={() => setEditing(false)}><Text style={styles.dialogBtnText}>{t('cancel')}</Text></Press>
              <Press style={[styles.dialogBtn, { backgroundColor: colors.gold }]} onPress={confirm}><Text style={[styles.dialogBtnText, { color: '#111' }]}>{t('timer-set')}</Text></Press>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  time: { fontFamily: fonts.mono, textAlign: 'center', includeFontPadding: false },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  btn: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 140 },
  dialog: { width: '82%', backgroundColor: colors.sheet, borderRadius: 18, padding: 20, gap: 14 },
  dialogTitle: { color: colors.text, fontFamily: fonts.title, fontSize: 24, textAlign: 'center' },
  input: { backgroundColor: colors.card, color: '#fff', fontFamily: fonts.mono, fontSize: 24, textAlign: 'center', padding: 12, borderRadius: 10 },
  dialogRow: { flexDirection: 'row', gap: 10 },
  dialogBtn: { flex: 1, backgroundColor: colors.card, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  dialogBtnText: { color: colors.text, fontFamily: fonts.title, fontSize: 20 },
});
