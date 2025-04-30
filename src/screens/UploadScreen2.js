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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UploadContext } from "../context/UploadContext";
import { getAuth } from "firebase/auth";
import SuccessModal from "./SuccessModal";
import { API_BASE_URL } from "@env"; 
import RNFetchBlob from 'react-native-blob-util';

const UploadScreen2 = () => {
  const navigation = useNavigation();
  const {
    ingredients, setIngredients,
    equipment, setEquipment,
    steps, setSteps,
    foodName, description, cookingDuration, image, category, resetUpload
  } = useContext(UploadContext);

  const [userUid, setUserUid] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  // 추가된 state: 서버로부터 받은 알레르기 정보와 대체 도구 정보
  const [allergyInfo, setAllergyInfo] = useState(null);
  const [alternativeToolInfo, setAlternativeToolInfo] = useState(null);

  // 로그인 사용자 UID(이메일) 가져오기
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      console.log("로그인된 사용자:", user.email);
      setUserUid(user.email);
    } else {
      console.error("사용자가 로그인되지 않았습니다.");
    }
  }, []);

  // 각 배열이 비어있으면 기본적으로 1칸씩 채워주기
  useEffect(() => {
    if (ingredients.length === 0) {
      setIngredients([{ ingredientName: "", quantity: "" }]);
    }
    if (equipment.length === 0) {
      setEquipment([""]);
    }
    if (!Array.isArray(steps) || steps.length === 0) {
      setSteps([""]);
    }
  }, []);

  // steps가 undefined일 경우 안전하게 처리
  const safeSteps = Array.isArray(steps) ? steps : [];

  // 재료 추가
  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientName: "", quantity: "" }]);
  };
  // 재료 삭제
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    } else {
      Alert.alert("안내", "최소 1개 이상의 재료가 필요합니다.");
    }
  };

  // 도구 추가
  const addEquipment = () => {
    setEquipment([...equipment, ""]);
  };
  // 도구 삭제
  const removeEquipment = (index) => {
    if (equipment.length > 1) {
      const newEquipment = [...equipment];
      newEquipment.splice(index, 1);
      setEquipment(newEquipment);
    } else {
      Alert.alert("안내", "최소 1개 이상의 도구가 필요합니다.");
    }
  };

  // 요리 순서 추가
  const addStep = () => {
    setSteps([...safeSteps, ""]);
  };
  // 요리 순서 삭제
  const removeStep = (index) => {
    if (safeSteps.length > 1) {
      const newSteps = [...safeSteps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    } else {
      Alert.alert("안내", "최소 1개 이상의 요리 순서가 필요합니다.");
    }
  };

  // 레시피 업로드
  const uploadRecipe = async () => {
    console.log("📤 업로드 버튼이 눌렸습니다.");

    if (!userUid) {
      Alert.alert("로그인 필요", "레시피 등록을 위해 로그인해야 합니다.");
      return;
    }

    const formattedIngredients = ingredients.map(item => ({
      ingredientName: item.ingredientName,
      quantity: item.quantity,
    }));

    const formattedSteps = safeSteps.map((step, index) => ({
      stepOrder: index + 1,
      content: step,
    }));

    const categoryMapping = {
      "한식": "KOREAN",
      "중식": "CHINESE",
      "일식": "JAPANESE",
      "양식": "WESTERN",
      "동남아시아": "SOUTHEAST_ASIAN",
      "이탈리안": "ITALIAN",
      "퓨전": "FUSION",
      "기본": "DEFAULT",
    };
    
    
    const recipeData = {
      userUid: userUid,
      recipeName: foodName,
      description,
      cookingTime: cookingDuration,
      category: categoryMapping[category] || category, 
      recipeIngredientDtos: formattedIngredients,
      recipeStepDtos: formattedSteps,
      toolName: equipment,
    };

    console.log("API_BASE_URL:", API_BASE_URL);
    console.log("📡 서버로 전송할 데이터:", JSON.stringify(recipeData, null, 2));

    // rn-fetch-blob을 이용해 multipart/form-data 요청 구성
    const data = [
      {
        name: 'request',
        data: JSON.stringify(recipeData),
        type: 'application/json; charset=utf-8',
      }
    ];

    // 이미지가 있을 경우만 추가
    if (image) {
      data.push({
        name: 'files',
        filename: 'upload.jpg',
        type: 'image/jpeg',
        data: RNFetchBlob.wrap(image)
      });
    }
    
    try {
      const res = await RNFetchBlob.fetch(
        "POST",
        `${API_BASE_URL}/api/recipe`,
        { "Content-Type": "multipart/form-data" },
        data
      );
    
      let statusCode;
    
      if (res.respInfo && res.respInfo.status) {
        statusCode = res.respInfo.status;
      } else if (res.info && res.info().status) {
        statusCode = res.info().status;
      }
      if (!statusCode) {
        statusCode = 200;
      }
    
      const responseText = await res.text();
      console.log("✅ 서버 응답 내용:", responseText);
      
      // 서버가 JSON 형식으로 알레르기 및 대체 도구 정보를 반환한다고 가정
      let responseJSON = {};
      try {
        responseJSON = JSON.parse(responseText);
      } catch (err) {
        console.error("응답 파싱 실패:", err);
      }
      
      // 알레르기 정보와 대체 도구 정보를 state에 저장
      setAllergyInfo(responseJSON.allergyInfo || null);
      setAlternativeToolInfo(responseJSON.alternativeToolInfo || null);
    
      // 2xx 범위면 성공 처리
      if (statusCode >= 200 && statusCode < 300) {
        setSuccessModalVisible(true);
      } else {
        Alert.alert("업로드 실패", `오류 코드: ${statusCode}\n서버 응답: ${responseText}`);
      }
    } catch (error) {
      console.error("❌ rn-fetch-blob 요청 중 오류 발생:", error.message);
      Alert.alert("네트워크 오류", `서버에 연결할 수 없습니다.\n오류: ${error.message}`);
    }    
  };

  const onUploadSuccess = () => {
    resetUpload();
    setSuccessModalVisible(false);
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
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <View style={styles.pageIndicator}>
        <Text style={styles.pageIndicatorText}>2/2</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 재료 입력 */}
        
<Text style={styles.label}>재료</Text>
{ingredients.map((item, index) => (
  <View key={index} style={styles.inputRow}>
    <TextInput
      style={[styles.input, { flex: 1 }]}
      placeholder="재료명"
      value={item.ingredientName}
      onChangeText={(text) => {
        const newIngredients = [...ingredients];
        newIngredients[index].ingredientName = text;
        setIngredients(newIngredients);
      }}
    />
    <TextInput
      style={[styles.input, { flex: 1, marginLeft: 10 }]}
      placeholder="수량 (예: 1컵, 100g)"
      value={item.quantity}
      onChangeText={(text) => {
        const newIngredients = [...ingredients];
        newIngredients[index].quantity = text;
        setIngredients(newIngredients);
      }}
    />
    <TouchableOpacity
      onPress={() => removeIngredient(index)}
      style={styles.deleteButton}
    >
      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
    </TouchableOpacity>
  </View>
))}
<TouchableOpacity style={styles.addButton} onPress={addIngredient}>
  <Ionicons name="add-outline" size={20} color="#1FCC79" />
  <Text style={styles.addButtonText}>재료 추가</Text>
</TouchableOpacity>

        {/* 도구 입력 */}
        <Text style={styles.label}>도구</Text>
        {equipment.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="도구를 입력하세요."
              value={item}
              onChangeText={(text) => {
                const newEquipment = [...equipment];
                newEquipment[index] = text;
                setEquipment(newEquipment);
              }}
            />
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => removeEquipment(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addEquipment}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>도구 추가</Text>
        </TouchableOpacity>

        {/* 요리 순서 입력 */}
        <Text style={styles.label}>요리 순서</Text>
        {safeSteps.map((step, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
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
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => removeStep(index)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>순서 추가</Text>
        </TouchableOpacity>

        {/* 추가된 알레르기 및 대체 도구 정보 표시 영역 */}
        { (allergyInfo || alternativeToolInfo) && (
          <View style={styles.infoContainer}>
            {allergyInfo && (
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>알레르기 정보</Text>
                <Text style={styles.infoText}>{allergyInfo}</Text>
              </View>
            )}
            {alternativeToolInfo && (
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>대체 도구 정보</Text>
                <Text style={styles.infoText}>{alternativeToolInfo}</Text>
              </View>
            )}
          </View>
        )}

      </ScrollView>

      {/* 하단 네비게이션 영역 */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={uploadRecipe}>
          <Text style={styles.nextButtonText}>업로드</Text>
        </TouchableOpacity>
        <SuccessModal
            visible={successModalVisible}
            onClose={onUploadSuccess}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    paddingHorizontal: 20, 
    paddingTop: StatusBar.currentHeight || 20 
  },
  scrollContainer: { 
    flexGrow: 1, 
    paddingBottom: 150, 
    justifyContent: "flex-start" 
  },
  pageIndicator: { 
    position: "absolute", 
    top: StatusBar.currentHeight || 20, 
    right: 20, 
    backgroundColor: "rgba(255, 255, 255, 0.5)", 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 20, 
    elevation: 3, 
    zIndex: 10 
  },
  pageIndicatorText: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#000" 
  },
  label: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 20 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    borderRadius: 10, 
    padding: 14, 
    fontSize: 18, 
    marginTop: 10, 
    backgroundColor: "#F7F7F7" 
  },
  textArea: { 
    height: 120 
  },
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  addButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 10 
  },
  addButtonText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#1FCC79", 
    marginLeft: 5 
  },
  deleteButton: { 
    marginLeft: 10, 
    marginTop: 10 
  },
  navContainer: { 
    position: "absolute", 
    bottom: 20, 
    left: 20, 
    right: 20, 
    flexDirection: "row", 
    alignItems: "center" 
  },
  backButton: { 
    flex: 1, 
    marginRight: 10, 
    backgroundColor: "#F5F5F5", 
    paddingVertical: 14, 
    borderRadius: 12, 
    elevation: 3, 
    alignItems: "center"
  },
  backButtonText: { 
    fontSize: 18, 
    color: "#333", 
    fontWeight: "600" 
  },
  nextButton: { 
    flex: 1, 
    backgroundColor: "#1FCC79", 
    paddingVertical: 14, 
    borderRadius: 12, 
    elevation: 4, 
    alignItems: "center"
  },
  nextButtonText: { 
    fontSize: 18, 
    color: "#fff", 
    fontWeight: "700"
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
  },
  infoBox: {
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
});

export default UploadScreen2;
