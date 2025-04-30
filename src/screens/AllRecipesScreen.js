import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar, Platform } from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ImageBackground } from "react-native";
import FilterModal from "./FilterModal"; // ✅ 추가 (필터모달 컴포넌트 가져오기)

const AllRecipesScreen = () => {
  console.log("🔥 AllRecipesScreen 렌더링됨");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listKey, setListKey] = useState("grid");
  const [sortBy, setSortBy] = useState(null);
  const [category, setCategory] = useState(null); // ✅ 추가: 카테고리
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false); // ✅ 추가: 카테고리 모달 상태
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const userUid = user?.email;

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipeAll`);
      const data = await response.json();

      console.log("🔥 받아온 레시피 데이터:", data);

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

  const handleCategoryApply = async (filter) => {
    try {
      const selectedCategory = filter.category;
      console.log("📂 선택한 카테고리:", selectedCategory);
      setCategory(selectedCategory);

      const allRes = await axios.get(`${API_BASE_URL}/api/recipeAll`);
      const allRecipes = allRes.data;

      const filteredRecipes = allRecipes.filter((r) => r.category === selectedCategory);
      setRecipes(filteredRecipes);
      setListKey(selectedCategory);
    } catch (err) {
      console.error("❌ 카테고리 필터 실패", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);


const renderRecipeItem = ({ item }) => {
  const hasImage = item.imageUrls && item.imageUrls.length > 0;
  const finalImageSource = hasImage
  ? { uri: item.imageUrls[0] } // ✅ 네트워크 이미지인 경우 uri 필요
  : getDefaultImageUrl(item.category); // ✅ require() 결과는 객체 그대로


  const categoryMap = {
    KOREAN: "한식",
    CHINESE: "중식",
    JAPANESE: "일식",
    WESTERN: "양식",
    SOUTHEAST_ASIAN: "동남아",
    ITALIAN: "이탈리안",
    FUSION: "퓨전",
    DEFAULT: "기본",
  };

  return (
    <TouchableOpacity 
      style={styles.recipeCard} 
      onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
    >
      <ImageBackground
        source={finalImageSource}
        style={styles.recipeImage}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} // 상단 라운드
      >
        
      </ImageBackground>

      <View style={styles.recipeInfo}>
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
      </View>
    </TouchableOpacity>
  );
};


  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모든 레시피</Text>

      {/* ✅ 정렬 + 카테고리 버튼 추가 */}
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
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={styles.sortText}>카테고리</Text>
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

      {/* ✅ 카테고리 필터 모달 */}
      <FilterModal
        visible={isCategoryModalVisible}
        mode="category"
        onClose={() => setCategoryModalVisible(false)}
        onApply={handleCategoryApply}
      />
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
    flexWrap: "wrap", // 혹시 버튼 많아지면 줄바꿈 되게
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    margin: 4,
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
  categoryOverlay: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  recipeInfo: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  recipeImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  
});

export default AllRecipesScreen;
