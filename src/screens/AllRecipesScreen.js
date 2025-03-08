import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";

const AllRecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
        >
          <Image style={styles.cardImage} source={{ uri: finalImageUrl }} resizeMode="cover" />
          <View style={styles.cardBody}>
            <Text style={styles.recipeTitle}>{item.recipeName}</Text>
            <Text style={styles.recipeDesc}>{item.description}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.recipeCategory}>{item.category}</Text>
              <Text style={styles.recipeTime}>{item.cookingTime}분</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>모든 레시피</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  listContainer: { paddingBottom: 20 },

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
});

export default AllRecipesScreen;
