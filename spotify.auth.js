const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return crypto.subtle.digest('SHA-256', data)
}
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const redirectUri = location.href.split('?')[0].split('#')[0];
let clientId = localStorage.getItem('spotify_client_id');
document.getElementById('clientId').value = clientId;
const urlParams = new URLSearchParams(location.search);
let code = urlParams.get('code');
const state = urlParams.get('state');
if (state === 'request_user_auth') {
    getAccessToken(code);
}

function requireAuth() {
  clientId = document.getElementById('clientId').value || '9c288c96571e470db82a242089fb9cf6';
  localStorage.setItem('spotify_client_id', clientId)
  requestUserAuth();
}

async function requestUserAuth() {
  const scope = 'user-read-playback-state user-modify-playback-state'; // streaming
  const authUrl = new URL("https://accounts.spotify.com/authorize")
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);
  localStorage.setItem('code_verifier', codeVerifier);

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state: 'request_user_auth',
  }
  authUrl.search = new URLSearchParams(params).toString();
  location.href = authUrl.toString();
}

async function getAccessToken(code) {
  let codeVerifier = localStorage.getItem('code_verifier');
  const url = new URL("https://accounts.spotify.com/api/token")

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }
  const body = await fetch(url, payload);
  const response = await body.json();

  localStorage.setItem('spotify_access_token', response.access_token);
  localStorage.setItem('spotify_access_token_expires_in', response.expires_in);
  localStorage.setItem('spotify_access_token_timestamp', (Math.floor(Date.now() / 1000)).toString());
  localStorage.setItem('spotify_refresh_token', response.refresh_token);
  location.href = redirectUri + '#finish'
}