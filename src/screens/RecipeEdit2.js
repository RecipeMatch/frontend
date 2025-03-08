import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import RNFetchBlob from "react-native-blob-util";
import { Ionicons } from "@expo/vector-icons";

const RecipeEdit2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe, foodName, description, cookingDuration, category, image } = route.params;

  // 기존 레시피 데이터 기반으로 상태값 설정
  const [ingredients, setIngredients] = useState(recipe.recipeIngredientDtos.map(i => i.ingredientName));
  const [equipment, setEquipment] = useState(recipe.toolName);
  const [steps, setSteps] = useState(recipe.recipeStepDtos.map(s => s.content));

  // 재료 추가 & 삭제
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      Alert.alert("경고", "최소 1개의 재료는 필요합니다.");
    }
  };

  // 도구 추가 & 삭제
  const addEquipment = () => setEquipment([...equipment, ""]);
  const removeEquipment = (index) => {
    if (equipment.length > 1) {
      setEquipment(equipment.filter((_, i) => i !== index));
    } else {
      Alert.alert("경고", "최소 1개의 도구는 필요합니다.");
    }
  };

  // 요리 순서 추가 & 삭제
  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    } else {
      Alert.alert("경고", "최소 1개의 요리 순서는 필요합니다.");
    }
  };

  // 레시피 수정 요청
  const updateRecipe = async () => {
    try {
      Alert.alert("수정 확인", "레시피를 수정하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "수정",
          style: "default",
          onPress: async () => {
            const recipeData = {
              recipeName: foodName,
              description,
              cookingTime: cookingDuration,
              category,
              recipeIngredientDtos: ingredients.map(ingredient => ({ ingredientName: ingredient })),
              recipeStepDtos: steps.map((step, index) => ({ stepOrder: index + 1, content: step })),
              toolName: equipment,
            };

            const data = [{ name: "request", data: JSON.stringify(recipeData), type: "application/json" }];
            if (image && image !== recipe.imageUrls?.[0]) {
              data.push({
                name: "files",
                filename: "update.jpg",
                type: "image/jpeg",
                data: RNFetchBlob.wrap(image),
              });
            }

            const res = await RNFetchBlob.fetch("PATCH", `${API_BASE_URL}/api/recipe/${recipe.id}`, {
              "Content-Type": "multipart/form-data",
            }, data);

            if (res.respInfo?.status >= 200 && res.respInfo?.status < 300) {
              Alert.alert("수정 완료", "레시피가 성공적으로 수정되었습니다.");
            
              navigation.reset({
                index: 2, // 0-based index, 세 번째 화면(MyRecipeList)이 맨 위가 됨
                routes: [
                  { name: "Home" },       // 0번째
                  { name: "Profile" },  // 1번째
                  { name: "MyRecipeList" } // 2번째 (현재 화면)
                ],
              });
            } else {
              Alert.alert("수정 실패", "서버 오류가 발생했습니다.");
            }                       
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "레시피 수정 중 문제가 발생했습니다.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🥕 재료 입력 */}
      <Text style={styles.label}>재료</Text>
      {ingredients.map((ingredient, index) => (
        <View key={index} style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="재료 입력"
            value={ingredient}
            onChangeText={(text) => {
              const newIngredients = [...ingredients];
              newIngredients[index] = text;
              setIngredients(newIngredients);
            }}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeIngredient(index)}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
        <Ionicons name="add-outline" size={20} color="#1FCC79" />
        <Text style={styles.addButtonText}>재료 추가</Text>
      </TouchableOpacity>

      {/* 🔪 도구 입력 */}
      <Text style={styles.label}>도구</Text>
      {equipment.map((tool, index) => (
        <View key={index} style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="도구 입력"
            value={tool}
            onChangeText={(text) => {
              const newEquipment = [...equipment];
              newEquipment[index] = text;
              setEquipment(newEquipment);
            }}
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeEquipment(index)}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addEquipment}>
        <Ionicons name="add-outline" size={20} color="#1FCC79" />
        <Text style={styles.addButtonText}>도구 추가</Text>
      </TouchableOpacity>

      {/* 🍳 요리 순서 입력 */}
      <Text style={styles.label}>요리 순서</Text>
      {steps.map((step, index) => (
        <View key={index} style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`요리 순서 ${index + 1}`}
            value={step}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[index] = text;
              setSteps(newSteps);
            }}
            multiline
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeStep(index)}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={addStep}>
        <Ionicons name="add-outline" size={20} color="#1FCC79" />
        <Text style={styles.addButtonText}>순서 추가</Text>
      </TouchableOpacity>

      {/* 수정 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={updateRecipe}>
        <Text style={styles.saveButtonText}>수정 완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 14, fontSize: 18, marginTop: 5 },
  textArea: { minHeight: 80 },
  addButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#1FCC79", marginLeft: 5 },
  deleteButton: { marginLeft: 10, marginTop: 5 },
  saveButton: { backgroundColor: "#1FCC79", padding: 15, borderRadius: 15, alignItems: "center", marginTop: 20 },
  saveButtonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default RecipeEdit2;
