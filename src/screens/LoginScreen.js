import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { API_BASE_URL } from "@env"; // ✅ .env에서 API URL 가져오기
import { AntDesign } from "@expo/vector-icons"; // ✅ 구글 아이콘 추가

// ✅ 배경 이미지 설정 (새로운 로그인 배경)
import LoginBackground from "../../assets/images/food_Login.jpg";

const { androidClientId, webClientId } = Constants.expoConfig.extra;

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("🚀 Google 로그인 성공:", response);

      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const userEmail = userCredential.user.email;
          console.log("✅ Firebase에서 받은 이메일:", userEmail); // ✅ 이메일 값 확인

          if (!userEmail) {
            throw new Error("❌ Firebase 인증 오류: 이메일 정보를 가져올 수 없습니다.");
          }

          try {
            console.log("🚀 백엔드 로그인 요청:", `${API_BASE_URL}/api/users/login`);
            console.log("📩 요청 데이터:", { uid: userEmail });

            const backendResponse = await axios.post(
              `${API_BASE_URL}/api/users/login`,
              { uid: userEmail },
              { headers: { "Content-Type": "application/json" } }
            );

            const accessToken = backendResponse.data?.accessToken;
            console.log("✅ 백엔드에서 받은 토큰:", accessToken);

            if (!accessToken) {
              console.error("❌ accessToken을 받지 못했습니다.");
              return;
            }

            await login(accessToken, userEmail); // ✅ email 값 넘기기
            console.log("✅ 로그인 성공, 홈 화면으로 이동");
            navigation.replace("Home");
          } catch (error) {
            console.error("❌ 백엔드 연결 실패:", error.response?.data || error.message);
          }
        })
        .catch((error) => {
          console.error("❌ Firebase 로그인 에러:", error);
        });
    }
  }, [response]);

  return (
    <ImageBackground source={LoginBackground} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <AntDesign name="google" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // ✅ 어두운 반투명 오버레이 추가 (가독성 향상)
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4", // ✅ 구글 공식 색상 적용
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10, // ✅ 아이콘과 텍스트 간격 추가
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
