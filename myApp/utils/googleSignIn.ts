import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // only for iOS
  });
};