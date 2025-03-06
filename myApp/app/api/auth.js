import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '321256625453-38r03lerljoulm3hnmjudm2aq50t0u4l.apps.googleusercontent.com',  
  iosClientId: '321256625453-m2n0g36rfup9e216egimeor6hnq1c9b3.apps.googleusercontent.com',
  offlineAccess: true,  // Enables refresh token
});

async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.error(error);
    }
  }

  export { signInWithGoogle };