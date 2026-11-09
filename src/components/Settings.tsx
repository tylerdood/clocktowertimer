import React from 'react';
import { Modal, ScrollView, StyleSheet, Switch, Text, TextInput, View, Platform, Alert, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Press } from './Press';
import { colors, fonts } from '../theme';
import { useStore } from '../store';
import { buildSchedule, formatTime } from '../logic';
import { useT, Language } from '../i18n';
import { spotifySupported, isSpotifyConnected, startSpotifyAuth, disconnectSpotify, spotifyTogglePlay, DEFAULT_SPOTIFY_VOLUMES } from '../spotify';

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
  <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.gold, false: '#444' }} ios_backgroundColor="#444" thumbColor="#fff" {...({ activeThumbColor: "#fff" } as object)} />
);

const mins = (m: number) => formatTime(m * 60);

const isWeb = Platform.OS === 'web';
const GITHUB = 'https://github.com/tylerdood/clocktowertimer';

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <View style={styles.segment}>
      {options.map((o) => (
        <View key={o.value} style={{ flex: 1 }}>
          <Press onPress={() => onChange(o.value)} style={[styles.segBtn, value === o.value && styles.segOn]} accessibilityLabel={o.label}>
            <Text style={[styles.segText, value === o.value && { color: '#111' }]} numberOfLines={1}>{o.label}</Text>
          </Press>
        </View>
      ))}
    </View>
  );
}

function ActionRow({ label, onPress, last, danger }: { label: string; onPress: () => void; last?: boolean; danger?: boolean }) {
  return (
    <Press onPress={onPress} style={[styles.row, !last && styles.rowBorder]}>
      <Text style={[styles.label, { color: danger ? '#ff6b6b' : colors.gold }]}>{label}</Text>
    </Press>
  );
}

const SHORTCUTS: [string, string][] = [
  ['keys-start-stop', 'Space'], ['keys-timer-reset', 'Backspace'], ['keys-timer-plus', '↑ → +'], ['keys-timer-minus', '↓ ← −'],
  ['keys-recall', 'R'], ['keys-phase-next', 'N / Enter'], ['keys-phase-prev', 'P'],
  ['keys-alive-plus', 'Z'], ['keys-alive-minus', 'X'], ['keys-vote-plus', 'C'], ['keys-vote-minus', 'V'], ['keys-settings', 'Q'],
];

export function SettingsSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const s = useStore();
  const t = useT();
  const sched = buildSchedule(s);
  const set = s.setPrefs;
  const connected = visible && isSpotifyConnected();
  const [, force] = React.useReducer((x: number) => x + 1, 0);
  const lastDay = sched.day.length - 1;

  const setVolume = (i: number, v: number) => set({ spotifyVolumes: s.spotifyVolumes.map((x, j) => (j === i ? v : x)) });
  const lang: { value: Language; label: string }[] = [
    { value: 'auto', label: t('language-auto') },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'} onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('settings-title')}</Text>
          <Press onPress={onClose} accessibilityLabel={t('done')}><Text style={styles.done}>{t('done')}</Text></Press>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60, maxWidth: 560, width: '100%', alignSelf: 'center' }}>
          <Section title={t('settings-gamestate')}>
            <Row label={t('starting-player-count')}><Stepper value={s.playerCount} min={5} max={15} onChange={(v) => set({ playerCount: v })} /></Row>
            <Row label={t('traveller-count')}><Stepper value={s.travelerCount} min={0} max={5} onChange={(v) => set({ travelerCount: v })} /></Row>
            <Row label={t('linked-timer')} last><Toggle value={s.linkedTimer} onChange={(v) => set({ linkedTimer: v })} /></Row>
          </Section>

          <Section title={t('section-daytimers')} footer={s.linkedTimer ? t('footer-linked') : t('footer-unlinked')}>
            <Row label={t('day1-discussion')}><Stepper value={s.linkedTimer ? sched.day[0] / 60 : s.day1} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ day1: v })} /></Row>
            <Row label={t('last-day-discussion')}><Stepper value={s.linkedTimer ? sched.day[lastDay] / 60 : s.dayN} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ dayN: v })} /></Row>
            <Row label={t('day1-nominations')}><Stepper value={s.linkedTimer ? sched.endOfDay[0] / 60 : s.night1} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ night1: v })} /></Row>
            <Row label={t('last-day-nominations')} last><Stepper value={s.linkedTimer ? sched.endOfDay[lastDay] / 60 : s.nightN} min={0.5} max={30} step={0.25} format={mins} onChange={(v) => !s.linkedTimer && set({ nightN: v })} /></Row>
          </Section>

          <Section title={t('section-schedule')}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
              <View>
                <View style={styles.tRow}><Text style={[styles.tHead, styles.tLabel]}>{t('day')}</Text>{sched.day.map((_, i) => <Text key={i} style={styles.tHead}>{i + 1}</Text>)}</View>
                <View style={styles.tRow}><FontAwesome5 name="comments" size={14} color={colors.gold} style={styles.tLabel} />{sched.day.map((tm, i) => <Text key={i} style={styles.tCell}>{formatTime(tm)}</Text>)}</View>
                <View style={styles.tRow}><FontAwesome5 name="skull" size={14} color={colors.gold} style={styles.tLabel} />{sched.endOfDay.map((tm, i) => <Text key={i} style={styles.tCell}>{formatTime(tm)}</Text>)}</View>
              </View>
            </ScrollView>
          </Section>

          <Section title={t('settings-timer')}>
            <Row label={t('timer-step-width')} last><Stepper value={s.stepSize} min={5} max={60} step={5} format={(v) => `${v}s`} onChange={(v) => set({ stepSize: v })} /></Row>
          </Section>

          <Section title={t('settings-features')}>
            <Row label={t('feature-roles')}><Toggle value={s.trackers} onChange={(v) => set({ trackers: v })} /></Row>
            <Row label={t('feature-audio')}><Toggle value={s.sound} onChange={(v) => set({ sound: v })} /></Row>
            {!isWeb && <Row label={t('haptics')}><Toggle value={s.haptics} onChange={(v) => set({ haptics: v })} /></Row>}
            {!isWeb && <Row label={t('keep-awake')}><Toggle value={s.keepAwake} onChange={(v) => set({ keepAwake: v })} /></Row>}
            {spotifySupported && <Row label={t('feature-spotify')}><Toggle value={s.spotify} onChange={(v) => set({ spotify: v })} /></Row>}
            <View style={[styles.row, { flexDirection: 'column', alignItems: 'stretch', gap: 8, paddingVertical: 12 }]}>
              <Text style={styles.label}>{t('language')}</Text>
              <Segmented value={s.language} options={lang} onChange={(v) => set({ language: v })} />
            </View>
          </Section>

          {spotifySupported && s.spotify && (
            <Section title={t('settings-spotify')} footer={t('spotify-footer')}>
              <Row label={connected ? t('spotify-connected') : t('spotify-not-connected')}>
                <Text style={{ color: connected ? '#4ade80' : '#9a9a9a', fontFamily: fonts.mono, fontSize: 16 }}>{connected ? '●' : '○'}</Text>
              </Row>
              <View style={[styles.row, styles.rowBorder]}>
                <Text style={styles.label}>{t('spotify-client-id')}</Text>
                <TextInput value={s.spotifyClientId} onChangeText={(v) => set({ spotifyClientId: v })} autoCapitalize="none" autoCorrect={false} style={styles.input} />
              </View>
              {!connected ? (
                <ActionRow label={t('spotify-connect-btn')} onPress={() => startSpotifyAuth(s.spotifyClientId)} />
              ) : (
                <>
                  <ActionRow label={`${t('spotify-test')} ${t('spotify-toggle')}`} onPress={() => spotifyTogglePlay()} />
                  <Row label={t('spotify-volume-dawn')}><Stepper value={s.spotifyVolumes[0]} min={0} max={100} step={5} format={(v) => `${v}%`} onChange={(v) => setVolume(0, v)} /></Row>
                  <Row label={t('spotify-volume-dusk')}><Stepper value={s.spotifyVolumes[1]} min={0} max={100} step={5} format={(v) => `${v}%`} onChange={(v) => setVolume(1, v)} /></Row>
                  <Row label={t('spotify-volume-night')}><Stepper value={s.spotifyVolumes[2]} min={0} max={100} step={5} format={(v) => `${v}%`} onChange={(v) => setVolume(2, v)} /></Row>
                  <ActionRow danger last label={t('spotify-disconnect')} onPress={() => { disconnectSpotify(); set({ spotifyVolumes: DEFAULT_SPOTIFY_VOLUMES }); force(); }} />
                </>
              )}
            </Section>
          )}

          {isWeb && (
            <Section title={t('settings-keys')}>
              {SHORTCUTS.map(([k, keys], i) => (
                <Row key={k} label={t(k)} last={i === SHORTCUTS.length - 1}><Text style={styles.key}>{keys}</Text></Row>
              ))}
            </Section>
          )}

          <Section title={t('section-about')}>
            <View style={{ padding: 16, gap: 10 }}>
              <Text style={styles.about}>{t('about-info')}</Text>
              {isWeb && <Text style={styles.about}>{t('about-control')}</Text>}
              <Text style={[styles.about, { opacity: 0.7 }]}>{t('about-disclaimer')}</Text>
            </View>
            <ActionRow last label={t('open-github')} onPress={() => Linking.openURL(GITHUB)} />
          </Section>

          <Press
            style={styles.danger}
            onPress={() => {
              const go = () => { s.resetGame(); onClose(); };
              if (isWeb) { if (window.confirm(`${t('new-game-title')}\n${t('new-game-body')}`)) go(); return; }
              Alert.alert(t('new-game-title'), t('new-game-body'), [
                { text: t('cancel'), style: 'cancel' },
                { text: t('new-game'), style: 'destructive', onPress: go },
              ]);
            }}
          >
            <Text style={styles.dangerText}>{t('new-game')}</Text>
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
  segment: { flexDirection: 'row', backgroundColor: '#1c1c1e', borderRadius: 10, padding: 3 },
  segBtn: { paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  segOn: { backgroundColor: colors.gold },
  segText: { fontFamily: fonts.title, fontSize: 17, color: colors.text },
  input: { flex: 1, marginLeft: 12, backgroundColor: '#1c1c1e', color: colors.text, fontFamily: fonts.mono, fontSize: 13, padding: 8, borderRadius: 8 },
  key: { fontFamily: fonts.mono, fontSize: 16, color: colors.gold },
  about: { fontFamily: fonts.title, fontSize: 16, color: colors.text, lineHeight: 22 },
  danger: { backgroundColor: colors.card, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  dangerText: { color: '#ff6b6b', fontFamily: fonts.title, fontSize: 21 },
});
