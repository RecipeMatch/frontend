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
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "@env";
import BottomTab from "../components/BottomTab";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Audio } from "expo-av";
import { OPENAI_API_KEY } from "@env"; // OpenAI API 키
import * as FileSystem from "expo-file-system";

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

const TOOL_OPTIONS = [
  { label: "전자레인지", value: "전자레인지" },
  { label: "오븐", value: "오븐" },
  { label: "냄비", value: "냄비" },
  { label: "밥솥", value: "밥솥" },
  { label: "팬", value: "팬" },
  { label: "수저", value: "수저" },
  { label: "칼", value: "칼" },
  { label: "도마", value: "도마" },
  { label: "체", value: "체" },
  { label: "주걱", value: "주걱" },
  { label: "집게", value: "집게" },
  { label: "믹서", value: "믹서" },
  { label: "볼", value: "볼" },
  { label: "주방용 가위", value: "주방용 가위" },
  { label: "그릇", value: "그릇" },
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
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");

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

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("마이크 권한이 필요합니다.");
        return;
      }
  
      // 기존 recording 객체가 있으면 stop하고 null로 초기화
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
  
      setRecording(newRecording);
      console.log("🎙️ 녹음 시작됨");
    } catch (err) {
      console.error("🎤 녹음 시작 실패:", err);
    }
  };
  

  const stopRecording = async () => {
    try {
      setLoading(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("✅ 녹음된 파일:", uri);
      uploadToWhisper(uri);
    } catch (err) {
      console.error("🛑 녹음 중지 실패:", err);
    } finally {
      setRecording(null);
    }
  };

  const uploadToWhisper = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileBlob = {
        uri: fileInfo.uri,
        name: "voice.m4a",
        type: "audio/m4a",
      };
  
      const formData = new FormData();
      formData.append("file", fileBlob);
      formData.append("model", "whisper-1");
  
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      const result = await response.json();
if (result.text) {
  setTranscript(result.text);

  const newIngredients = result.text
    .split(",")
    .map((item) => item.trim()) // 공백 제거
    .filter((item) => item.length > 0); // 빈 문자열 제거

  setIngredientNames((prev) => {
    const combined = [...prev, ...newIngredients];
    const unique = Array.from(new Set(combined)); // 중복 제거
    return unique;
  });

} else {
  Alert.alert("⚠️ 음성 인식 실패", JSON.stringify(result));
}

    } catch (err) {
      console.error("🔁 Whisper 업로드 실패:", err);
      Alert.alert("에러", "음성 인식 도중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="닉네임을 입력하세요." />

          <Text style={styles.label}>전화번호</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="전화번호를 입력하세요." />

          <Text style={styles.label}>알레르기 음식</Text>
          <View style={styles.pickerContainer}>
            <Picker
              key={pickerKey}
              selectedValue={""}
              onValueChange={(value) => {
                if (value !== "") {
                  if (allergyNames.includes(value)) {
                    Alert.alert("⚠️ 중복 항목", "이미 선택한 항목입니다.");
                  } else {
                    setAllergyNames((prev) => [...prev, value]);
                    setPickerKey((prev) => prev + 1);
                  }
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

          <Text style={styles.label}>보유한 도구</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={""}
              onValueChange={(value) => {
                if (value !== "") {
                  if (toolNames.includes(value)) {
                    Alert.alert("⚠️ 중복 항목", "이미 선택한 도구입니다.");
                  } else {
                    setToolNames((prev) => [...prev, value]);
                    setPickerKey((prev) => prev + 1);
                  }
                }
              }}
            >
              <Picker.Item label="도구를 선택하세요" value="" />
              {TOOL_OPTIONS.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

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

          <Text style={styles.label}>주로 사용하는 재료</Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
  <TouchableOpacity
    onPress={recording ? stopRecording : startRecording}
    style={[styles.addButton, { marginRight: 10 }]}
  >
    <Text style={styles.addButtonText}>
      {recording ? "녹음 중지" : "음성으로 입력"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => addItem(setIngredientNames)}
    style={styles.addButton}
  >
    <Text style={styles.addButtonText}>재료 추가하기</Text>
  </TouchableOpacity>
</View>




{ingredientNames.map((item, index) => (
  <View key={index} style={styles.selectedRow}>
    <View style={styles.selectedItemBox}>
    <TextInput
  value={item}
  onChangeText={(text) => {
    setIngredientNames((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  }}
  style={styles.ingredientInput} // 여기!!
  placeholder="재료를 입력하세요"
/>

    </View>
    <TouchableOpacity onPress={() => removeItem(setIngredientNames, index)}>
      <Ionicons name="trash-outline" size={24} color="red" />
    </TouchableOpacity>
  </View>
))}


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
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
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
    backgroundColor: "#E0F5EC",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#1FCC79",
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
  ingredientInput: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  
});

export default ProfileEditScreen;
