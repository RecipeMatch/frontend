import React, { useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../config/firebase"; // Firebase 설정 불러오기
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { Alert } from 'react-native';

const { androidClientId, webClientId } = Constants.expoConfig.extra;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"] // openid 스코프 추가
  });

  useEffect(() => {
    console.log("🔥 Google 로그인 응답:", response);
  
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
  
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("✅ 로그인 성공:", userCredential.user);
          navigation.replace("Home");  // 로그인 후 홈 화면 이동
        })
        .catch((error) => {
          console.error("❌ Firebase 로그인 에러:", error);
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
