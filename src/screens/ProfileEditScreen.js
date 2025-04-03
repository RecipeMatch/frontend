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
  StatusBar
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "@env";
import BottomTab from "../components/BottomTab";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

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

const ProfileEditScreen = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber || "");
  const [allergyNames, setAllergyNames] = useState(userInfo?.allergyNames || []);
  const [toolNames, setToolNames] = useState(userInfo?.toolNames || []);
  const [ingredientNames, setIngredientNames] = useState(userInfo?.ingredientNames || []);
  const [pickerKey, setPickerKey] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}> 
          <AntDesign name="arrowleft" size={24} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        if (userEmail) await AsyncStorage.setItem("userEmail", userEmail);
      }

      if (!userToken || !userEmail) {
        Alert.alert("❌ 오류", "로그인이 필요합니다. 다시 로그인해주세요.");
        return;
      }

      const updatedProfile = {
        uid: userEmail,
        nickname,
        phoneNumber,
        allergyNames: allergyNames.filter((item) => item.trim() !== ""),
        toolNames: toolNames.filter((item) => item.trim() !== ""),
        ingredientNames: ingredientNames.filter((item) => item.trim() !== ""),
      };

      const response = await axios.put(`${API_BASE_URL}/api/users/updateInfo`, updatedProfile, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
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
      console.error("❌ 프로필 업데이트 중 오류:", error);
      Alert.alert("❌ 오류", "프로필 업데이트에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}> 닉네임</Text>
          <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="닉네임을 입력하세요." />

          <Text style={styles.label}> 전화번호</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="전화번호를 입력하세요." />

          <Text style={styles.label}> 알레르기 음식</Text>
          <View style={styles.pickerContainer}>
            <Picker
              key={pickerKey} // key가 변경되면 Picker가 새로 마운트됨
              selectedValue={""} // 항상 빈 문자열을 선택값으로 고정
              onValueChange={(value) => {
                if (value !== "") {
                  setAllergyNames((prev) => [...prev, value]);
                  // Picker를 재렌더링하기 위해 key 값을 변경합니다.
                  setPickerKey((prevKey) => prevKey + 1);
                }
              }}
            >
              <Picker.Item label="알레르기를 선택하세요" value="" />
              {ALLERGY_OPTIONS.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          {allergyNames.map((item, index) => {
            const label = ALLERGY_OPTIONS.find(opt => opt.value === item)?.label || item;
            return (
              <View key={index} style={styles.selectedRow}>
                <View style={styles.selectedItemBox}>
                  <Text style={styles.selectedItem}>{label}</Text>
                </View>
                <TouchableOpacity onPress={() => removeItem(setAllergyNames, index)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            );
          })}

          <Text style={styles.label}> 보유한 도구</Text>
          {toolNames.map((item, index) => (
            <View key={index} style={styles.selectedRow}>
              <View style={styles.selectedItemBox}>
                <Text style={styles.selectedItem}>{item}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(setToolNames, index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addItem(setToolNames)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>

          <Text style={styles.label}> 주로 사용하는 재료</Text>
          {ingredientNames.map((item, index) => (
            <View key={index} style={styles.selectedRow}>
              <View style={styles.selectedItemBox}>
                <Text style={styles.selectedItem}>{item}</Text>
              </View>
              <TouchableOpacity onPress={() => removeItem(setIngredientNames, index)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addItem(setIngredientNames)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+ 추가</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleUpdate} style={styles.button}>
            <Text style={styles.buttonText}>수정 완료</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 10,
    backgroundColor: "#fff",
  },  
  scrollContainer: { flexGrow: 1, paddingBottom: 180 },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 0,
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginTop: 10,
    backgroundColor: "#F7F7F7",
    flex: 1,
  },
  pickerContainer: {
    width: "100%",
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  picker: {
    width: "100%",
    height: "100%",
    fontSize: 18,
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  selectedItemBox: {
    flex: 1,
  },
  selectedItem: {
    fontSize: 16,
  },
  addButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#E0F5EC",  // ✅ 연보라 예시
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#1FCC79",  // 조금 진한 보라 글씨
    fontWeight: "bold",
  },
  
  button: {
    backgroundColor: "#1FCC79",
    padding: 15,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 100,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileEditScreen;
