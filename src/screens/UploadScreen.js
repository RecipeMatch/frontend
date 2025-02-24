import React, { useContext, useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { UploadContext } from "../context/UploadContext";
import { getAuth } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

const UploadScreen = () => {
  const navigation = useNavigation();
  const {
    foodName, setFoodName,
    description, setDescription,
    image, setImage,
    category, setCategory // ✅ 카테고리 추가
  } = useContext(UploadContext);

  const [userUid, setUserUid] = useState(null); // ✅ 사용자 UID 상태 추가

  const [cookingDuration, setCookingDuration] = useState(30);

  // ✅ Firebase에서 현재 로그인된 사용자 UID 가져오기
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserUid(user.uid);
    } else {
      console.error("사용자가 로그인되지 않았습니다.");
    }
  }, []);

  // 📷 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // 📌 Android 하드웨어 뒤로가기 버튼 설정
  const backAction = useCallback(() => {
    navigation.navigate("Home");
    return true;
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [backAction]);

  const categoryOptions = [
    { label: "한식", value: "KOREAN" },
    { label: "양식", value: "WESTERN" },
    { label: "중식", value: "CHINESE" },
    { label: "일식", value: "JAPANESE" }
  ];
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* 상태바 */}
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      {/* 🔴 Cancel 버튼 */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.cancelText}>취소</Text>
      </TouchableOpacity>

      {/* 📌 페이지 표시 */}
      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>1/2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 📷 이미지 업로드 */}
        <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={50} color="#ccc" />
              <Text style={styles.imageUploadText}>사진을 추가하세요.</Text>
              <Text style={styles.imageUploadSubText}>(최대 12MB)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 🍽️ 음식 이름 입력 */}
        <Text style={styles.label}>음식 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="음식 이름을 입력하세요."
          value={foodName}
          onChangeText={setFoodName}
        />

        {/* 📝 요리 설명 입력 */}
        <Text style={styles.label}>설명</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="음식에 대한 간단한 설명을 입력하세요."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* ⏳ 조리 시간 선택 */}
        <Text style={styles.label}>요리 시간 (5분 단위)</Text>
          <Slider
            value={cookingDuration}
            onValueChange={setCookingDuration}
            minimumValue={10}
            maximumValue={60}
            step={5}
            trackStyle={{ height: 5, backgroundColor: '#ccc' }}
            thumbStyle={{
              width: 20,
              height: 20,
              backgroundColor: "#1FCC79",
            }}
            minimumTrackTintColor="#1FCC79"
            maximumTrackTintColor="#ccc"
          />
        <Text style={styles.sliderValue}>{cookingDuration ?? 30} 분</Text>

        {/* ✅ 카테고리 선택 UI */}
        <Text style={styles.label}>카테고리</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker} // ✅ 스타일 추가
          >
            {categoryOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </ScrollView>

      {/* ✅ Next 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("UploadScreen2")}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  scrollContainer: { flexGrow: 1, paddingBottom: 100 },
  cancelButton: {
    position: "absolute",
    top: StatusBar.currentHeight || 20,
    left: 20,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10,
  },
  cancelText: { fontSize: 16, fontWeight: "bold", color: "red" },
  pageIndicator: {
    position: "absolute",
    top: StatusBar.currentHeight || 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10,
  },
  pageIndicatorText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  imageUploadBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    height: 200,
    backgroundColor: "#FAFAFA",
    marginTop: 80,
  },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginTop: 5,
    backgroundColor: "#F7F7F7",
  },
  nextButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#1FCC79",
    padding: 15,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    elevation: 5,
    zIndex: 10,
  },
  nextButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  pickerContainer: {
    width: "100%",  // ✅ 너비 전체 사용
    height: 60,  // ✅ 높이 늘리기
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#F7F7F7",
    justifyContent: "center", // ✅ 내용 가운데 정렬
    paddingHorizontal: 15,  // ✅ 내부 여백 추가
  },
  picker: {
    width: "100%",
    height: "100%", // ✅ 컨테이너 높이에 맞춤
    fontSize: 18,
  },
});

export default UploadScreen;
