import React, { useState, useContext } from "react";
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { AuthContext } from "../context/AuthContext";

const RecipeDetail = ({ route }) => {
  const { recipe } = route.params;
  const { userInfo } = useContext(AuthContext);

  if (!userInfo?.uid) {
    Alert.alert("로그인이 필요합니다.", "좋아요 및 즐겨찾기 기능을 사용하려면 로그인해주세요.");
    return null;
  }

  // 업로드된 이미지가 있으면 그 URL 사용, 없으면 카테고리별 기본 이미지 사용
  const uploadedImageUrl = (recipe.urls && recipe.urls.length > 0) ? recipe.urls[0] : null;
  const finalImageUrl = uploadedImageUrl ?? getDefaultImageUrl(recipe.category);

  // 좋아요 및 즐겨찾기 상태 관리
  const [isLiked, setIsLiked] = useState(recipe.recipeLike ?? false);
  const [likeCount, setLikeCount] = useState(recipe.likeSize ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(recipe.recipeBookMark ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(recipe.bookMarkSize ?? 0);

  // 좋아요 토글 API 호출
  const toggleLike = async () => {
    try {
      console.log(`📡 [좋아요 요청] recipeId: ${recipe.id}, userUid: ${userInfo.uid}`);

      const response = await fetch(
        `${API_BASE_URL}/api/recipe/like?recipeId=${recipe.id}&userUid=${userInfo.uid}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error("좋아요 업데이트 실패");

      setIsLiked(prev => !prev);
      setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));

      console.log("✅ [좋아요 업데이트 성공]");
    } catch (error) {
      console.error("🔥 [좋아요 오류]:", error);
      Alert.alert("오류", "좋아요 변경 중 문제가 발생했습니다.");
    }
  };

  // 즐겨찾기 토글 API 호출
  const toggleBookmark = async () => {
    try {
      console.log(`📡 [즐겨찾기 요청] recipeId: ${recipe.id}, userUid: ${userInfo.uid}`);

      const response = await fetch(
        `${API_BASE_URL}/api/recipe/bookmark?recipeId=${recipe.id}&userUid=${userInfo.uid}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error("즐겨찾기 업데이트 실패");

      setIsBookmarked(prev => !prev);
      setBookmarkCount(prev => (isBookmarked ? prev - 1 : prev + 1));

      console.log("✅ [즐겨찾기 업데이트 성공]");
    } catch (error) {
      console.error("🔥 [즐겨찾기 오류]:", error);
      Alert.alert("오류", "즐겨찾기 변경 중 문제가 발생했습니다.");
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>{recipe.recipeName}</Text>

      {/* 이미지 */}
      <Image 
        source={{ uri: finalImageUrl }}
        style={styles.recipeImage}
        resizeMode="cover"
      />

      {/* 좋아요 & 즐겨찾기 버튼 */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="red" />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={toggleBookmark}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={24} color="#ff8c00" />
          <Text style={styles.actionText}>{bookmarkCount}</Text>
        </TouchableOpacity>
      </View>

      {/* 간단한 설명 */}
      <Text style={styles.description}>{recipe.description}</Text>

      <Text style={styles.sectionTitle}>⏳ 요리 시간</Text>
      <Text style={styles.info}>{recipe.cookingTime}분</Text>

      <Text style={styles.sectionTitle}>📌 카테고리</Text>
      <Text style={styles.info}>{recipe.category}</Text>

      {/* 난이도 섹션 추가 */}
      <Text style={styles.sectionTitle}>🔥 난이도</Text>
      <Text style={styles.info}>
        {recipe.difficulty ? recipe.difficulty : "정보 없음"}
      </Text>

      <Text style={styles.sectionTitle}>🥕 재료</Text>
      <View style={styles.listContainer}>
        {recipe.recipeIngredientDtos.map((item, index) => (
          <Text key={index} style={styles.listItem}>
            • {item.ingredientName}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>🔪 사용 도구</Text>
      <View style={styles.listContainer}>
        {recipe.toolName.map((tool, index) => (
          <Text key={index} style={styles.listItem}>
            • {tool}
          </Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>🍳 요리 순서</Text>
      <View style={styles.listContainer}>
        {recipe.recipeStepDtos.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {step.stepOrder}. {step.content || "설명이 없습니다."}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginBottom: 15,
  },
  description: { 
    fontSize: 16, 
    color: "#666", 
    marginBottom: 15 
  },
  actionsContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginVertical: 10 
  },
  actionButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginHorizontal: 15 
  },
  actionText: { 
    fontSize: 16, 
    marginLeft: 5, 
    color: "#444" 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 15, 
    marginBottom: 5 
  },
  info: { 
    fontSize: 16, 
    color: "#333" 
  },
  listContainer: {
    marginBottom: 10,
  },
  listItem: { 
    fontSize: 16, 
    paddingVertical: 3, 
    color: "#444" 
  },
});

export default RecipeDetail;
