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
  
        // 기존 데이터가 있으면 덮어쓰지 않도록 조건 추가
        if (email) {
          setUserInfo((prevUserInfo) => ({
            email,
            nickname: nickname || prevUserInfo?.nickname || "닉네임 없음",
            phoneNumber: phoneNumber || prevUserInfo?.phoneNumber || "전화번호 없음",
          }));
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

  const login = async (token, email) => {
    console.log("🚀 로그인 실행! 저장할 토큰:", token);
    console.log("📩 전달된 email 값 확인:", email);
  
    if (!email) {
      console.error("❌ 이메일 값이 없습니다. 로그인 실패.");
      return;
    }
  
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userEmail", email);
  
    const storedToken = await AsyncStorage.getItem("userToken");
    const storedEmail = await AsyncStorage.getItem("userEmail");
  
    console.log("✅ AsyncStorage에 저장된 토큰 확인:", storedToken);
    console.log("✅ AsyncStorage에 저장된 이메일 확인:", storedEmail);
  
    // 기존 닉네임과 전화번호 유지
    const storedNickname = await AsyncStorage.getItem("userNickname");
    const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
  
    setUserInfo({
      email: storedEmail,
      nickname: storedNickname || "닉네임 없음",
      phoneNumber: storedPhoneNumber || "전화번호 없음",
    });
  };
  
  
  

  const logout = async () => {
    console.log("🚀 로그아웃 실행! 저장된 토큰 삭제 중...");
    await AsyncStorage.removeItem("userToken");
    const checkToken = await AsyncStorage.getItem("userToken"); // ✅ 삭제 확인
    console.log("✅ AsyncStorage에서 토큰 삭제 후 확인:", checkToken);
    setUserToken(null);
    setUserInfo(null); // ✅ 로그아웃 시 userInfo도 초기화 , 이거 삭제시 다시 로그인하면 닉네임,폰번호 유지.
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, setUserInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
