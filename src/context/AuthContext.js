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
        const uid = await AsyncStorage.getItem("userUid");
        const nickname = await AsyncStorage.getItem("userNickname");
        const phoneNumber = await AsyncStorage.getItem("userPhoneNumber");
        const storedAllergyNames = JSON.parse(await AsyncStorage.getItem("userAllergyNames")) || [];
        const storedToolNames = JSON.parse(await AsyncStorage.getItem("userToolNames")) || [];
        const storedIngredientNames = JSON.parse(await AsyncStorage.getItem("userIngredientNames")) || [];
  
        console.log("✅ 저장된 사용자 정보 확인:", { 
          uid, nickname, phoneNumber, storedAllergyNames, storedToolNames, storedIngredientNames
        });
  
        if (uid) {
          setUserInfo({
            uid,
            nickname: nickname || "닉네임 없음",
            phoneNumber: phoneNumber || "전화번호 없음",
            allergyNames: storedAllergyNames,
            toolNames: storedToolNames,
            ingredientNames: storedIngredientNames,
          });
  
          console.log("✅ 최종적으로 설정된 userInfo:", {
            uid,
            nickname,
            phoneNumber,
            allergyNames: storedAllergyNames,
            toolNames: storedToolNames,
            ingredientNames: storedIngredientNames,
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

  const login = async (token, uid, nickname, phoneNumber, allergyNames = [], toolNames = [], ingredientNames = []) => {
    console.log("🚀 로그인 실행! 저장할 토큰:", token);
    console.log("📩 전달된 UID 값 확인:", uid);
  
    if (!uid) {
      console.error("❌ UID 값이 없습니다. 로그인 실패.");
      return;
    }
  
    // ✅ 기존 데이터를 불러오기 (덮어쓰는 것을 방지)
    const prevAllergyNames = JSON.parse(await AsyncStorage.getItem("userAllergyNames")) || [];
    const prevToolNames = JSON.parse(await AsyncStorage.getItem("userToolNames")) || [];
    const prevIngredientNames = JSON.parse(await AsyncStorage.getItem("userIngredientNames")) || [];
  
    const newAllergyNames = allergyNames.length > 0 ? allergyNames : prevAllergyNames;
    const newToolNames = toolNames.length > 0 ? toolNames : prevToolNames;
    const newIngredientNames = ingredientNames.length > 0 ? ingredientNames : prevIngredientNames;
  
    // ✅ 새 데이터 저장
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("userUid", uid);
    if (nickname) await AsyncStorage.setItem("userNickname", nickname);
    if (phoneNumber) await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
    await AsyncStorage.setItem("userAllergyNames", JSON.stringify(newAllergyNames));
    await AsyncStorage.setItem("userToolNames", JSON.stringify(newToolNames));
    await AsyncStorage.setItem("userIngredientNames", JSON.stringify(newIngredientNames));
  
    // ✅ 저장된 데이터 확인
    const storedToken = await AsyncStorage.getItem("userToken");
    const storedUid = await AsyncStorage.getItem("userUid");
    const storedNickname = await AsyncStorage.getItem("userNickname");
    const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
    const storedAllergyNames = JSON.parse(await AsyncStorage.getItem("userAllergyNames")) || [];
    const storedToolNames = JSON.parse(await AsyncStorage.getItem("userToolNames")) || [];
    const storedIngredientNames = JSON.parse(await AsyncStorage.getItem("userIngredientNames")) || [];
  
    console.log("✅ AsyncStorage에 저장된 데이터 확인:", {
      storedToken, storedUid, storedNickname, storedPhoneNumber,
      storedAllergyNames, storedToolNames, storedIngredientNames
    });
  
    // ✅ 최종적으로 `userInfo` 업데이트
    setUserInfo({
      uid: storedUid,
      nickname: storedNickname || "닉네임 없음",
      phoneNumber: storedPhoneNumber || "전화번호 없음",
      allergyNames: storedAllergyNames,
      toolNames: storedToolNames,
      ingredientNames: storedIngredientNames,
    });
  };
  
  
  

  const logout = async () => {
    console.log("🚀 로그아웃 실행! 저장된 토큰 삭제 중...");
    await AsyncStorage.removeItem("userToken");

    // ✅ UID는 삭제하지 않고 유지 (닉네임과 전화번호 저장된 상태 유지)
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userInfo, setUserInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};