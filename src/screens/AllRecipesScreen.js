import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { Ionicons } from "@expo/vector-icons"; // ✅ 아이콘 추가

const AllRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("grid"); // ✅ FlatList 재렌더링을 위한 key 추가
  const navigation = useNavigation();

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipeAll`);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("🔥 API 요청 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const renderRecipeItem = ({ item }) => {
    const uploadedImageUrl = item.imageUrls?.length > 0 ? item.imageUrls[0] : null;
    const finalImageUrl = uploadedImageUrl ?? getDefaultImageUrl(item.category);

    return (
      <TouchableOpacity 
        style={styles.recipeCard} 
        onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
      >
        <Image style={styles.recipeImage} source={{ uri: finalImageUrl }} resizeMode="cover" />
        <Text style={styles.recipeName} numberOfLines={1}>{item.recipeName}</Text>
        
        {/* ✅ 즐겨찾기 & 좋아요 개수 추가 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark-outline" size={16} color="#ff8c00" />
            <Text style={styles.statText}>{item.bookMarkSize}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="red" />
            <Text style={styles.statText}>{item.likeSize}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모든 레시피</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          key={listKey} // ✅ FlatList 재렌더링을 강제하여 오류 해결
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          numColumns={2} // ✅ 2열 그리드 적용
          columnWrapperStyle={styles.row} // ✅ 2열 정렬 스타일 적용
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, paddingLeft: 10 },
  listContainer: { paddingBottom: 20 },
  row: { justifyContent: "space-between" }, // ✅ 두 개씩 정렬

  recipeCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: { width: "100%", height: 120, backgroundColor: "#eee" },
  recipeName: { fontSize: 14, fontWeight: "bold", padding: 8, textAlign: "center" },

  // ✅ 즐겨찾기 & 좋아요 스타일
  statsContainer: { flexDirection: "row", justifyContent: "center", paddingBottom: 8 },
  statItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  statText: { fontSize: 14, marginLeft: 4, color: "#444" },
});

export default AllRecipesScreen;