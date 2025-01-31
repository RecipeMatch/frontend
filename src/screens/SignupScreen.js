import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("회원가입 실패", "모든 필드를 입력하세요.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("회원가입 실패", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("회원가입 성공", "로그인 후 이용해주세요.");
      navigation.navigate("Login"); // 회원가입 후 로그인 화면으로 이동
    } catch (error) {
      Alert.alert("회원가입 실패", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>회원가입</Text>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ width: 200, borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ width: 200, borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ width: 200, borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="회원가입" onPress={handleSignup} />
    </View>
  );
};

export default SignupScreen;
