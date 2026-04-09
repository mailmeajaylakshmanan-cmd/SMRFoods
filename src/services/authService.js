import * as Keychain from 'react-native-keychain';

const LOGIN_URL = 'https://smrfoodsmills.com/smrapp/app_mobile_view/checklog.php';
const DASHBOARD_URL = 'https://smrfoodsmills.com/smrapp/app_mobile_view/category.php';

export async function saveCredentials(username, password) {
  try {
    await Keychain.setGenericPassword(username, password);
  } catch (error) {
    console.error('Keychain error saving credentials:', error);
  }
}

export async function loadCredentials() {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return { username: credentials.username, password: credentials.password };
    }
  } catch (error) {
    console.error('Keychain error loading credentials:', error);
  }
  return null;
}

export async function clearCredentials() {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Keychain error clearing credentials:', error);
  }
}

export function parseCookies(cookieString) {
  if (!cookieString) return [];
  return cookieString
    .split(/,(?=[^ ])/)
    .map(part => part.trim().split(';')[0].trim())
    .filter(Boolean);
}

export async function loginUser(username, password) {
  try {
    const body = new URLSearchParams({ uid: username, pwd: password });
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body.toString(),
      credentials: 'include',
    });

    const text = (await response.text()).trim();
    const arr = text.split('|');
    const status = arr[0];
    const cookie = arr[1] || '';

    if (status === '0') {
      return { success: true, cookies: cookie, dashboardUrl: DASHBOARD_URL };
    } else if (status === '1') {
      return { success: false, error: 'Invalid username or password.' };
    } else {
      return { success: false, error: 'Unexpected server response.' };
    }
  } catch (err) {
    const error = new Error('Network error. Check your connection.');
    error.isNetworkError = true;
    throw error;
  }
}

export async function autoLogin() {
  const creds = await loadCredentials();
  if (!creds) return null;

  const result = await loginUser(creds.username, creds.password);
  
  if (result.success) return result.cookies;

  return null;
}