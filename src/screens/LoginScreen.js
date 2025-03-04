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
import { API_BASE_URL } from "@env"; 
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

// 로그인 배경 이미지 설정
import LoginBackground from "../../assets/images/food_Login.jpg";

const { androidClientId, webClientId } = Constants.expoConfig.extra;

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId,
    webClientId: webClientId,
    scopes: ["profile", "email", "openid"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          // Firebase에서 받아온 사용자 객체 확인
          const firebaseUser = userCredential.user;
          console.log("Firebase user:", firebaseUser);
          
          const userEmail = firebaseUser?.email;
          console.log("🔥 Firebase Email (사용자 이메일):", userEmail);
    
          if (!userEmail) {
            throw new Error("Firebase 인증 오류: 이메일 정보를 가져올 수 없습니다.");
          }
    
          try {
            // 백엔드에 로그인 요청 (uid 필드에 userEmail 전달)
            const backendResponse = await axios.post(
              `${API_BASE_URL}/api/users/login`,
              { uid: userEmail },
              { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("✅ 백엔드 응답:", backendResponse.data);
    
            const accessToken = backendResponse.data?.accessToken;
            if (!accessToken) {
              throw new Error("토큰 발급 실패");
            }
    
            // AsyncStorage에 저장
            await AsyncStorage.setItem("userEmail", userEmail);
            await AsyncStorage.setItem("userToken", accessToken);
    
            console.log("✅ AsyncStorage에 저장된 userEmail:", await AsyncStorage.getItem("userEmail"));
            console.log("✅ AsyncStorage에 저장된 userToken:", await AsyncStorage.getItem("userToken"));
    
            // AuthContext에 로그인 정보 업데이트 및 홈 화면 이동
            await login(accessToken, userEmail);
            navigation.replace("Home");
          } catch (error) {
            console.error("❌ 백엔드 연결 실패:", error.response?.data || error.message);
          }
        })
        .catch((error) => {
          console.error("❌ Firebase 로그인 에러:", error.message);
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
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;