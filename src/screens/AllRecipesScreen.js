import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar, Platform } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AllRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("grid");
  const [sortBy, setSortBy] = useState(null);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const userUid = user?.email;

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

  const handleSort = async (type) => {
    try {
      setSortBy(type);
      console.log("📤 정렬 기준:", type);

      const allRes = await axios.get(`${API_BASE_URL}/api/recipeAll`);
      const recipeIds = allRes.data.map((r) => r.id);

      console.log("📦 보내는 recipeIds:", recipeIds);
      console.log("📥 전체 레시피 수:", recipeIds.length);

      const sortRes = await axios.post(`${API_BASE_URL}/api/recipe/sort`, {
        recipeIds,
        sortBy: type,
      });

      console.log("✅ 정렬된 결과 수:", sortRes.data.length);
      setRecipes(sortRes.data);
      setListKey(type); // FlatList 재렌더링을 위해 key 변경
    } catch (err) {
      console.error("❌ 정렬 요청 실패", err);
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
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color="red" />
            <Text style={styles.statText}>{item.likeSize}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="bookmark-outline" size={16} color="#ff8c00" />
            <Text style={styles.statText}>{item.bookMarkSize}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모든 레시피</Text>

      {/* ✅ 정렬 버튼 */}
      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "LIKE" && styles.activeSort]}
          onPress={() => handleSort("LIKE")}
        >
          <Text style={styles.sortText}>좋아요순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "BOOKMARK" && styles.activeSort]}
          onPress={() => handleSort("BOOKMARK")}
        >
          <Text style={styles.sortText}>즐겨찾기순</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          key={listKey}
          data={recipes}
          keyExtractor={(item, index) => item?.recipeId?.toString() ?? index.toString()}

          renderItem={renderRecipeItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, paddingLeft: 10 },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    gap: 10,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
  },
  activeSort: {
    backgroundColor: "#1FCC79",
  },
  sortText: {
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: { paddingBottom: 20 },
  row: { justifyContent: "space-between" },
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
  statsContainer: { flexDirection: "row", justifyContent: "center", paddingBottom: 8 },
  statItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  statText: { fontSize: 14, marginLeft: 4, color: "#444" },
});

export default AllRecipesScreen;
