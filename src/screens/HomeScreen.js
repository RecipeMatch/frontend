import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { Image } from 'react-native';
import { Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomTab from "../../components/BottomTab";
import { useEffect } from "react";
import { API_BASE_URL } from "@env";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log("✅ 현재 API_BASE_URL:", API_BASE_URL);
  }, []);
  const searchProducts = async () => {
    if (!searchKeyword.trim()) {
      Alert.alert("검색어를 입력해주세요!");
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/search/recommendations/products?keyword=${encodeURIComponent(searchKeyword)}`);
      const data = await response.json();
      console.log("🔍 검색 결과:", data.products);
      setSearchResults(data.products);
    } catch (error) {
      console.error("검색 실패:", error);
      Alert.alert("검색 실패", "상품을 불러오지 못했습니다.");
    }
  };
  
  

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
                  <TouchableOpacity 
  style={styles.searchProductCard}
  onPress={() => {
    if (item.productUrl) {
      Linking.openURL(item.productUrl);
    } else {
      Alert.alert("링크 없음", "해당 상품 링크가 없습니다.");
    }
  }}
>
  <Image
    source={{ uri: item.imageUrl }}
    style={styles.searchProductImage}
  />
  <Text style={styles.searchProductName} numberOfLines={2}>
    {item.name}
  </Text>
  <Text style={styles.searchProductPrice}>
    {item.price ? `${item.price.toLocaleString()}원` : "가격정보 없음"}
  </Text>
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
              {/* 🛒 추천 상품 */}
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
          
              {/* 🛒 모든 레시피 보기 버튼 */}
              <TouchableOpacity 
                style={styles.allRecipesButton} 
                onPress={() => navigation.navigate("AllRecipesScreen")}
              >
                <Text style={styles.allRecipesButtonText}>모든 레시피 보기</Text>
              </TouchableOpacity>
          
              {/* 🔎 상품 검색 (NEW) */}
              <View style={{ marginTop: 20 }}>
                <Text style={styles.sectionTitle}>상품 검색</Text>
          
                {/* 검색 입력창 */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="상품 검색어 입력..."
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                    onSubmitEditing={searchProducts}
                  />
                </View>
          
                {/* 검색 결과 리스트 */}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
  style={styles.searchProductListItem}
  onPress={() => {
    if (item.productUrl) {
      Linking.openURL(item.productUrl);
    } else {
      Alert.alert("링크 없음", "해당 상품 링크가 없습니다.");
    }
  }}
>
  <Image
    source={{ uri: item.imageUrl }}
    style={styles.searchProductListImage}
  />
  <View style={styles.searchProductListInfo}>
    <Text style={styles.searchProductListName} numberOfLines={2}>
      {item.name}
    </Text>
    <Text style={styles.searchProductListPrice}>
      {item.price ? `${item.price.toLocaleString()}원` : "가격정보 없음"}
    </Text>
  </View>
</TouchableOpacity>

                  )}
                  ListEmptyComponent={<Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>검색 결과가 없습니다.</Text>}
                  showsVerticalScrollIndicator={false}
                  style={{ marginTop: 10 }}
                />
              </View>
          
              {/* 하단 여백 */}
              <View style={{ height: 350 }} />
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
  searchResultItem: { 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: "#eee" 
  },
  searchResultText: { 
    fontSize: 16, 
    color: "#333" 
  },
  searchProductCard: {
    backgroundColor: "#FFF5E1",
    borderRadius: 10,
    padding: 14,
    marginRight: 14,   // 🔥 여백 크게
    alignItems: "center",
    width: 160,        // 🔥 박스 크기 키움 (기존 130 → 160)
  },
  
  searchProductImage: {
    width: 80,         // 🔥 이미지 크기도 조금 키움
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  
  searchProductName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  
  searchProductPrice: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  searchProductListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E1", // 🔥 추천 상품 카드랑 통일
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  
  searchProductListImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  
  searchProductListInfo: {
    flex: 1,
    justifyContent: "center",
  },
  
  searchProductListName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4a3c31",  // 재료/상품 이름 색상
  },
  
  searchProductListPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  
  
  
});

export default HomeScreen;
