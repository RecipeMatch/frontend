import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@env";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(undefined);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const email = await AsyncStorage.getItem("userEmail");
        const nickname = await AsyncStorage.getItem("userNickname");
        const phone = await AsyncStorage.getItem("userPhone");

        console.log("✅ 저장된 사용자 정보 확인:", { email, nickname, phone });

        if (token) {
          setUserToken(token);
        }

        if (email) {
          setUserInfo({
            email,
            nickname: nickname || "닉네임 없음",
            phone: phone || "전화번호 없음",
          });
        }
      } catch (error) {
        console.error("❌ 인증 정보 불러오기 실패:", error);
      }
    };
    loadAuthData();
  }, []);

  useEffect(() => {
    console.log("🚀 현재 userToken 상태 변경됨:", userToken);
  }, [userToken]);

  // ✅ 로그인 함수 (이메일만 저장)
  const login = async (token, email) => {
    console.log("🚀 로그인 실행! 저장할 토큰:", token);
    console.log("📩 전달된 email 값 확인:", email);

    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userEmail", email);

    const storedToken = await AsyncStorage.getItem("userToken");
    console.log("✅ AsyncStorage에 저장된 토큰 확인:", storedToken);

    // ✅ 기존 닉네임과 전화번호 유지
    const nickname = (await AsyncStorage.getItem("userNickname")) || "닉네임 없음";
    const phone = (await AsyncStorage.getItem("userPhone")) || "전화번호 없음";

    setUserToken(storedToken);
    setUserInfo({ email, nickname, phone });

    console.log("✅ 로그인 완료 후 저장된 사용자 정보:", { email, nickname, phone });
  };

  // ✅ 로그아웃 함수
  const logout = async () => {
    console.log("🚀 로그아웃 실행! 저장된 토큰 삭제 중...");
    await AsyncStorage.removeItem("userToken");

    setUserToken(null);
    console.log("✅ 로그아웃 완료");
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, setUserInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
