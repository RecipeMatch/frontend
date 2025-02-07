import React, { useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../config/firebase"; // Firebase 설정 불러오기
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const { androidClientId, webClientId } = Constants.expoConfig.extra;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("✅ Google 로그인 성공:", response);

      // Google 로그인 정보에서 ID 토큰 가져오기
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);

      // Firebase에 로그인 처리
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("🔥 Firebase 로그인 성공:", userCredential);
          navigation.replace("Home"); // 로그인 후 홈 화면으로 이동
        })
        .catch((error) => {
          console.error("❌ Firebase 로그인 실패:", error);
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
