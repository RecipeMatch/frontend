import React, { useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import BottomTab from "../components/BottomTab";

const ALLERGY_OPTIONS = [
  { label: "게", value: "CRAB" },
  { label: "고등어", value: "MACKEREL" },
  { label: "닭고기", value: "CHICKEN" },
  { label: "돼지고기", value: "PORK" },
  { label: "땅콩", value: "PEANUT" },
  { label: "메밀", value: "MEMIL" },
  { label: "밀", value: "WHEAT" },
  { label: "복숭아", value: "PEACH" },
  { label: "새우", value: "SHRIMP" },
  { label: "쇠고기", value: "BEEF" },
  { label: "아황산류", value: "SULFITE" },
  { label: "알류", value: "EGG" },
  { label: "오징어", value: "SQUID" },
  { label: "우유", value: "MILK" },
  { label: "잣", value: "PINENUT" },
  { label: "조개류", value: "SHELLFISH" },
  { label: "토마토", value: "TOMATO" },
  { label: "대두", value: "SOY" },
  { label: "호두", value: "WALNUT" },
];

function getAllergyLabels(allergyArray) {
  if (!allergyArray) return [];
  return allergyArray.map((code) => {
    const foundOption = ALLERGY_OPTIONS.find((opt) => opt.value === code);
    return foundOption ? foundOption.label : code;
  });
}

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
          await logout();
          await AsyncStorage.clear();
          navigation.replace("Login");
        },
        style: "destructive",
      },
    ]);
  };

  const allergyLabels = getAllergyLabels(userInfo?.allergyNames);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 프로필</Text>

      {/* 닉네임 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>👤 닉네임</Text>
        <TextInput 
          style={styles.input} 
          value={userInfo?.nickname || "닉네임 없음"} 
          editable={false} 
        />
      </View>

      {/* 전화번호 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>📞 전화번호</Text>
        <TextInput 
          style={styles.input} 
          value={userInfo?.phoneNumber || "전화번호 없음"} 
          editable={false} 
        />
      </View>

      {/* 알레르기 음식 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>🥜 알레르기 음식</Text>
        <TextInput
          style={styles.input}
          // 한글 라벨 배열이 존재하면 join(", ")으로 연결, 없으면 "정보 없음"
          value={allergyLabels.length > 0 ? allergyLabels.join(", ") : "정보 없음"}
          editable={false}
        />
      </View>

      {/* 주방 도구 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>🍳 주방 도구</Text>
        <TextInput
          style={styles.input}
          value={userInfo?.toolNames?.join(", ") || "정보 없음"}
          editable={false}
        />
      </View>

      {/* 주로 사용하는 재료 */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>🧅 주로 사용하는 재료</Text>
        <TextInput
          style={styles.input}
          value={userInfo?.ingredientNames?.join(", ") || "정보 없음"}
          editable={false}
        />
      </View>

      {/* 프로필 수정 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")} style={styles.button}>
        <Text style={styles.buttonText}>프로필 수정</Text>
      </TouchableOpacity>

      {/* 나의 레시피 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate("MyRecipeList")} style={styles.button}>
        <Text style={styles.buttonText}>나의 레시피</Text>
      </TouchableOpacity>
      {/* 좋아요한 레시피 보기 버튼 */}
     <TouchableOpacity onPress={() => navigation.navigate("LikedRecipes")} style={styles.button}>
      <Text style={styles.buttonText}>좋아요한 레시피</Text>
     </TouchableOpacity>

     {/* 즐겨찾기한 레시피 보기 버튼 */}
     <TouchableOpacity onPress={() => navigation.navigate("BookmarkedRecipes")} style={styles.button}>
      <Text style={styles.buttonText}>즐겨찾기한 레시피</Text>
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
    backgroundColor: "#A0E7A0", 
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
