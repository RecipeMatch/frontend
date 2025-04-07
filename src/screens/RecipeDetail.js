import React, { useState, useContext, useEffect } from "react";
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  FlatList, TextInput, Alert, StatusBar, Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";
import { AuthContext } from "../context/AuthContext";

const RecipeDetail = ({ route }) => {

  useEffect(() => {
    console.log("🔍 RecipeDetail data:", recipe);
  }, [recipe]);
  
  const navigation = useNavigation();
  const { recipe } = route.params;
  const { userInfo } = useContext(AuthContext);

  if (!userInfo?.uid) {
    Alert.alert("로그인이 필요합니다.", "댓글 기능을 사용하려면 로그인해주세요.");
    return null;
  }

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(recipe.recipeLike ?? false);
  const [likeCount, setLikeCount] = useState(recipe.likeSize ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(recipe.recipeBookMark ?? false);
  const [bookmarkCount, setBookmarkCount] = useState(recipe.bookMarkSize ?? 0);

  useEffect(() => { 
    fetchComments(); 
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/recipes/${recipe.id}/comments`);
      setComments(await res.json());
    } catch (e) {
      console.error("댓글 조회 오류:", e);
    }
    setLoading(false);
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/api/recipes/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId: recipe.id, content: commentText, userUid: userInfo.uid }),
      });
      setCommentText("");
      fetchComments();
    } catch (e) {
      console.error("댓글 작성 오류:", e);
      Alert.alert("오류", "댓글 작성 실패");
    }
  };

  const toggleLike = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recipe/like?recipeId=${recipe.id}&userUid=${userInfo.uid}`, { method: "POST" });
      if (!res.ok) throw new Error();
      const newLiked = !isLiked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;
      setIsLiked(newLiked);
      setLikeCount(newCount);
      navigation.setParams({
        recipe: { ...route.params.recipe, recipeLike: newLiked, likeSize: newCount }
      });
    } catch {
      Alert.alert("오류", "좋아요 변경 실패");
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recipe/bookmark?recipeId=${recipe.id}&userUid=${userInfo.uid}`, { method: "POST" });
      if (!res.ok) throw new Error();
      const newBookmarked = !isBookmarked;
      const newCount = newBookmarked ? bookmarkCount + 1 : bookmarkCount - 1;
      setIsBookmarked(newBookmarked);
      setBookmarkCount(newCount);
      navigation.setParams({
        recipe: { ...route.params.recipe, recipeBookMark: newBookmarked, bookMarkSize: newCount }
      });
    } catch {
      Alert.alert("오류", "즐겨찾기 변경 실패");
    }
  };

  const finalImageUrl = recipe.urls?.[0] ?? getDefaultImageUrl(recipe.category);

  const Header = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{recipe.recipeName}</Text>
      <Image source={{ uri: finalImageUrl }} style={styles.recipeImage} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="red" />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleBookmark} style={styles.actionButton}>
          <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={24} color="#ff8c00" />
          <Text style={styles.actionText}>{bookmarkCount}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{recipe.description}</Text>
      <Text style={styles.sectionTitle}>⏳ 요리 시간</Text>
      <Text style={styles.info}>{recipe.cookingTime}분</Text>
      <Text style={styles.sectionTitle}>📌 카테고리</Text>
      <Text style={styles.info}>{recipe.category}</Text>
      <Text style={styles.sectionTitle}>🔥 난이도</Text>
      <Text style={styles.info}>{recipe.difficulty || "정보 없음"}</Text>
      
      {/* 재료 및 알레르기 재료 */}
      <Text style={styles.sectionTitle}>🥕 재료</Text>
      {recipe.recipeIngredientDtos.map((i, idx) => (
        <Text key={idx} style={styles.listItem}>• {i.ingredientName}</Text>
      ))}
      {recipe.allergies && recipe.allergies.length > 0 && (
        <>
          <Text style={styles.subSectionTitle}>⚠️ 알레르기 유발 재료</Text>
          {recipe.allergies.map((a, idx) => (
            <Text key={idx} style={styles.listItem}>• {a}</Text>
          ))}
        </>
      )}
      
      {/* 도구 및 대체 도구 */}
      <Text style={styles.sectionTitle}>🔪 도구</Text>
      {recipe.toolName.map((t, idx) => (
        <Text key={idx} style={styles.listItem}>• {t}</Text>
      ))}
      {recipe.alterTools && recipe.alterTools.trim() !== "" && (
        <>
          <Text style={styles.subSectionTitle}>🔄 대체 도구</Text>
          <Text style={styles.listItem}>• {recipe.alterTools}</Text>
        </>
      )}
      
      <Text style={styles.sectionTitle}>🍳 순서</Text>
      {recipe.recipeStepDtos.map((s, idx) => (
        <Text key={idx} style={styles.listItem}>
          {s.stepOrder}. {s.content || "설명 없음"}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>💬 댓글</Text>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentAuthor}>{item.nickname}</Text>
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={<Header />}
      renderItem={renderComment}
      ListEmptyComponent={loading ? null : <Text style={styles.emptyText}>등록된 댓글이 없습니다.</Text>}
      ListFooterComponent={
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={addComment}>
            <Ionicons name="send" size={24} />
          </TouchableOpacity>
        </View>
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: "#fff", 
    paddingTop: StatusBar.currentHeight || 20 
  },
  headerContainer: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  recipeImage: { width: "100%", height: 200, borderRadius: 10, marginVertical: 12 },
  actionsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  actionButton: { flexDirection: "row", alignItems: "center", marginHorizontal: 15 },
  actionText: { marginLeft: 5, fontSize: 16 },
  description: { fontSize: 16, color: "#666", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
  subSectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 8, color: "#aa0000" },
  info: { fontSize: 16, marginBottom: 8 },
  listItem: { fontSize: 16, paddingVertical: 2 },
  commentItem: { borderBottomWidth: 0.5, borderColor: "#ccc", paddingVertical: 8 },
  commentAuthor: { fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#666", marginVertical: 12 },
  commentInputContainer: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderColor: "#eee", paddingVertical: 12 },
  commentInput: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 12, marginRight: 8 },
});

export default RecipeDetail;
