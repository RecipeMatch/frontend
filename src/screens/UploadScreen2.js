import React, { useContext, useState, useEffect } from "react";
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
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UploadContext } from "../context/UploadContext";
import { getAuth } from "firebase/auth";
import SuccessModal from "./SuccessModal";

const UploadScreen2 = () => {
  const navigation = useNavigation();
  const {
    ingredients, setIngredients,
    equipment, setEquipment,
    steps, setSteps,
    foodName, description, cookingDuration, image, category
  } = useContext(UploadContext);

  const [userUid, setUserUid] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserUid(user.uid);
    } else {
      console.error("사용자가 로그인되지 않았습니다.");
    }
  }, []);

  // ✅ `steps`가 undefined일 경우 빈 배열로 변환
  const safeSteps = Array.isArray(steps) ? steps : [];

  const uploadRecipe = async () => {
    console.log("📤 업로드 버튼이 눌렸습니다."); // ✅ 요청 시작 확인

    if (!userUid) {
      Alert.alert("로그인 필요", "레시피 등록을 위해 로그인해야 합니다.");
      return;
    }

    const formattedIngredients = ingredients.map(item => ({
      ingredientName: item,
    }));

    const formattedSteps = safeSteps.map((step, index) => ({
      stepOrder: index + 1,
      description: step,
    }));

    const categoryMapping = {
      "한식": "KOREAN",
      "양식": "WESTERN",
      "중식": "CHINESE",
      "일식": "JAPANESE"
    };
    
    const recipeData = {
      userUid,
      recipeName: foodName,
      description,
      cookingTime: cookingDuration,
      category: categoryMapping[category] || category, // 한글이 오면 매핑된 영어로 변환
      recipeIngredientDtos: formattedIngredients,
      recipeStepDtos: formattedSteps,
      toolName: equipment,
    };

    console.log("📡 서버로 전송할 데이터:", JSON.stringify(recipeData, null, 2)); // ✅ 요청 데이터 확인

    try {   
      const response = await fetch("http://10.0.2.2:8080/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(recipeData),
      });

      console.log("✅ 서버 응답 코드:", response.status);
      const responseText = await response.text();
      console.log("✅ 서버 응답 내용:", responseText);
    
      if (response.ok) {
        setSuccessModalVisible(true);
      } else {
        Alert.alert("업로드 실패", `오류 코드: ${response.status}\n서버 응답: ${responseText}`);
      }
    } catch (error) {
      console.error("❌ fetch() 요청 중 오류 발생:", error.message);
      Alert.alert("네트워크 오류", `서버에 연결할 수 없습니다.\n오류: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>2/2</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* 🥕 재료 입력 */}
        <Text style={styles.label}>재료</Text>
        {ingredients.map((ingredient, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="재료를 입력하세요."
            value={ingredient}
            onChangeText={(text) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = text;
              setIngredients(newIngredients);
            }}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => setIngredients([...ingredients, ""])}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>재료 추가</Text>
        </TouchableOpacity>

        {/* 🔪 도구 입력 */}
        <Text style={styles.label}>도구</Text>
        {equipment.map((item, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder="도구를 입력하세요."
            value={item}
            onChangeText={(text) => {
              const newEquipment = [...equipment];
              newEquipment[index] = text;
              setEquipment(newEquipment);
            }}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => setEquipment([...equipment, ""])}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>도구 추가</Text>
        </TouchableOpacity>

        {/* 🍳 요리 순서 입력 */}
        <Text style={styles.label}>요리 순서</Text>
        {safeSteps.map((step, index) => (
          <TextInput
            key={index}
            style={[styles.input, styles.textArea]}
            placeholder={`요리 순서 ${index + 1}`}
            value={step}
            onChangeText={(text) => {
              const newSteps = [...safeSteps];
              newSteps[index] = text;
              setSteps(newSteps);
            }}
            multiline
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => setSteps([...safeSteps, ""])}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>순서 추가</Text>
        </TouchableOpacity>

      </ScrollView>


      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={uploadRecipe}>
          <Text style={styles.nextButtonText}>업로드</Text>
        </TouchableOpacity>

        {/* ✅ 모달 컴포넌트 추가 ✅ */}
        <SuccessModal
          visible={successModalVisible}
          onClose={() => {
            setSuccessModalVisible(false);
            navigation.navigate("Home"); // ✅ 홈으로 이동
          }}
      />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: StatusBar.currentHeight || 20 },

  scrollContainer: { flexGrow: 1, paddingBottom: 100, justifyContent: "flex-start" },

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

  addButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#1FCC79", marginLeft: 5 },

  /* ✅ 하단 버튼 정렬 조정 ✅ */
  navContainer: {
    position: "absolute",
    bottom: 20,
    left: 20, // 왼쪽 여백
    right: 20, // 오른쪽 여백
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    flex: 1,
    marginRight: 10, // 버튼 사이 간격
    backgroundColor: "#F5F5F5", // 좀 더 자연스러운 밝은 색상
    paddingVertical: 14, // 버튼 크기 살짝 조정
    borderRadius: 12, // 둥근 모서리 좀 더 강조
    shadowColor: "#000", // 그림자 효과 추가
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android 그림자
    alignItems: "center",
  },
  backButtonText: { 
    fontSize: 18, 
    color: "#333", // 너무 검지 않도록 조정
    fontWeight: "600", // 조금 더 두꺼운 글씨
  },

  nextButton: {
    flex: 1,
    backgroundColor: "#1FCC79",
    paddingVertical: 14, // 버튼 크기 살짝 조정
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  nextButtonText: { 
    fontSize: 18, 
    color: "#fff", 
    fontWeight: "700", // 버튼 강조 효과
    letterSpacing: 0.5, // 글자 간격 살짝 추가
  },

  /* ✅ 업로드 성공 모달 ✅ */
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // ✅ 중앙 정렬 유지
    backgroundColor: "rgba(0,0,0,0.5)",
    width: "100%",  // ✅ 너비를 화면 전체로 설정
    height: "100%", // ✅ 높이도 전체로 설정
    position: "absolute", // ✅ 위치 고정
    top: 0,
    left: 0,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",  // ✅ 모달 너비를 80%로 조정
    maxWidth: 350, // ✅ 너무 넓어지지 않도록 제한
  },  
  modalEmoji: { fontSize: 50 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalButton: {
    backgroundColor: "#1FCC79",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: 200,  // ✅ 버튼 너비를 고정
    alignItems: "center",
  },
  modalButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default UploadScreen2;
