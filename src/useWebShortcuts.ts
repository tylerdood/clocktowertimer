import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useStore } from './store';

/** Desktop-browser keyboard shortcuts (same defaults as the original web app). No-op on native. */
export function useWebShortcuts(toggleSettings: () => void) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const s = useStore.getState();
      const running = s.endAt !== null;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      let handled = true;
      switch (k) {
        case ' ': running ? s.stop() : s.start(); break;
        case 'Backspace': s.reset(); break;
        case 'ArrowUp': case 'ArrowRight': case '+': s.nudge(1); break;
        case 'ArrowDown': case 'ArrowLeft': case '-': s.nudge(-1); break;
        case 'r': s.recall(); break;
        case 'n': case 'Enter': s.advance(); break;
        case 'p': s.previous(); break;
        case 'z': s.hearts_(1); break;
        case 'x': s.hearts_(-1); break;
        case 'c': s.votes_(1); break;
        case 'v': s.votes_(-1); break;
        case 'q': toggleSettings(); break;
        default: handled = false;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleSettings]);
}
