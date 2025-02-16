import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "@env";
import BottomTab from "../../components/BottomTab";

export default function ProfileEditScreen() {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  // 🔥 **여기에 콘솔로그 추가!**
  console.log("✅ AuthContext에서 가져온 userInfo:", userInfo);
  console.log("✅ setUserInfo 함수 확인:", typeof setUserInfo);
  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || ""); // ✅ 변수명 변경
  const navigation = useNavigation();

  const handleUpdate = async () => {
    console.log("🚀 사용자 정보 업데이트 요청:", { nickname, phoneNumber });

    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const userEmail = await AsyncStorage.getItem("userEmail");

      console.log("🚀 저장된 userEmail 확인:", userEmail);
      console.log("🚀 저장된 userToken 확인:", userToken);

      if (!userToken || !userEmail) {
        throw new Error("로그인이 필요합니다.");
      }

      console.log("🚀 백엔드 사용자 정보 업데이트 요청:", `${API_BASE_URL}/api/users/updateInfo`);
      console.log("📩 요청 데이터:", { uid: userEmail, nickname, phoneNumber });

      const response = await axios.put(
        `${API_BASE_URL}/api/users/updateInfo`,
        { uid: userEmail, nickname, phoneNumber }, // ✅ phone → phoneNumber 변경
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` } }
      );

      console.log("✅ 백엔드 응답 상태 코드:", response.status);

      if (response.status === 200) {
        // ✅ AsyncStorage에도 업데이트된 정보 저장
        await AsyncStorage.setItem("userNickname", nickname);
        await AsyncStorage.setItem("userPhoneNumber", phoneNumber); // ✅ 변수명 변경

        // ✅ AuthContext 업데이트
        setUserInfo({ ...userInfo, nickname, phoneNumber });

        Alert.alert("✅ 성공", "사용자 정보가 업데이트되었습니다.");
        navigation.navigate("Profile"); // 수정 완료 후 ProfileScreen으로 이동
      }
    } catch (error) {
      console.error("❌ 사용자 정보 업데이트 오류:", error.response?.data || error.message);
      Alert.alert("❌ 오류", error.response?.data?.message || "사용자 정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필 수정</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>👤 닉네임:</Text>
        <TextInput style={styles.input} value={nickname} onChangeText={setNickname} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>📞 전화번호:</Text>
        <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
      </View>

      <TouchableOpacity onPress={handleUpdate} style={styles.button}>
        <Text style={styles.buttonText}>수정 완료</Text>
      </TouchableOpacity>
      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15, width: "80%" },
  label: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  input: { flex: 1, borderBottomWidth: 1, borderColor: "#ddd", fontSize: 16, paddingVertical: 5 },
  button: { backgroundColor: "#1FCC79", padding: 10, borderRadius: 5, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
