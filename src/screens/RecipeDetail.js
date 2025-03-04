import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getDefaultImageUrl } from "../utils/getDefaultImageUrl";

const RecipeDetail = ({ route }) => {
  const { recipe } = route.params;

  // 업로드된 이미지가 있으면 그 URL 사용, 없으면 카테고리별 기본 이미지 사용
  const uploadedImageUrl = (recipe.urls && recipe.urls.length > 0) ? recipe.urls[0] : null;
  const finalImageUrl = uploadedImageUrl ?? getDefaultImageUrl(recipe.category);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.recipeName}</Text>

      {/* 이미지 (레시피 이름 아래, 설명 위) */}
      <Image 
        source={{ uri: finalImageUrl }}
        style={styles.recipeImage}
        resizeMode="cover"
      />

      {/* 간단한 설명 */}
      <Text style={styles.description}>{recipe.description}</Text>

      <Text style={styles.sectionTitle}>⏳ 요리 시간</Text>
      <Text style={styles.info}>{recipe.cookingTime}분</Text>

      <Text style={styles.sectionTitle}>📌 카테고리</Text>
      <Text style={styles.info}>{recipe.category}</Text>

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
    padding: 16, 
    backgroundColor: "#fff" 
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