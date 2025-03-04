import React, { useContext, useState, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "@env";
import BottomTab from "../components/BottomTab";
import { AntDesign } from "@expo/vector-icons";

const ProfileEditScreen = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <AntDesign name="arrowleft" size={24} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  const handleUpdate = async () => {
    console.log("🚀 사용자 정보 업데이트 요청:", { nickname, phoneNumber });
  
    try {
      let userEmail = await AsyncStorage.getItem("userEmail");
      const userToken = await AsyncStorage.getItem("userToken");
  
      if (!userEmail) {
        console.warn("⚠️ userEmail이 null입니다. 다시 불러옵니다.");
        userEmail = userInfo?.email; // ✅ AuthContext에서 이메일 가져오기
  
        if (userEmail) {
          console.log("🔄 이메일을 AsyncStorage에 다시 저장:", userEmail);
          await AsyncStorage.setItem("userEmail", userEmail); // 다시 저장
        }
      }
  
      console.log("📡 저장된 userEmail 확인:", userEmail);
      console.log("📡 저장된 userToken 확인:", userToken);
  
      if (!userToken || !userEmail) {
        console.error("❌ 로그인 정보가 없습니다. 다시 로그인하세요.");
        Alert.alert("❌ 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
      }
  
      console.log("📡 백엔드 요청: ", `${API_BASE_URL}/api/users/updateInfo`);
      console.log("📩 요청 데이터:", { uid: userEmail, nickname, phoneNumber });
  
      const response = await axios.put(
        `${API_BASE_URL}/api/users/updateInfo`,
        { uid: userEmail, nickname, phoneNumber }, // ✅ uid 필드에 email을 전달
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` } }
      );
  
      console.log("✅ 백엔드 응답 코드:", response.status);
  
      if (response.status === 200) {
        await AsyncStorage.setItem("userNickname", nickname);
        await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
  
        setUserInfo({ ...userInfo, nickname, phoneNumber });
  
        Alert.alert("✅ 성공", "사용자 정보가 업데이트되었습니다.");
        navigation.goBack();
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
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15, width: "80%" },
  label: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  input: { flex: 1, borderBottomWidth: 1, borderColor: "#ddd", fontSize: 16, paddingVertical: 5 },
  button: { backgroundColor: "#1FCC79", padding: 10, borderRadius: 5, marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default ProfileEditScreen;