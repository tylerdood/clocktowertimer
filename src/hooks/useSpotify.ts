import { useSettingsStore } from '../store/settingsStore';

async function callSpotify(endpoint: string, method: string = 'PUT') {
  const accessToken = await validateAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  });
  return response;
}

async function validateAccessToken(): Promise<string> {
  const ls_token = localStorage.getItem('spotify_access_token');
  const ls_token_timer =
    Number(localStorage.getItem('spotify_access_token_timestamp')) +
    Number(localStorage.getItem('spotify_access_token_expires_in'));
  const timestamp = Math.floor(Date.now() / 1000);
  
  if (ls_token && timestamp < ls_token_timer) {
    return ls_token;
  } else {
    // Refresh token
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    const clientId = localStorage.getItem('spotify_client_id');
    
    if (!refreshToken || !clientId) {
      throw new Error('No refresh token available');
    }

    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('spotify_access_token', response.access_token);
    if (response.refresh_token) {
      localStorage.setItem('spotify_refresh_token', response.refresh_token);
    }
    localStorage.setItem('spotify_access_token_expires_in', response.expires_in);
    localStorage.setItem('spotify_access_token_timestamp', timestamp.toString());
    
    return response.access_token;
  }
}

export function useSpotify() {
  const { featureSpotify } = useSettingsStore();

  const useSpotify = (): boolean => {
    return featureSpotify && !!localStorage.getItem('spotify_access_token');
  };

  const togglePlay = async (force: boolean = false) => {
    if (!force && !useSpotify()) return;
    
    try {
      const response = await (await callSpotify('/me/player', 'GET')).json();
      if (response.is_playing) {
        await callSpotify('/me/player/pause');
      } else {
        await callSpotify('/me/player/play');
      }
    } catch (error) {
      console.error('Spotify toggle play error:', error);
    }
  };

  const setVolume = async (volume: number, force: boolean = false) => {
    if (!force && !useSpotify()) return;
    
    try {
      await callSpotify(`/me/player/volume?volume_percent=${volume}`);
    } catch (error) {
      console.error('Spotify volume error:', error);
    }
  };

  return {
    isConnected: useSpotify(),
    togglePlay,
    setVolume,
  };
}

