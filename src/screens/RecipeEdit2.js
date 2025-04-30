import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import RNFetchBlob from "react-native-blob-util";

const RecipeEdit2 = ({ route }) => {
  const navigation = useNavigation();
  const { recipe } = route.params;

  const [ingredients, setIngredients] = useState(
    recipe.recipeIngredientDtos.map(i => ({
      ingredientName: i.ingredientName,
      quantity: i.quantity || ""
    }))
  );
  const [equipment, setEquipment] = useState(recipe.toolName || []);
  const [steps, setSteps] = useState(recipe.recipeStepDtos.map(step => step.content));
  const [allergyInfo, setAllergyInfo] = useState(null);
  const [alternativeToolInfo, setAlternativeToolInfo] = useState(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { ingredientName: "", quantity: "" }]);
  };
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    } else {
      Alert.alert("안내", "최소 1개 이상의 재료가 필요합니다.");
    }
  };

  const addEquipment = () => {
    setEquipment([...equipment, ""]);
  };
  const removeEquipment = (index) => {
    if (equipment.length > 1) {
      const newEquipment = [...equipment];
      newEquipment.splice(index, 1);
      setEquipment(newEquipment);
    } else {
      Alert.alert("안내", "최소 1개 이상의 도구가 필요합니다.");
    }
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };
  const removeStep = (index) => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    } else {
      Alert.alert("안내", "최소 1개 이상의 요리 순서가 필요합니다.");
    }
  };

  const updateRecipe = async () => {
    const formattedIngredients = ingredients.map(item => ({
      ingredientName: item.ingredientName,
      quantity: item.quantity
    }));

    const formattedSteps = steps.map((step, index) => ({
      stepOrder: index + 1,
      content: step,
    }));

    const data = [
      {
        name: "request",
        data: JSON.stringify({
          recipeIngredientDtos: formattedIngredients,
          recipeStepDtos: formattedSteps,
          toolName: equipment,
        }),
        type: "application/json"
      }
    ];

    try {
      const res = await RNFetchBlob.fetch(
        "PATCH",
        `${API_BASE_URL}/api/recipe/${recipe.id}`,
        { "Content-Type": "multipart/form-data" },
        data
      );

      const responseText = await res.text();
      let responseJSON = {};
      try {
        responseJSON = JSON.parse(responseText);
        console.log("🔍 파싱된 응답:", responseJSON);
      } catch (err) {
        console.error("응답 파싱 실패:", err);
      }

      setAllergyInfo(responseJSON.allergies?.length ? responseJSON.allergies.join(', ') : null);
      setAlternativeToolInfo(responseJSON.alterTools || null);

      if (res.info().status >= 200 && res.info().status < 300) {
        Alert.alert("성공", "레시피가 수정되었습니다.");
        navigation.reset({
          index: 2,
          routes: [
            { name: "Home" },
            { name: "Profile" },
            { name: "MyRecipeList" }
          ],
        });
      } else {
        Alert.alert("오류", "수정에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("오류", `서버 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>재료</Text>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="재료명"
              value={item.ingredientName}
              onChangeText={(text) => {
                const updated = [...ingredients];
                updated[index].ingredientName = text;
                setIngredients(updated);
              }}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 10 }]}
              placeholder="수량 (예: 1컵, 100g)"
              value={item.quantity}
              onChangeText={(text) => {
                const updated = [...ingredients];
                updated[index].quantity = text;
                setIngredients(updated);
              }}
            />
            <TouchableOpacity onPress={() => removeIngredient(index)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>재료 추가</Text>
        </TouchableOpacity>

        <Text style={styles.label}>도구</Text>
        {equipment.map((item, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="도구를 입력하세요."
              value={item}
              onChangeText={(text) => {
                const updated = [...equipment];
                updated[index] = text;
                setEquipment(updated);
              }}
            />
            <TouchableOpacity onPress={() => removeEquipment(index)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addEquipment}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>도구 추가</Text>
        </TouchableOpacity>

        <Text style={styles.label}>요리 순서</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={`요리 순서 ${index + 1}`}
              value={step}
              onChangeText={(text) => {
                const updated = [...steps];
                updated[index] = text;
                setSteps(updated);
              }}
              multiline
            />
            <TouchableOpacity onPress={() => removeStep(index)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addStep}>
          <Ionicons name="add-outline" size={20} color="#1FCC79" />
          <Text style={styles.addButtonText}>순서 추가</Text>
        </TouchableOpacity>

        {allergyInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>알레르기 정보</Text>
            <Text style={styles.infoText}>{allergyInfo}</Text>
          </View>
        )}

        {alternativeToolInfo && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>대체 도구 정보</Text>
            <Text style={styles.infoText}>{alternativeToolInfo}</Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={updateRecipe}>
          <Text style={styles.nextButtonText}>수정 완료</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: StatusBar.currentHeight || 20 },
  scrollContainer: { flexGrow: 1, paddingBottom: 150, justifyContent: "flex-start" },
  label: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 14, fontSize: 18, marginTop: 10, backgroundColor: "#F7F7F7" },
  textArea: { height: 120 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  addButton: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "#1FCC79", marginLeft: 5 },
  deleteButton: { marginLeft: 10, marginTop: 10 },
  navContainer: { position: "absolute", bottom: 20, left: 20, right: 20, flexDirection: "row", alignItems: "center" },
  backButton: { flex: 1, marginRight: 10, backgroundColor: "#F5F5F5", paddingVertical: 14, borderRadius: 12, elevation: 3, alignItems: "center" },
  backButtonText: { fontSize: 18, color: "#333", fontWeight: "600" },
  nextButton: { flex: 1, backgroundColor: "#1FCC79", paddingVertical: 14, borderRadius: 12, elevation: 4, alignItems: "center" },
  nextButtonText: { fontSize: 18, color: "#fff", fontWeight: "700" },
  infoContainer: { marginTop: 20, padding: 15, backgroundColor: "#EFEFEF", borderRadius: 10 },
  infoTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  infoText: { fontSize: 14, color: "#555" }
});

export default RecipeEdit2;
