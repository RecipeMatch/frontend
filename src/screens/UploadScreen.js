import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import BottomTab from "../../components/BottomTab";

const UploadScreen = () => {
  const navigation = useNavigation();
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [cookingDuration, setCookingDuration] = useState(30);
  const [image, setImage] = useState(null);

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

  return (
    <View style={styles.container}>
      {/* 상단 취소 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      {/* 1/2 단계 표시 */}
      <Text style={styles.stepText}>1/2</Text>

      {/* 이미지 업로드 */}
      <TouchableOpacity style={styles.imageUploadBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={40} color="#ccc" />
            <Text style={styles.imageUploadText}>Add Cover Photo</Text>
            <Text style={styles.imageUploadSubText}>(up to 12 Mb)</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 요리 이름 입력 */}
      <Text style={styles.label}>Food Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter food name"
        value={foodName}
        onChangeText={setFoodName}
      />

      {/* 요리 설명 입력 */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Tell a little about your food"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 조리 시간 선택 */}
      <Text style={styles.label}>Cooking Duration (in minutes)</Text>
      <Slider
        value={cookingDuration || 30} // ✅ 기본값을 직접 설정
        onValueChange={setCookingDuration}
        minimumValue={10}
        maximumValue={60}
        step={5}
        minimumTrackTintColor="#1FCC79"
        maximumTrackTintColor="#ccc"
      />
      <Text style={styles.sliderValue}>{cookingDuration} min</Text>

      {/* 다음 단계 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={() => console.log("Next Step")}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      <BottomTab />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  cancelButton: { position: "absolute", top: 40, left: 20 },
  cancelText: { fontSize: 18, color: "red", fontWeight: "bold" },
  stepText: { position: "absolute", top: 40, right: 20, fontSize: 16, fontWeight: "bold" },
  imageUploadBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
    marginTop: 80,
  },
  imagePreview: { width: "100%", height: 150, borderRadius: 10 },
  imageUploadText: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  imageUploadSubText: { fontSize: 12, color: "#777" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  textArea: { height: 80 },
  slider: { marginTop: 10 },
  sliderValue: { fontSize: 16, textAlign: "center", marginTop: 5 },
  nextButton: {
    backgroundColor: "#1FCC79",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  nextButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default UploadScreen;
