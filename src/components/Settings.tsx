import React from 'react';
import { Modal, ScrollView, StyleSheet, Switch, Text, View, Platform, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Press } from './Press';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { buildSchedule, formatTime } from '../logic';

function Section({ title, children, footer }: { title: string; children: React.ReactNode; footer?: string }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

function Row({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Stepper({ value, onChange, min, max, step = 1, format }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string }) {
  const set = (v: number) => onChange(Math.round(Math.max(min, Math.min(max, v)) * 100) / 100);
  return (
    <View style={styles.stepper}>
      <Press onPress={() => set(value - step)} disabled={value <= min} style={styles.stepBtn} accessibilityLabel="Decrease"><FontAwesome5 name="minus" size={14} color={colors.gold} /></Press>
      <Text style={styles.stepValue}>{format ? format(value) : value}</Text>
      <Press onPress={() => set(value + step)} disabled={value >= max} style={styles.stepBtn} accessibilityLabel="Increase"><FontAwesome5 name="plus" size={14} color={colors.gold} /></Press>
    </View>
  );
}

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.gold, false: '#444' }} ios_backgroundColor="#444" thumbColor="#fff" />
);

const mins = (m: number) => formatTime(m * 60);

export function SettingsSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const s = useStore();
  const sched = buildSchedule(s);
  const set = s.setPrefs;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'} onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Press onPress={onClose} accessibilityLabel="Done"><Text style={styles.done}>Done</Text></Press>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
          <Section title="Game">
            <Row label="Starting players"><Stepper value={s.playerCount} min={5} max={15} onChange={(v) => set({ playerCount: v })} /></Row>
            <Row label="Travellers"><Stepper value={s.travelerCount} min={0} max={5} onChange={(v) => set({ travelerCount: v })} /></Row>
            <Row label="Linked timer" last><Toggle value={s.linkedTimer} onChange={(v) => set({ linkedTimer: v })} /></Row>
          </Section>

          <Section title="Day timers" footer={s.linkedTimer ? 'Linked: discussion times shrink automatically as the game goes on, based on player count. Turn off to set your own.' : 'Times ease from the first day to the last day.'}>
            <Row label="Day 1 discussion"><Stepper value={s.linkedTimer ? sched.day[0] / 60 : s.day1} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ day1: v })} /></Row>
            <Row label="Last day discussion"><Stepper value={s.linkedTimer ? sched.day[sched.day.length - 1] / 60 : s.dayN} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ dayN: v })} /></Row>
            <Row label="Day 1 nominations"><Stepper value={s.linkedTimer ? sched.endOfDay[0] / 60 : s.night1} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ night1: v })} /></Row>
            <Row label="Last day nominations" last><Stepper value={s.linkedTimer ? sched.endOfDay[sched.endOfDay.length - 1] / 60 : s.nightN} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ nightN: v })} /></Row>
          </Section>

          <Section title="Schedule">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
              <View>
                <View style={styles.tRow}><Text style={[styles.tHead, styles.tLabel]}>Day</Text>{sched.day.map((_, i) => <Text key={i} style={styles.tHead}>{i + 1}</Text>)}</View>
                <View style={styles.tRow}><FontAwesome5 name="comments" size={14} color={colors.gold} style={styles.tLabel} />{sched.day.map((t, i) => <Text key={i} style={styles.tCell}>{formatTime(t)}</Text>)}</View>
                <View style={styles.tRow}><FontAwesome5 name="skull" size={14} color={colors.gold} style={styles.tLabel} />{sched.endOfDay.map((t, i) => <Text key={i} style={styles.tCell}>{formatTime(t)}</Text>)}</View>
              </View>
            </ScrollView>
          </Section>

          <Section title="Timer buttons">
            <Row label="Step for ▲ / ▼" last><Stepper value={s.stepSize} min={5} max={60} step={5} format={(v) => `${v}s`} onChange={(v) => set({ stepSize: v })} /></Row>
          </Section>

          <Section title="Features">
            <Row label="Life & vote trackers"><Toggle value={s.trackers} onChange={(v) => set({ trackers: v })} /></Row>
            <Row label="Sound effects"><Toggle value={s.sound} onChange={(v) => set({ sound: v })} /></Row>
            <Row label="Haptics"><Toggle value={s.haptics} onChange={(v) => set({ haptics: v })} /></Row>
            <Row label="Keep screen awake" last><Toggle value={s.keepAwake} onChange={(v) => set({ keepAwake: v })} /></Row>
          </Section>

          <Press
            style={styles.danger}
            onPress={() => Alert.alert('Start a new game?', 'Resets to Night 1 and refills lives and votes.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'New game', style: 'destructive', onPress: () => { s.resetGame(); onClose(); } },
            ])}
          >
            <Text style={styles.dangerText}>New Game</Text>
          </Press>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: colors.sheet },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },
  title: { fontFamily: fonts.title, fontSize: 30, color: colors.text },
  done: { fontFamily: fonts.title, fontSize: 22, color: colors.gold },
  sectionTitle: { fontFamily: fonts.title, fontSize: 15, color: '#9a9a9a', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginLeft: 12 },
  card: { backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden' },
  footer: { color: '#8a8a8a', fontSize: 13, marginTop: 6, marginHorizontal: 12, fontFamily: fonts.title },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 16, paddingVertical: 6 },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#555' },
  label: { fontFamily: fonts.title, fontSize: 19, color: colors.text, flexShrink: 1, paddingRight: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1c1c1e', alignItems: 'center', justifyContent: 'center' },
  stepValue: { fontFamily: fonts.mono, fontSize: 20, color: colors.text, minWidth: 62, textAlign: 'center' },
  tRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  tLabel: { width: 40, textAlign: 'left' },
  tHead: { width: 62, textAlign: 'center', fontFamily: fonts.title, fontSize: 16, color: colors.text },
  tCell: { width: 62, textAlign: 'center', fontFamily: fonts.mono, fontSize: 15, color: colors.text },
  danger: { backgroundColor: colors.card, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  dangerText: { color: '#ff6b6b', fontFamily: fonts.title, fontSize: 21 },
});
