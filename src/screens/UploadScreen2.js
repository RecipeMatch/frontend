import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UploadContext } from "../context/UploadContext";

const UploadScreen2 = () => {
  const navigation = useNavigation();
  const { ingredients, setIngredients, equipment, setEquipment, steps, setSteps } = useContext(UploadContext);

  // 🥦 재료 추가
  const addIngredient = () => setIngredients([...ingredients, ""]);

  // 🔧 도구 추가
  const addEquipment = () => setEquipment([...equipment, ""]);

  // 입력값 변경 핸들러
  const updateIngredient = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const updateEquipment = (text, index) => {
    const newEquipment = [...equipment];
    newEquipment[index] = text;
    setEquipment(newEquipment);
  };

  // 🏠 홈 화면으로 이동 (스택 초기화)
  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 상태바 */}
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      {/* 고정된 페이지 표시 */}
      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>2/2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🥦 재료 입력 */}
        <Text style={styles.label}>재료</Text>
        {ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="재료를 입력하세요."
            value={ingredient}
            onChangeText={(text) => updateIngredient(text, index)}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>재료추가</Text>
        </TouchableOpacity>

        {/* 🔧 도구 입력 */}
        <Text style={styles.label}>도구</Text>
        {equipment.map((item, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="도구를 입력하세요."
            value={item}
            onChangeText={(text) => updateEquipment(text, index)}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addEquipment}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>도구추가</Text>
        </TouchableOpacity>

        {/* 📝 요리 순서 입력 */}
        <Text style={styles.label}>요리 순서</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="요리 순서를 입력하세요."
          value={steps}
          onChangeText={setSteps}
          multiline
        />
      </ScrollView>

      {/* ✅ 하단 네비게이션 버튼 (Back & Next) */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={navigateToHome}>
          <Text style={styles.nextButtonText}>업로드</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: StatusBar.currentHeight || 20 },

  /* 스크롤 컨테이너 */
  scrollContainer: { flexGrow: 1, paddingBottom: 100, justifyContent: "flex-start" },

  /* 고정된 페이지 인디케이터 */
  pageIndicator: {
    position: "absolute",
    top: StatusBar.currentHeight || 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 3,
    zIndex: 10,
  },
  pageIndicatorText: { fontSize: 14, fontWeight: "bold", color: "#000" },

  /* 입력 필드 스타일 */
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    height: 50,
    marginTop: 10,
    backgroundColor: "#F7F7F7",
  },
  textArea: { height: 120 },

  /* 추가 버튼 */
  addButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#1FCC79", marginLeft: 5 },

  /* 네비게이션 버튼 컨테이너 (✅ 중앙 정렬) */
  navContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "110%",
    paddingHorizontal: 20,
  },

  /* Back 버튼 */
  backButton: {
    backgroundColor: "rgb(255, 255, 255)",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  backButtonText: { fontSize: 18, color: "#000", fontWeight: "bold" },

  /* Next 버튼 */
  nextButton: {
    backgroundColor: "#1FCC79",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  nextButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default UploadScreen2;
