import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Almendra_400Regular } from '@expo-google-fonts/almendra';
import { XanhMono_400Regular } from '@expo-google-fonts/xanh-mono';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { FontAwesome5 } from '@expo/vector-icons';
import { Background } from './src/components/Background';
import { Roles } from './src/components/Roles';
import { TimerDisplay, TimerControls } from './src/components/Timer';
import { PhaseTitle, PhaseButton } from './src/components/Phase';
import { Trackers } from './src/components/Trackers';
import { SettingsSheet } from './src/components/Settings';
import { Press } from './src/components/Press';
import { colors } from './src/theme';
import { useStore } from './src/store';
import { initAudio, setSoundEnabled } from './src/sound';
import { useWebShortcuts } from './src/useWebShortcuts';
import { handleSpotifyRedirect, volumesFromUrl } from './src/spotify';
import { useT } from './src/i18n';

function Cog({ onPress }: { onPress: () => void }) {
  const { top } = useSafeAreaInsets();
  const t = useT();
  return (
    <View style={[styles.cog, { top: top + 2 }]}>
      <Press style={styles.cogBtn} onPress={onPress} accessibilityLabel={t('btn-settings')}>
        <FontAwesome5 name="cog" size={22} color={colors.text} />
      </Press>
    </View>
  );
}

export default function App() {
  const [fontsLoadedRaw, fontError] = useFonts({ Almendra_400Regular, XanhMono_400Regular });
  const fontsLoaded = fontsLoadedRaw || !!fontError;
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const sound = useStore((s) => s.sound);
  const keepAwake = useStore((s) => s.keepAwake);
  const trackers = useStore((s) => s.trackers);

  useEffect(() => {
    initAudio();
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    // Safety net: never sit on a black screen if hydration stalls.
    const timer = setTimeout(() => setHydrated(true), 3000);
    return () => { unsub(); clearTimeout(timer); };
  }, []);
  useWebShortcuts(React.useCallback(() => setSettingsOpen((o) => !o), []));
  useEffect(() => setSoundEnabled(sound), [sound]);
  useEffect(() => {
    if (keepAwake) activateKeepAwakeAsync('game').catch(() => {});
    else deactivateKeepAwake('game').catch(() => {});
  }, [keepAwake]);
  // Web: finish Spotify sign-in if we were just redirected back, and honour ?volume=[..]
  useEffect(() => {
    if (!hydrated) return;
    handleSpotifyRedirect().then((ok) => { if (ok) { useStore.getState().setPrefs({ spotify: true }); setSettingsOpen(true); } });
    const v = volumesFromUrl();
    if (v) useStore.getState().setPrefs({ spotifyVolumes: v });
  }, [hydrated]);
  // A restored game never resumes a running clock.
  useEffect(() => { if (hydrated) useStore.setState({ endAt: null }); }, [hydrated]);

  if (!fontsLoaded || !hydrated) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="light" />
        <Background />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.top}>
            <Roles />
            <PhaseTitle />
          </View>
          <View style={styles.middle}>
            <TimerDisplay />
            <TimerControls />
            <View style={{ height: 14 }} />
            <PhaseButton />
          </View>
          <View style={styles.bottom}>{trackers ? <Trackers /> : null}</View>
          <Cog onPress={() => setSettingsOpen(true)} />
        </SafeAreaView>
        <SettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', ...(Platform.OS === 'web' ? ({ height: '100vh', overflow: 'hidden' } as object) : null) },
  safe: { flex: 1, width: '100%', maxWidth: 520, alignSelf: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  top: { gap: 6, paddingTop: 44 },
  middle: { alignItems: 'center', justifyContent: 'center' },
  bottom: { minHeight: 150, justifyContent: 'flex-end', paddingBottom: 8 },
  cog: { position: 'absolute', right: 12, zIndex: 5 },
  cogBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
