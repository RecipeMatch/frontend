import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useAuthRequest } from "expo-auth-session/providers/google"; // ✅ Google 모듈 직접 불러오기
import { makeRedirectUri } from "expo-auth-session"; // ✅ makeRedirectUri 별도로 불러오기
import styled from "styled-components/native"; // Styled Components 유지

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
  const [request, response, promptAsync] = useAuthRequest({
    clientId: config.webClientId,
    scopes: ["profile", "email"],
    redirectUri: makeRedirectUri({
      useProxy: true,
    }),
  });

  // 🔹 Google 로그인 처리
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => Alert.alert("Google 로그인 성공!", "환영합니다."))
        .catch((error) => Alert.alert("Google 로그인 실패", error.message));
    }
  }, [response]);

  // 🔹 이메일 로그인
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("로그인 성공!", "환영합니다.");
    } catch (error) {
      Alert.alert("로그인 오류", error.message);
    }
  };

  // 🔹 이메일 회원가입
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("회원가입 성공!", "이메일로 가입이 완료되었습니다.");
    } catch (error) {
      Alert.alert("회원가입 오류", error.message);
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
