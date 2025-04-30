import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";

const Myrecipe = () => {
  const { userInfo } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecipes();
  }, [userInfo]);

  // 📡 나의 레시피 목록 불러오기
  const fetchRecipes = async () => {
    try {
      const userUid = userInfo?.uid;
      if (!userUid) {
        console.log("🚫 UID(이메일)를 가져올 수 없습니다.");
        setLoading(false);
        return;
      }

      console.log("📡 API 요청: 사용자 UID(이메일) =", userUid);

      const response = await fetch(`${API_BASE_URL}/api/users/recipes?uid=${userUid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`서버 응답 오류: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("🔥 API 요청 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ 레시피 삭제 함수
  const deleteRecipe = async (recipeId) => {
    try {
      Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            console.log(`🗑️ [삭제 요청 시작] recipeId: ${recipeId}`);
            console.log(`📡 [API 요청] DELETE ${API_BASE_URL}/api/recipe/${recipeId}`);

            const response = await fetch(`${API_BASE_URL}/api/recipe/${recipeId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            });

            console.log("📡 [서버 응답 코드]:", response.status);
            const responseText = await response.text();
            console.log("📡 [서버 응답 내용]:", responseText);

            if (!response.ok) {
              throw new Error(`삭제 실패: ${response.status}`);
            }

            console.log("✅ [삭제 성공]: 레시피가 삭제되었습니다.");

            // 🔄 삭제 후 목록 새로고침
            fetchRecipes();
            console.log("🔄 [목록 새로고침 실행]");
            
            Alert.alert("삭제 완료", "레시피가 삭제되었습니다.");
          },
        },
      ]);
    } catch (error) {
      console.error("❌ [삭제 중 오류 발생]:", error);
      Alert.alert("오류", "레시피를 삭제하는 중 문제가 발생했습니다.");
    }
  };

  // ✏️ 레시피 수정 화면 이동
const editRecipe = (recipe) => {
    navigation.navigate("RecipeEdit1", { recipe });
  };
  

  // 🖼️ 레시피 카드 렌더링
  const renderRecipeItem = ({ item }) => {
    const uploadedImageUrl = item.imageUrls?.length > 0 ? item.imageUrls[0] : null;
    const finalImageUrl = uploadedImageUrl ?? getDefaultImageUrl(item.category);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
        >
         <Image
  style={styles.cardImage}
  source={typeof finalImageUrl === "string" ? { uri: finalImageUrl } : finalImageUrl}
  resizeMode="cover"
/>
 <View style={styles.cardBody}>
            <Text style={styles.recipeTitle}>{item.recipeName}</Text>
            <Text style={styles.recipeDesc}>{item.description}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.recipeCategory}>{item.category}</Text>
              <Text style={styles.recipeTime}>{item.cookingTime}분</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {/* ✏️ 수정 버튼 */}
          <TouchableOpacity style={styles.editButton} onPress={() => editRecipe(item)}>
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>

          {/* 🗑️ 삭제 버튼 */}
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRecipe(item.id)}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 레시피</Text>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#1FCC79" />
        ) : recipes.length === 0 ? (
          <Text style={styles.noData}>🍽️ 나의 레시피가 없습니다.</Text>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRecipeItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  backButtonText: { fontSize: 16, color: "#007BFF" },
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { padding: 16 },
  noData: { textAlign: "center", fontSize: 16, color: "#888", marginTop: 20 },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#fefefe",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTouchable: { flex: 1 },
  cardImage: { width: "100%", height: 200, backgroundColor: "#eee" },
  cardBody: { padding: 16 },
  recipeTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  recipeDesc: { fontSize: 14, color: "#666", marginBottom: 8 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  recipeCategory: { fontSize: 14, color: "#007BFF", fontWeight: "600" },
  recipeTime: { fontSize: 14, color: "#333" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", padding: 10 },
  editButton: { backgroundColor: "#FFA500", padding: 10, borderRadius: 8, alignItems: "center", flex: 1, marginRight: 5 },
  editButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteButton: { backgroundColor: "#FF6B6B", padding: 10, borderRadius: 8, alignItems: "center", flex: 1, marginLeft: 5 },
  deleteButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Myrecipe;
