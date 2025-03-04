import React, { useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import BottomTab from "../components/BottomTab";

export default function ProfileScreen() {
  const { userInfo, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "로그아웃",
        onPress: async () => {
          await logout(); // ✅ AuthContext의 logout() 실행
          await AsyncStorage.clear(); // ✅ 저장된 모든 데이터 삭제
          navigation.replace("Login"); // ✅ 로그인 화면으로 이동
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 프로필</Text>

      {/* 닉네임 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>👤 닉네임</Text>
        <TextInput style={styles.input} value={userInfo?.nickname || "닉네임 없음"} editable={false} />
      </View>

      {/* 전화번호 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>📞 전화번호</Text>
        <TextInput style={styles.input} value={userInfo?.phoneNumber || "전화번호 없음"} editable={false} />
      </View>
      
      {/* 프로필 수정 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")} style={styles.button}>
        <Text style={styles.buttonText}>프로필 수정</Text>
      </TouchableOpacity>

      {/* 나의 레시피 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate("MyRecipeList")} style={styles.button}>
        <Text style={styles.buttonText}>나의 레시피</Text>
      </TouchableOpacity>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 20, 
    paddingTop: 50,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    alignSelf: "flex-start", 
    marginBottom: 20, 
  },
  infoContainer: { 
    marginBottom: 15, 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginBottom: 5, 
    color: "#333", 
  },
  input: { 
    backgroundColor: "#f1f1f1", 
    borderRadius: 10, 
    padding: 10, 
    fontSize: 16, 
  },
  button: { 
    backgroundColor: "#1FCC79", 
    paddingVertical: 15, 
    alignItems: "center", 
    borderRadius: 8, 
    marginTop: 20, 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
  logoutButton: { 
    backgroundColor: "#A0E7A0", // ✅ 로그아웃 버튼 색상 변경
    paddingVertical: 15, 
    alignItems: "center", 
    borderRadius: 8, 
    marginTop: 10, 
  },
  logoutText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
});