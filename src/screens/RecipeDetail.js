import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_BASE_URL } from "@env";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";

import { AuthContext } from "../context/AuthContext";
import Tts from "react-native-tts";

const RecipeDetail = ({ route }) => {
  useEffect(() => {
    const saveSearchHistory = async () => {
      try {
        const userUid = userInfo?.uid;
        if (userUid && recipe?.id) {
          await fetch(`${API_BASE_URL}/api/history`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userUid,
              recipeId: recipe.id,
              category: recipe.category || "DEFAULT",
            }),
          });
        }
      } catch (e) {
        console.error("🔴 검색 기록 저장 실패:", e);
      }
    };
    saveSearchHistory();
  }, []);

  useEffect(() => {
    console.log("🔍 RecipeDetail data:", recipe);
  }, [recipe]);

  const navigation = useNavigation();
  const { recipe: initialRecipe } = route.params;
  const { userInfo } = useContext(AuthContext);
  const [recipe] = useState(initialRecipe);
  const alterToolsList =
    recipe.alterTools?.split(",").map((item) => item.trim()) || [];
  const [comments, setComments] = useState([]);
  const [ingredientQuantities, setIngredientQuantities] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(initialRecipe.recipeLike ?? false);
  const [likeCount, setLikeCount] = useState(initialRecipe.likeSize ?? 0);
  const [isBookmarked, setIsBookmarked] = useState(
    initialRecipe.recipeBookMark ?? false
  );
  const [bookmarkCount, setBookmarkCount] = useState(
    initialRecipe.bookMarkSize ?? 0
  );
  const uploadedImageUrl =
    recipe.imageUrls?.length > 0 && typeof recipe.imageUrls[0] === "string"
      ? recipe.imageUrls[0]
      : null;

  const finalImageSource = uploadedImageUrl
    ? { uri: uploadedImageUrl }
    : getDefaultImageUrl(recipe.category); // 이 부분을 getDefaultImageUrl로 수정

  useEffect(() => {
    fetchComments();
    fetchIngredientQuantities();
    Tts.setDefaultLanguage("ko-KR");
  }, []);

  // 👇 RecipeDetail 컴포넌트 안에 추가
  const MissingIngredientsSection = ({ recipeId, userUid }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
      const fetchMissing = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/recommendations/products?recipeId=${recipeId}&userUid=${userUid}`
          );
          const data = await response.json();
          console.log("🔥 서버 응답 데이터:", data); // <- 추가
          if (data.hasMissing) {
            setProducts(data.products);
          }
        } catch (e) {
          console.error("부족 재료 상품 조회 실패:", e);
        }
      };
      fetchMissing();
    }, []);

    if (products.length === 0) {
      return null;
    }

    return (
      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>부족한 재료 추천 상품</Text>
        {products.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={() => {
              if (item.productUrl) {
                Linking.openURL(item.productUrl);
              } else {
                Alert.alert("링크 없음", "해당 상품 링크가 존재하지 않습니다.");
              }
            }}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.name}
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }}>
                {item.price?.toLocaleString() ?? "가격정보 없음"}원
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/recipes/${recipe.id}/comments`
      );
      setComments(await res.json());
    } catch (e) {
      console.error("댓글 조회 오류:", e);
    }
    setLoading(false);
  };

  const fetchIngredientQuantities = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/recipe_ingredient?recipeId=${recipe.id}`
      );
      const data = await res.json();
      setIngredientQuantities(data);
    } catch (err) {
      console.error("재료 수량 로딩 실패:", err);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      await fetch(`${API_BASE_URL}/api/recipes/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: recipe.id,
          content: commentText,
          userUid: userInfo.uid,
        }),
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
      const res = await fetch(
        `${API_BASE_URL}/api/recipe/like?recipeId=${recipe.id}&userUid=${userInfo.uid}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error();
      const newLiked = !isLiked;
      setIsLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } catch {
      Alert.alert("오류", "좋아요 변경 실패");
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/recipe/bookmark?recipeId=${recipe.id}&userUid=${userInfo.uid}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error();
      const newBookmarked = !isBookmarked;
      setIsBookmarked(newBookmarked);
      setBookmarkCount((prev) => (newBookmarked ? prev + 1 : prev - 1));
    } catch {
      Alert.alert("오류", "즐겨찾기 변경 실패");
    }
  };

  const finalImageUrl = recipe.urls?.[0] ?? getDefaultImageUrl(recipe.category);

  const CookingTimer = ({ totalMinutes }) => {
    const initialSeconds = isNaN(Number(totalMinutes))
      ? 0
      : Number(totalMinutes) * 60;
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
      if (isRunning && secondsLeft > 0) {
        intervalRef.current = setInterval(() => {
          setSecondsLeft((prev) => prev - 1);
        }, 1000);
      } else if (secondsLeft === 0) {
        setIsRunning(false);
        Tts.speak("요리가 완료되었습니다!");
      }

      return () => clearInterval(intervalRef.current);
    }, [isRunning, secondsLeft]);

    const formatTime = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
      <View style={timerStyles.container}>
        <Text style={timerStyles.title}>⏱ 요리 타이머</Text>
        <Text style={timerStyles.time}>{formatTime(secondsLeft)}</Text>

        <View style={timerStyles.buttonContainer}>
          <TouchableOpacity
            style={[timerStyles.button, { backgroundColor: "#4caf50" }]}
            onPress={() => {
              if (secondsLeft > 0) setIsRunning((prev) => !prev);
            }}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={20}
              color="#fff"
            />
            <Text style={timerStyles.buttonText}>
              {isRunning ? "정지" : "시작"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[timerStyles.button, { backgroundColor: "#f44336" }]}
            onPress={() => {
              setIsRunning(false);
              setSecondsLeft(initialSeconds);
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={timerStyles.buttonText}>초기화</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    // 변경 후 (살구색 느낌)
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.contentContainer}
        extraScrollHeight={20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{recipe.recipeName}</Text>
        <ImageBackground
          source={finalImageSource}
          style={styles.recipeImage}
          resizeMode="cover"
          imageStyle={{ borderRadius: 10 }}
        />

        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color="red"
            />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleBookmark}
            style={styles.actionButton}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#ff8c00"
            />
            <Text style={styles.actionText}>{bookmarkCount}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionTitle}>요리 시간</Text>
        <Text style={styles.info}>{recipe.cookingTime}분</Text>
        <CookingTimer totalMinutes={recipe.cookingTime || 30} />

        <Text style={styles.sectionTitle}>카테고리</Text>
        <Text style={styles.info}>{recipe.category}</Text>

        <Text style={styles.sectionTitle}>난이도</Text>
        <Text style={styles.info}>{recipe.difficulty || "정보 없음"}</Text>

        <Text style={styles.sectionTitle}>재료</Text>
        {recipe.recipeIngredientDtos.map((i, idx) => (
          <View key={idx} style={styles.ingredientCard}>
            <Text style={styles.ingredientName}>{i.ingredientName}</Text>
            <Text style={styles.ingredientQty}>{i.quantity}</Text>
          </View>
        ))}

        {recipe.allergies?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>알레르기 유발 재료</Text>
            {recipe.allergies.map((a, idx) => (
              <View key={idx} style={styles.infoCard}>
                <Text style={styles.infoCardText}>{a}</Text>
              </View>
            ))}
          </>
        )}
        <MissingIngredientsSection
          recipeId={recipe.id}
          userUid={userInfo.uid}
        />
        <Text style={styles.sectionTitle}>도구 대체 도구</Text>

        {recipe.toolName.map((tool, idx) => (
          <View key={idx} style={styles.toolCard}>
            <View style={styles.toolPair}>
              <Text style={styles.toolText}>{tool}</Text>
              <Text style={styles.toolText}>{alterToolsList[idx] ?? "-"}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>순서</Text>
        {recipe.recipeStepDtos.map((s, idx) => (
          <View
            key={idx}
            style={{
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{idx + 1}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.listItem}>{s.content || "설명 없음"}</Text>
              <TouchableOpacity
                onPress={() => {
                  Tts.stop();
                  Tts.speak(`${idx + 1}단계. ${s.content || "설명 없음"}`);
                }}
                style={styles.ttsButton}
              >
                <Text style={styles.ttsButtonText}>순서 {idx + 1}번 읽기</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>댓글</Text>
        {loading ? null : comments.length === 0 ? (
          <Text style={styles.emptyText}>등록된 댓글이 없습니다.</Text>
        ) : (
          comments.map((item) => (
            <View key={item.id} style={styles.commentBubble}>
              <Text style={styles.commentAuthor}>{item.nickname}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          ))
        )}
      </KeyboardAwareScrollView>

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
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: { padding: 16, paddingBottom: 100 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d85d32", // 따뜻한 오렌지 계열
    textAlign: "center",
    marginVertical: 12,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
  },
  actionText: { marginLeft: 5, fontSize: 16 },
  description: { fontSize: 16, color: "#666", marginBottom: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#d85d32",
    marginTop: 24,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#f3d2c1",
    paddingBottom: 4,
  },

  listItem: {
    fontSize: 16,
    color: "#4a3c31",
    paddingVertical: 6,
    lineHeight: 24,
  },

  commentItem: {
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingVertical: 8,
  },
  commentAuthor: { fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#666", marginVertical: 12 },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff7f0",
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7bb661",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumber: { color: "#fff", fontWeight: "bold" },
  ttsButton: {
    marginTop: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  ingredientCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ingredientName: { fontWeight: "bold", color: "#4a3c31", fontSize: 16 },
  ingredientQty: { color: "#4a3c31", fontSize: 16 },
  infoCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  infoCardText: { fontSize: 16, fontWeight: "600", color: "#4a3c31" },
  commentBubble: {
    backgroundColor: "#fffaf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  commentText: { fontSize: 16, color: "#4a3c31" },
  toolRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  toolHeader: { fontSize: 16, fontWeight: "bold", color: "#d85d32" },
  toolRowLine: { height: 1, backgroundColor: "#f2d8c2", marginBottom: 8 },
  toolRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  toolText: { fontSize: 16, fontWeight: "600", color: "#4a3c31", width: "48%" },
  toolCard: {
    backgroundColor: "#fffaf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  toolPair: { flexDirection: "row", justifyContent: "space-between" },
  toolHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#d85d32",
    marginBottom: 8,
  },
  ttsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5c9aa",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  ttsButtonText: {
    color: "#555",
    fontSize: 14,
    marginLeft: 0,
    fontWeight: "600",
  },
  info: { fontSize: 16, fontWeight: "600", color: "#4a3c31", marginBottom: 8 },
});

const timerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff0e6",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#d85d32",
  },
  time: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4a3c31",
    marginBottom: 12,
  },
  buttonContainer: { flexDirection: "row", gap: 12 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f28c8c",
  },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 6 },
});

export default RecipeDetail;
