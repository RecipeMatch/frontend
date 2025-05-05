// LikedRecipes.js
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { Ionicons } from "@expo/vector-icons";

const LikedRecipes = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const uid = userInfo?.uid;
        const res = await fetch(`${API_BASE_URL}/api/users/recipesLike?uid=${uid}`);
        const data = await res.json();
        setLikedRecipes(data);
      } catch (err) {
        console.error("좋아요 레시피 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, []);

  const renderItem = ({ item }) => {
    const hasImage = item.imageUrls && item.imageUrls.length > 0;
    const finalImageSource = hasImage && typeof item.imageUrls[0] === "string"
      ? { uri: item.imageUrls[0] }
      : getDefaultImageUrl(item.category);

    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
      >
        <ImageBackground
          source={finalImageSource}
          style={styles.recipeImage}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        />

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
      <Text style={styles.title}>좋아요한 레시피</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          data={likedRecipes}
          keyExtractor={(item, index) => item?.recipeId?.toString() ?? index.toString()}
          renderItem={renderItem}
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
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
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
  recipeImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#eee",
  },
  recipeInfo: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 8,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
    color: "#444",
  },
});

export default LikedRecipes;