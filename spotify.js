function useSpotify() {
  return localStorage.getItem('spotify_access_token') && localStorage.getItem('spotify_access_token') !== 'undefined';
}

async function callSpotify(endpoint, method = 'PUT') {
  const accessToken = await validateAccessToken();
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
  });
  return response;
}

async function spotifyTogglePlay() {
  const response = await (await callSpotify('/me/player', 'GET')).json();
  if (response.is_playing) {
    await callSpotify('/me/player/pause');
  } else {
    await callSpotify('/me/player/play');
  }
}

function spotifyVolume(volume) {
  callSpotify(`/me/player/volume?volume_percent=${volume}`);
}

async function validateAccessToken() {
  const ls_token = localStorage.getItem('spotify_access_token');
  const ls_token_timer = Number(localStorage.getItem('spotify_access_token_timestamp')) + Number(localStorage.getItem('spotify_access_token_expires_in'));
  const timestamp = Math.floor(Date.now() / 1000);
  if (timestamp < ls_token_timer) {
    return ls_token;
  } else {
    // refresh token
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    const url = "https://accounts.spotify.com/api/token";
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: localStorage.getItem('spotify_client_id'),
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('spotify_access_token', response.access_token);
    localStorage.setItem('spotify_refresh_token', response.refreshToken);
    localStorage.setItem('spotify_access_token_expires_in', response.expires_in);
    localStorage.setItem('spotify_access_token_timestamp', timestamp.toString());
    return response.access_token;
  }
}