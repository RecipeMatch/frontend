import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(undefined); // ✅ 초기값 undefined
  const [userInfo, setUserInfo] = useState(null); // ✅ userInfo 추가

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("✅ 저장된 토큰 확인:", token);
        setUserToken(token || null); // ✅ 값이 없으면 null 처리
      } catch (error) {
        console.error("❌ 토큰 불러오기 실패:", error);
        setUserToken(null);
      }
    };

    const loadUserInfo = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const nickname = await AsyncStorage.getItem("userNickname");
        const phoneNumber = await AsyncStorage.getItem("userPhoneNumber");

        console.log("✅ 저장된 사용자 정보 확인:", { email, nickname, phoneNumber });

        if (email) {
          setUserInfo({
            email,
            nickname: nickname || "닉네임 없음",
            phoneNumber: phoneNumber || "전화번호 없음",
          });
        }
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
      }
    };

    loadToken();
    loadUserInfo(); // ✅ 사용자 정보도 불러오기
  }, []);

    

  // ✅ userToken이 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("🚀 현재 userToken 상태 변경됨:", userToken);
  }, [userToken]);

  const login = async (token) => {
    console.log("🚀 로그인 실행! 저장할 토큰:", token);
    await AsyncStorage.setItem("userToken", token);
    const storedToken = await AsyncStorage.getItem("userToken"); // ✅ 저장 확인
    console.log("✅ AsyncStorage에 저장된 토큰 확인:", storedToken);
    setUserToken(storedToken); // ✅ 상태 업데이트
  };

  const logout = async () => {
    console.log("🚀 로그아웃 실행! 저장된 토큰 삭제 중...");
    await AsyncStorage.removeItem("userToken");
    const checkToken = await AsyncStorage.getItem("userToken"); // ✅ 삭제 확인
    console.log("✅ AsyncStorage에서 토큰 삭제 후 확인:", checkToken);
    setUserToken(null);
    setUserInfo(null); // ✅ 로그아웃 시 userInfo도 초기화
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, setUserInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
