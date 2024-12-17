import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

// Fetch user data from Google API
async function getUserData(access_token: string) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  if (!response.ok) {
    throw new Error(`Error fetching user data: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Fetch and process spreadsheets
async function getAllSpreadsheets(access_token: string) {
  const response = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.spreadsheet"', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error fetching spreadsheets: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.files.map((file: { id: string; name: string }) => ({
    id: file.id,
    name: file.name,
  }));
}

export const GET = async ({ url, cookies }) => {
  const redirectURL = 'https://drinkme-pearl.vercel.app/oauth';
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('Authorization code not found');
    throw redirect(303, '/');
  }

  try {
    const oAuth2Client = new OAuth2Client(
      SECRET_CLIENT_ID,
      SECRET_CLIENT_SECRET,
      redirectURL
    );

    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);

    const access_token = oAuth2Client.credentials.access_token as string;

    // Fetch user data and spreadsheets
    const user = await getUserData(access_token);
    // const spreadsheets = await getAllSpreadsheets(access_token);

    // Store user data and spreadsheets in cookies
    cookies.set('user', JSON.stringify(user), { path: '/', httpOnly: false });
    cookies.set('token', JSON.stringify(access_token), { path: '/', httpOnly: false });

    console.info('Tokens acquired, user data and spreadsheets list set in cookies.');
  } catch (err) {
    console.error('Error logging in with OAuth2 user', err);
  }

  throw redirect(303, '/');
};
