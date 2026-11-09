import en from './en.json';
import de from './de.json';
import { useStore } from '../store';

export type Language = 'auto' | 'en' | 'de';
type Dict = Record<string, string>;
const dicts: Record<'en' | 'de', Dict> = { en, de };

export function deviceLanguage(): 'en' | 'de' {
  try {
    const loc = Intl.DateTimeFormat().resolvedOptions().locale || 'en';
    return loc.toLowerCase().startsWith('de') ? 'de' : 'en';
  } catch {
    return 'en';
  }
}

export function resolveLanguage(pref: Language): 'en' | 'de' {
  return pref === 'auto' ? deviceLanguage() : pref;
}

export function translate(lang: 'en' | 'de', key: string, vars: Record<string, string | number> = {}): string {
  let msg = dicts[lang][key] ?? dicts.en[key] ?? key;
  for (const [k, v] of Object.entries(vars)) msg = msg.replace(new RegExp(`\\{\\s*${k}\\s*\\}`, 'g'), String(v));
  return msg;
}

/** Hook: returns t(key, vars), re-rendering when the language preference changes. */
export function useT() {
  const pref = useStore((s) => s.language);
  const lang = resolveLanguage(pref);
  return (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars);
}
