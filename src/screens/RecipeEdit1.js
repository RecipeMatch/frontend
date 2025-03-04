import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const RecipeEdit1 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params;

  // 기존 레시피 값으로 상태 설정
  const [foodName, setFoodName] = useState(recipe.recipeName);
  const [description, setDescription] = useState(recipe.description);
  const [image, setImage] = useState(recipe.imageUrls?.[0] || null);
  const [category, setCategory] = useState(recipe.category);
  const [cookingDuration, setCookingDuration] = useState(recipe.cookingTime);

  // 슬라이더 UI 상태 관리
  const [localDuration, setLocalDuration] = useState(cookingDuration);

  // 이미지 선택
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleNextPress = () => {
    navigation.navigate("RecipeEdit2", {
      recipe,
      foodName,
      description,
      cookingDuration,
      category,
      image,
    });
  };

  const categoryOptions = [
    { label: "한식", value: "KOREAN" },
    { label: "양식", value: "WESTERN" },
    { label: "중식", value: "CHINESE" },
    { label: "일식", value: "JAPANESE" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      
      {/* 취소 버튼 */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>취소</Text>
      </TouchableOpacity>

      {/* 페이지 표시 */}
      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>1/2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 이미지 업로드 */}
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

        {/* 음식 이름 입력 */}
        <Text style={styles.label}>음식 이름</Text>
        <TextInput
          style={styles.input}
          placeholder="음식 이름을 입력하세요."
          value={foodName}
          onChangeText={setFoodName}
        />

        {/* 설명 입력 */}
        <Text style={styles.label}>설명</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="음식에 대한 간단한 설명을 입력하세요."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* 요리 시간 (슬라이더) */}
        <Text style={styles.label}>요리 시간 (5분 단위)</Text>
        <Slider
          value={localDuration}
          onValueChange={setLocalDuration}
          onSlidingComplete={(value) => {
            setLocalDuration(value);
            setCookingDuration(value);
          }}
          minimumValue={5}
          maximumValue={180}
          step={5}
          style={styles.slider}
          minimumTrackTintColor="#1FCC79"
          maximumTrackTintColor="#ccc"
          trackStyle={{ height: 4 }}
          thumbStyle={{
            height: 24,
            width: 24,
            backgroundColor: "#1FCC79",
            borderRadius: 12,
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
        <Text style={styles.sliderValue}>{localDuration} 분</Text>

        {/* 카테고리 선택 */}
        <Text style={styles.label}>카테고리</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            {categoryOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
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
  imageUploadText: { marginTop: 10, fontSize: 16, color: "#777" },
  imageUploadSubText: { fontSize: 12, color: "#999" },
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
  textArea: { minHeight: 80 },
  sliderValue: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
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
  picker: { width: "100%", height: "100%", fontSize: 18 },
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

export default RecipeEdit1;
