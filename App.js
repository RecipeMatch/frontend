import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

export default function App() {
  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  const configureGoogleSignin = () => {
    GoogleSignin.configure({
      webClientId: '872848629680-8953k79kh73573h7n2k2cqr5c8j9qn4m.apps.googleusercontent.com',
      offlineAccess: true, // ID 토큰 및 Refresh 토큰 포함
    });
  };

  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const signIn = async () => {
    console.log('Pressed sign in');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens(); // Access Token 가져오기
      console.log("Access Token:", tokens.accessToken);
      console.log('User Info:', userInfo); // 디버깅 로그
      console.log('ID Token:', userInfo.data?.idToken); // ID Token 디버깅
      setUserInfo(userInfo);
      setError();
    } catch (e) {
      console.error('Sign In Error:', e); // 에러 디버깅
      setError(e);
    }
  };

  const logout = async () => {
    setUserInfo(undefined);
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(error)}</Text>
      {userInfo && <Text>ID Token: {userInfo.data?.idToken || 'ID Token이 없습니다.'}</Text>}
      {userInfo ? (
        <Button title="LogOut" onPress={logout} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
