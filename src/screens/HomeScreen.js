import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTab from "../../components/BottomTab";


const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  // 🔹 임시 데이터
  const recommendedRecipes = [
    { id: "1", name: "김치찌개", image: "🍲" },
    { id: "2", name: "볶음밥", image: "🍚" },
    { id: "3", name: "된장찌개", image: "🥘" },
  ];

  const nearbyStores = [
    { id: "1", name: "이마트", distance: "1.2km" },
    { id: "2", name: "롯데마트", distance: "2.5km" },
    { id: "3", name: "홈플러스", distance: "3.1km" },
  ];

  const recommendedProducts = [
    { id: "1", name: "돼지고기", price: "₩12,000" },
    { id: "2", name: "두부", price: "₩3,500" },
    { id: "3", name: "고추장", price: "₩5,000" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <FlatList
          ListHeaderComponent={
            <>
              {/* 🔍 검색 바 */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="레시피 검색..."
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={() => navigation.navigate("SearchScreen")}
                />
              </View>

              {/* 🍽️ 추천 레시피 */}
              <Text style={styles.sectionTitle}>추천 레시피</Text>
              <FlatList
                data={recommendedRecipes}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.recipeCard}>
                    <Text style={styles.recipeEmoji}>{item.image}</Text>
                    <Text style={styles.recipeText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />

              {/* 📍 주변 상점 */}
              <Text style={styles.sectionTitle}>주변 상점</Text>
              <View style={styles.mapPlaceholder}>
                <Text>📍 지도 표시 (API 연동 필요)</Text>
              </View>
            </>
          }
          data={nearbyStores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.storeItem}>
              <Ionicons name="location-outline" size={18} color="black" />
              <Text style={styles.storeText}>{item.name} ({item.distance})</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <>
              {/* 🛒 상품 추천 */}
              <Text style={styles.sectionTitle}>추천 상품</Text>
              <FlatList
                data={recommendedProducts}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.productCard}>
                    <Text style={styles.productText}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
              
              {/* 🛒 모든 레시피 보기 버튼 (하단) */}
              <TouchableOpacity 
                style={styles.allRecipesButton} 
                onPress={() => navigation.navigate("AllRecipesScreen")}
              >
                <Text style={styles.allRecipesButtonText}>모든 레시피 보기</Text>
              </TouchableOpacity>

              {/* 하단 여백 추가 */}
              <View style={{ height: 80 }} />
            </>
          }
        />

        {/* 🔻 하단 네비게이션 바 */}
        <BottomTab />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: StatusBar.currentHeight || 0 },
  wrapper: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },

  searchContainer: { 
    flexDirection: "row", 
    backgroundColor: "#f1f1f1", 
    borderRadius: 12, 
    padding: 12, 
    alignItems: "center", 
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 14 },

  /* 🔹 추천 레시피 */
  recipeCard: { backgroundColor: "#F3F3F3", padding: 14, borderRadius: 10, marginRight: 10, alignItems: "center", width: 110 },
  recipeEmoji: { fontSize: 32 },
  recipeText: { fontSize: 15, marginTop: 5 },

  /* 🔹 주변 상점 */
  mapPlaceholder: { height: 150, backgroundColor: "#EAEAEA", justifyContent: "center", alignItems: "center", borderRadius: 10, marginBottom: 12 },
  storeItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  storeText: { fontSize: 16, marginLeft: 6 },

  /* 🔹 추천 상품 */
  productCard: { backgroundColor: "#FFF5E1", padding: 14, borderRadius: 10, marginRight: 10, alignItems: "center", width: 130 },
  productText: { fontSize: 15, fontWeight: "bold" },
  productPrice: { fontSize: 13, color: "gray" },

  /* 모든 레시피 보기 버튼 */
  allRecipesButton: {
    backgroundColor: "#F3F3F3",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  allRecipesButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  
  /* 🔻 네비게이션 바 스타일 */
  bottomTab: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    alignItems: "center", 
    height: 60, 
    backgroundColor: "#fff", 
    elevation: 10, 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    paddingVertical: 10 
  },
  tabButton: { alignItems: "center" },
});

export default HomeScreen;