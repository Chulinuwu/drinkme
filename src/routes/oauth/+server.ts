import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

async function getUserData(access_token: any) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  const data = await response.json();
  return data;
}

export const GET = async ({ url, cookies }) => {
  const redirectURL = 'http://localhost:5173/oauth';
  const code = url.searchParams.get('code');

  try {
    const oAuth2Client = new OAuth2Client(
      SECRET_CLIENT_ID,
      SECRET_CLIENT_SECRET,
      redirectURL
    );
    if (!code) {
      throw new Error('Authorization code not found');
    }
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);
    const user = await getUserData(oAuth2Client.credentials.access_token);

    // Set user data in a cookie
    cookies.set('user', JSON.stringify(user), { path: '/', httpOnly: false });

    console.info('Tokens acquired and user data set in cookie.');
  } catch (err) {
    console.log('Error logging in with OAuth2 user', err);
  }

  throw redirect(303, '/');
};