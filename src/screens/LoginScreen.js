import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuthRequest } from "expo-auth-session/providers/google"; // ✅ Google 모듈 직접 불러오기
import styled from "styled-components/native"; // Styled Components 유지
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // ✅ 웹 브라우저 인증 완료 설정

// 🔹 Google 로그인 설정
const config = {
  expoClientId: "872848629680-veq9d2h5p270qpder2j1jelvths5stev.apps.googleusercontent.com",
  androidClientId: "872848629680-a5bml86ech9faf9jtd2mr6qki7jegdpf.apps.googleusercontent.com",
  webClientId: "872848629680-mkqahn8lgsng4e9eg8e0p3p220svimn5.apps.googleusercontent.com",
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  // 🔹 Google 로그인 요청 설정
  const redirectUri = "https://auth.expo.io/@ak1374/my-app";  // ✅ 직접 지정 (Expo에서 사용하는 로그인 URL)

  console.log("📌 현재 redirectUri:", redirectUri);  // 🚀 URI가 올바르게 설정되었는지 확인!
  console.log("📌 현재 Expo clientId:", config.expoClientId);
  console.log("📌 현재 Android clientId:", config.androidClientId);
  console.log("📌 현재 Web clientId:", config.webClientId);
  console.log("🔍 최종 Google 요청 URI:", request?.url);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: config.webClientId,  // ✅ 웹 클라이언트 ID 사용
      scopes: ["profile", "email"],
      redirectUri: "https://auth.expo.io/@ak1374/my-app",  // ✅ 강제 지정
    },
    GoogleAuthProvider
  );
  

  // 🔹 Google 로그인 처리 (ID 토큰만 백엔드로 전송)
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (id_token) {
        sendIdTokenToBackend(id_token); // ✅ ID 토큰만 백엔드로 전송
      } else {
        Alert.alert("Google 로그인 오류", "ID 토큰을 가져오지 못했습니다.");
      }
    }
  }, [response]);

  // 🔹 이메일 로그인 (ID 토큰만 백엔드로 전송)
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(); // ✅ ID 토큰만 가져옴

      sendIdTokenToBackend(idToken); // ✅ 백엔드로 ID 토큰 전송

    } catch (error) {
      Alert.alert("로그인 오류", error.message);
    }
  };

  // 🔹 이메일 회원가입 (ID 토큰만 백엔드로 전송)
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken(); // ✅ ID 토큰만 가져옴

      sendIdTokenToBackend(idToken); // ✅ 백엔드로 ID 토큰 전송

    } catch (error) {
      Alert.alert("회원가입 오류", error.message);
    }
  };

  // ✅ ID 토큰을 백엔드로 전송하는 함수 추가
  const sendIdTokenToBackend = async (idToken) => {
    try {
      const response = await fetch("https://your-backend.com/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }), // ✅ ID 토큰만 전송 (JWT X)
      });

      const data = await response.json();
      if (data.jwt) {
        console.log("서버에서 JWT 반환:", data.jwt);
      } else {
        console.error("JWT가 반환되지 않음");
      }
    } catch (error) {
      console.error("서버 통신 오류:", error);
    }
  };

  return (
    <Container>
      <Background />
      <FormContainer>
        <TabContainer>
          <TabButton active={isSignIn} onPress={() => setIsSignIn(true)}>
            <TabText active={isSignIn}>Sign in</TabText>
          </TabButton>
          <TabButton active={!isSignIn} onPress={() => setIsSignIn(false)}>
            <TabText active={!isSignIn}>Sign up</TabText>
          </TabButton>
        </TabContainer>

        {isSignIn ? (
          <>
            <Input placeholder="이메일 입력" value={email} onChangeText={setEmail} />
            <Input placeholder="비밀번호 입력" value={password} onChangeText={setPassword} secureTextEntry />

            <OptionsContainer>
              <CheckboxWrapper onPress={() => setRememberMe(!rememberMe)}>
                <Checkbox checked={rememberMe} />
                <Text>Remember me</Text>
              </CheckboxWrapper>
              <ForgotPassword>Forgot password?</ForgotPassword>
            </OptionsContainer>

            <LoginButton onPress={handleLogin}>
              <LoginText>Login</LoginText>
            </LoginButton>

            <LoginButton onPress={() => promptAsync()} style={{ backgroundColor: "red" }}>
              <LoginText>Google 로그인</LoginText>
            </LoginButton>
          </>
        ) : (
          <>
            <Input placeholder="이름 입력" />
            <Input placeholder="이메일 입력" value={email} onChangeText={setEmail} />
            <Input placeholder="비밀번호 입력" value={password} onChangeText={setPassword} secureTextEntry />

            <LoginButton onPress={handleSignUp}>
              <LoginText>회원가입</LoginText>
            </LoginButton>
          </>
        )}

        <AccessText>Access with Touch ID</AccessText>
      </FormContainer>
    </Container>
  );
};

// ✅ Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fce4ec;
`;

const Background = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  top: 20%;
`;

const FormContainer = styled.View.attrs(() => ({
  shadowOffset: { width: 0, height: 4 },
}))`
  width: 85%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  elevation: 5;
  shadow-color: black;
  shadow-opacity: 0.1;
`;

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const TabButton = styled.TouchableOpacity`
  padding-bottom: 5px;
  border-bottom-width: ${(props) => (props.active ? "2px" : "0px")};
  border-bottom-color: #ff6f61;
`;

const TabText = styled.Text`
  font-size: 18px;
  color: ${(props) => (props.active ? "#ff6f61" : "#aaa")};
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-width: 1px;
  border-color: #ddd;
  border-style: solid;
  border-radius: 8px;
  background-color: #f8f8f8;
`;

const OptionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const Checkbox = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border-width: 1px;
  border-color: #ddd;
  margin-right: 5px;
  background-color: ${(props) => (props.checked ? "#ff6f61" : "transparent")};
`;

const ForgotPassword = styled.Text`
  color: #ff6f61;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: #ff6f61;
  padding: 15px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
`;

const LoginText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const AccessText = styled.Text`
  margin-top: 10px;
  color: #aaa;
  text-align: center;
`;

const CheckboxWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

// ✅ LoginScreen을 export 추가
export default LoginScreen;
