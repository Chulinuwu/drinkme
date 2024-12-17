import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';

export const actions = {
  OAuth2: async ({}) => {
    const redirectURL = 'http://localhost:5173/oauth';
    
    // Ensure the client ID and secret are defined
    if (!SECRET_CLIENT_ID || !SECRET_CLIENT_SECRET) {
      console.error('Client ID or Client Secret not defined.');
      throw new Error('OAuth2 client configuration is missing.');
    }

    const oAuth2Client = new OAuth2Client(
      SECRET_CLIENT_ID,
      SECRET_CLIENT_SECRET,
      redirectURL
    );

    // Generate the URL for the consent dialog with the correct scopes
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline', // Ensures you get a refresh token
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets'

      ], // Added the necessary scopes for Sheets and Drive
      prompt: 'consent', // Ensures the consent screen is shown to the user
    });

    // Redirect to the Google OAuth2 consent page
    throw redirect(302, authorizeUrl);
  }
};
