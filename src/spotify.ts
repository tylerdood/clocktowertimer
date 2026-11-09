import { Platform } from 'react-native';
import type { Phase } from './logic';

/** Spotify volume control uses browser OAuth + localStorage, so it is web-only. */
export const spotifySupported = Platform.OS === 'web' && typeof window !== 'undefined';

export const DEFAULT_SPOTIFY_CLIENT_ID = '9c288c96571e470db82a242089fb9cf6';
export const DEFAULT_SPOTIFY_VOLUMES = [50, 30, 80]; // dawn (day), dusk (end of day), night

const ls = {
  get: (k: string) => { try { return window.localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { window.localStorage.setItem(k, v); } catch { /* ignore */ } },
  remove: (k: string) => { try { window.localStorage.removeItem(k); } catch { /* ignore */ } },
};

export const isSpotifyConnected = () => spotifySupported && !!ls.get('spotify_access_token');

const redirectUri = () => `${window.location.origin}${window.location.pathname}`;

const randomString = (n: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(n)), (x) => chars[x % chars.length]).join('');
};
const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

/** Step 1: send the user to Spotify to approve access. */
export async function startSpotifyAuth(clientId: string) {
  if (!spotifySupported) return;
  const id = clientId.trim() || DEFAULT_SPOTIFY_CLIENT_ID;
  ls.set('spotify_client_id', id);
  const verifier = randomString(64);
  ls.set('spotify_code_verifier', verifier);
  const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
  const url = new URL('https://accounts.spotify.com/authorize');
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: id,
    scope: 'user-read-playback-state user-modify-playback-state',
    code_challenge_method: 'S256',
    code_challenge: challenge,
    redirect_uri: redirectUri(),
    state: 'request_user_auth',
  }).toString();
  window.location.href = url.toString();
}

/** Step 2: when Spotify sends the user back with ?code=..., swap it for a token. Returns true if connected. */
export async function handleSpotifyRedirect(): Promise<boolean> {
  if (!spotifySupported) return false;
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (params.get('state') !== 'request_user_auth' || !code) return false;
  window.history.replaceState({}, '', redirectUri()); // clean the URL right away
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: ls.get('spotify_client_id') || DEFAULT_SPOTIFY_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri(),
        code_verifier: ls.get('spotify_code_verifier') || '',
      }),
    });
    const body = await res.json();
    if (!body.access_token) return false;
    saveTokens(body);
    return true;
  } catch {
    return false;
  }
}

function saveTokens(body: { access_token: string; refresh_token?: string; expires_in: number }) {
  ls.set('spotify_access_token', body.access_token);
  if (body.refresh_token) ls.set('spotify_refresh_token', body.refresh_token);
  ls.set('spotify_access_token_expires_in', String(body.expires_in));
  ls.set('spotify_access_token_timestamp', String(Math.floor(Date.now() / 1000)));
}

export function disconnectSpotify() {
  ['spotify_access_token', 'spotify_refresh_token', 'spotify_access_token_expires_in', 'spotify_access_token_timestamp', 'spotify_code_verifier'].forEach(ls.remove);
}

async function accessToken(): Promise<string> {
  const token = ls.get('spotify_access_token');
  const expiresAt = Number(ls.get('spotify_access_token_timestamp')) + Number(ls.get('spotify_access_token_expires_in'));
  if (token && Math.floor(Date.now() / 1000) < expiresAt) return token;
  const refresh = ls.get('spotify_refresh_token');
  const clientId = ls.get('spotify_client_id') || DEFAULT_SPOTIFY_CLIENT_ID;
  if (!refresh) throw new Error('Spotify is not connected');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: clientId }),
  });
  const body = await res.json();
  if (!body.access_token) throw new Error('Spotify token refresh failed');
  saveTokens(body);
  return body.access_token;
}

async function call(endpoint: string, method = 'PUT') {
  return fetch(`https://api.spotify.com/v1${endpoint}`, { method, headers: { Authorization: `Bearer ${await accessToken()}` } });
}

export async function spotifyTogglePlay() {
  if (!isSpotifyConnected()) return;
  try {
    const state = await (await call('/me/player', 'GET')).json();
    await call(state?.is_playing ? '/me/player/pause' : '/me/player/play');
  } catch (e) {
    console.warn('Spotify toggle failed', e);
  }
}

export async function setSpotifyVolume(volume: number) {
  if (!isSpotifyConnected()) return;
  try {
    await call(`/me/player/volume?volume_percent=${Math.round(volume)}`);
  } catch (e) {
    console.warn('Spotify volume failed', e);
  }
}

/** Called on phase change: dawn = Day, dusk = End of Day, night = Night. */
export function applyPhaseVolume(phase: Phase, enabled: boolean, volumes: number[]) {
  if (!enabled) return;
  const v = phase === 'DAY' ? volumes[0] : phase === 'ENDOFDAY' ? volumes[1] : volumes[2];
  setSpotifyVolume(v);
}

/** Optional ?volume=[50,30,80] URL override, as in the original app. */
export function volumesFromUrl(): number[] | null {
  if (!spotifySupported) return null;
  try {
    const raw = new URLSearchParams(window.location.search).get('volume');
    const v = raw ? JSON.parse(raw) : null;
    return Array.isArray(v) && v.length === 3 && v.every((n) => Number.isFinite(n)) ? v.map((n) => Math.max(0, Math.min(100, n))) : null;
  } catch {
    return null;
  }
}
