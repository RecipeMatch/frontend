import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { Button } from 'react-native';
import {
  EXPO_CLIENT_ID,
  WEB_CLIENT_ID,
  ANDROID_CLIENT_ID,
} from '@env';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const redirectUri = "https://auth.expo.io/@ak1374/my-app"; // 고정된 redirectUri 사용

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: EXPO_CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ['profile', 'email'],
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Login Success:', response.authentication);
    }
  }, [response]);

  return <Button title="Sign in with Google" onPress={() => promptAsync()} />;
}
