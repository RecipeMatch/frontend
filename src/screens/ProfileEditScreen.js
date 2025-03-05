import React, { useContext, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "@env";
import BottomTab from "../components/BottomTab";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const ProfileEditScreen = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  // ✅ 기존 정보 유지
  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [allergyNames, setAllergyNames] = useState(userInfo?.allergyNames || []);
  const [toolNames, setToolNames] = useState(userInfo?.toolNames || []);
  const [ingredientNames, setIngredientNames] = useState(userInfo?.ingredientNames || []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <AntDesign name="arrowleft" size={24} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // ✅ 추가 및 삭제 기능
  const addItem = (setState) => setState((prev) => [...prev, ""]);
  const removeItem = (setState, index) => {
    setState((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      let userEmail = await AsyncStorage.getItem("userEmail");
      const userToken = await AsyncStorage.getItem("userToken");

      if (!userEmail) {
        userEmail = userInfo?.email;
        if (userEmail) {
          await AsyncStorage.setItem("userEmail", userEmail);
        }
      }

      if (!userToken || !userEmail) {
        Alert.alert("❌ 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
      }

      const updatedProfile = {
        uid: userEmail,
        nickname,
        phoneNumber,
        allergyNames: allergyNames.filter(item => item.trim() !== ""),
        toolNames: toolNames.filter(item => item.trim() !== ""),
        ingredientNames: ingredientNames.filter(item => item.trim() !== ""),
      };

      console.log("📡 전송할 데이터:", updatedProfile);

      const response = await axios.put(`${API_BASE_URL}/api/users/updateInfo`, updatedProfile, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("userNickname", nickname);
        await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
        await AsyncStorage.setItem("userAllergyNames", JSON.stringify(updatedProfile.allergyNames));
        await AsyncStorage.setItem("userToolNames", JSON.stringify(updatedProfile.toolNames));
        await AsyncStorage.setItem("userIngredientNames", JSON.stringify(updatedProfile.ingredientNames));

        setUserInfo(updatedProfile);
        Alert.alert("✅ 성공", "프로필이 업데이트되었습니다.");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("❌ 오류", "프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}>
          <Text style={styles.title}>프로필 수정</Text>
  
          {/* 닉네임 */}
          <Text style={styles.label}>👤 닉네임</Text>
          <TextInput style={styles.fixedInput} value={nickname} onChangeText={setNickname} />
  
          {/* 전화번호 */}
          <Text style={styles.label}>📞 전화번호</Text>
          <TextInput style={styles.fixedInput} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
  
          {/* 🥜 알레르기 음식 */}
          <Text style={styles.label}>🥜 알레르기 음식</Text>
          {allergyNames.map((item, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput style={styles.input} value={item} onChangeText={(text) => {
                const newItems = [...allergyNames];
                newItems[index] = text;
                setAllergyNames(newItems);
              }} />
              <TouchableOpacity onPress={() => removeItem(setAllergyNames, index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addItem(setAllergyNames)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>
  
          {/* 🛠 보유한 도구 */}
          <Text style={styles.label}>🛠 보유한 도구</Text>
          {toolNames.map((item, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput style={styles.input} value={item} onChangeText={(text) => {
                const newItems = [...toolNames];
                newItems[index] = text;
                setToolNames(newItems);
              }} />
              <TouchableOpacity onPress={() => removeItem(setToolNames, index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addItem(setToolNames)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>
  
          {/* 🧅 주로 사용하는 재료 */}
          <Text style={styles.label}>🧅 주로 사용하는 재료</Text>
          {ingredientNames.map((item, index) => (
            <View key={index} style={styles.inputRow}>
              <TextInput style={styles.input} value={item} onChangeText={(text) => {
                const newItems = [...ingredientNames];
                newItems[index] = text;
                setIngredientNames(newItems);
              }} />
              <TouchableOpacity onPress={() => removeItem(setIngredientNames, index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addItem(setIngredientNames)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>
        </ScrollView>
  
        {/* 수정 완료 버튼을 항상 화면 하단에 고정 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>수정 완료</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  
      <BottomTab />
    </View>
  );
  
  
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  fixedInput: { backgroundColor: "#f1f1f1", borderRadius: 10, padding: 10, fontSize: 16, height: 50, marginBottom: 10 },
  input: { backgroundColor: "#f1f1f1", borderRadius: 10, padding: 10, fontSize: 16, flex: 1 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  button: { backgroundColor: "#1FCC79", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  buttonContainer: { 
    marginTop: 20,  
    paddingVertical: 15, 
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1, 
    borderColor: "#ddd", 
    marginBottom: 60,  // 🔥 버튼이 BottomTab 위로 올라오도록 조정
  }
  
});

export default ProfileEditScreen;
