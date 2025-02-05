import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithCredential, signOut } from 'firebase/auth';

console.log("Firebase 모듈 로드됨:", { GoogleAuthProvider, signInWithCredential, signOut });



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
    console.log('Firebase Auth Instance:', auth); // Firebase Auth가 정상적으로 불러와졌는지 확인
    configureGoogleSignin();
  }, []);

  const signIn = async () => {
    console.log('Pressed sign in');
    try {
      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();
      console.log('Google Login Success:', googleUser);
  
      // Google ID Token 받아오기
      const idToken = googleUser.data?.idToken; // userInfo.data.idToken에서 가져오기
      console.log('[DEBUG] Google ID Token:', idToken);
      
      if (!idToken) {
         throw new Error('[ERROR] ID Token이 없습니다.');
        }

      console.log('Google ID Token:', idToken);
  
      if (!idToken) {
        throw new Error('ID Token이 없습니다.');
      }
  
      // Firebase에 ID Token 전달하여 로그인 처리
      const googleCredential = GoogleAuthProvider.credential(idToken);
      console.log('Firebase Credential 생성:', googleCredential);
  
      const firebaseUser = await signInWithCredential(auth, googleCredential);
      console.log('Firebase Authentication 성공:', firebaseUser);
  
      setUserInfo(firebaseUser.user);
      setError();
    } catch (e) {
      console.error('로그인 오류:', e);
      setError(e);
    }
  };
  

  const logout = async () => {
    console.log('Logging out...');
    try {
      setUserInfo(undefined);
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await signOut(auth); // Firebase에서도 로그아웃 추가
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(error)}</Text>
  
      {userInfo ? (
        <>
          <Text>ID Token: {userInfo.stsTokenManager?.accessToken || 'ID Token이 없습니다.'}</Text>
          <Text>Access Token: {userInfo.stsTokenManager?.accessToken || 'Access Token이 없습니다.'}</Text>
          <Text>Email: {userInfo.email || '이메일 정보 없음'}</Text>
          <Text>이름: {userInfo.displayName || '이름 정보 없음'}</Text>
          <Button title="LogOut" onPress={logout} />
        </>
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
