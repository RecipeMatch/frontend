import React, { useContext, useEffect } from "react";
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
import { Slider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { UploadContext } from "../context/UploadContext"; 

const UploadScreen = () => {
  const navigation = useNavigation();
  const { foodName, setFoodName, description, setDescription, cookingDuration, setCookingDuration, image, setImage } =
    useContext(UploadContext); 

  // 📷 이미지 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 📌 Android의 하드웨어 뒤로가기 버튼을 홈 화면으로 이동하게 설정
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home");
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 상태바 */}
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      {/* 🔴 Cancel 버튼 (왼쪽 상단) */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.cancelText}>취소</Text>
      </TouchableOpacity>

      {/* 📌 고정된 페이지 표시 */}
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
              <Text style={styles.imageUploadSubText}>(up to 12 Mb)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 🍽️ 요리 이름 입력 */}
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
          value={cookingDuration || 30}
          onValueChange={setCookingDuration}
          minimumValue={10}
          maximumValue={60}
          step={5}
          minimumTrackTintColor="#1FCC79"
          maximumTrackTintColor="#ccc"
          thumbStyle={styles.sliderThumb}
        />
        <Text style={styles.sliderValue}>{cookingDuration} 분</Text>
      </ScrollView>

      {/* ✅ Next 버튼 (고정) */}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate("UploadScreen2")}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },

  /* 🏷️ 스크롤 컨테이너 */
  scrollContainer: { flexGrow: 1, paddingBottom: 100 },

  /* ❌ Cancel 버튼 (홈으로 이동) */
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

  /* 📌 페이지 인디케이터 */
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

  /* 📷 이미지 업로드 스타일 */
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
  imageUploadText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  imageUploadSubText: { fontSize: 12, color: "#777" },

  /* 입력 필드 스타일 */
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
  textArea: { height: 100 },

  /* ⏳ 슬라이더 스타일 */
  sliderValue: { fontSize: 16, textAlign: "center", marginTop: 5, fontWeight: "bold", color: "#333" },
  sliderThumb: {
    width: 20,
    height: 20,
    backgroundColor: "#1FCC79",
    borderRadius: 50,
  },

  /* ✅ Next 버튼 */
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
});

export default UploadScreen;
