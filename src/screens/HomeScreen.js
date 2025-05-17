import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert, Image, Linking, Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, KAKAO_REST_API_KEY } from "@env";
import BottomTab from "../../components/BottomTab";
import * as Location from "expo-location";
import KakaoMapView from "../components/KakaoMapView.js";

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [location, setLocation] = useState(null);

  const categoryImages = {
    KOREAN: require("../../assets/images/Korean.png"),
    CHINESE: require("../../assets/images/Chinese.png"),
    JAPANESE: require("../../assets/images/Japanese.png"),
    WESTERN: require("../../assets/images/Western.png"),
    SOUTHEAST_ASIAN: require("../../assets/images/SoutheastAsian.png"),
    ITALIAN: require("../../assets/images/Italian.png"),
    FUSION: require("../../assets/images/Fusion.png"),
    DEFAULT: require("../../assets/images/Default.png"),
  };

  useEffect(() => {
    let subscription;

    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한이 거부되었습니다.");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (loc) => {
          console.log("📡 실시간 위치 업데이트:", loc.coords);
          setLocation(loc.coords);
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyStores(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    fetchRecommendedRecipes();
  }, []);

  const fetchNearbyStores = async (lat, lon) => {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=마트&x=${lon}&y=${lat}&radius=2000&size=10`;
      const response = await fetch(url, {
        headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` },
      });
      const data = await response.json();
      console.log("📍 Kakao 전체 응답:", data);
      const stores = Array.isArray(data.documents) ? data.documents : [];

      // 거리순 정렬 후 상위 5개만 저장
      const sortedStores = stores
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 5);

      setNearbyStores(sortedStores);
    } catch (e) {
      console.error("❌ Kakao API 실패:", e);
      setNearbyStores([]);
    }
  };

  const fetchRecommendedRecipes = async () => {
    try {
      const userUid = await AsyncStorage.getItem("userUid");
      if (!userUid) return;
      const response = await axios.post(`${API_BASE_URL}/api/history/recommended`, null, {
        params: { userUid },
      });
      console.log("✅ 추천 레시피 응답:", response.data);
      setRecommendedRecipes(response.data);
    } catch (error) {
      console.error("추천 레시피 실패:", error);
    }
  };


  const searchProducts = async () => {
    if (!searchKeyword.trim()) {
      Alert.alert("검색어를 입력해주세요!");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search/recommendations/products?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const data = await response.json();
      setSearchResults(data.products);
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <FlatList
          ListHeaderComponent={
            <>
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

              <Text style={styles.sectionTitle}>추천 레시피</Text>
              <FlatList
                data={recommendedRecipes}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const hasImage = item.imageUrls && item.imageUrls.length > 0;
                  const finalImageSource = hasImage
                    ? { uri: item.imageUrls[0] }
                    : categoryImages[item.category] || categoryImages["기본"]; // 🧠 카테고리 기반 기본 이미지

                  return (
                    <TouchableOpacity
                      style={styles.searchProductCard}
                      onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
                    >
                      <Image
                        source={finalImageSource}
                        style={styles.searchProductImage}
                      />
                      <Text style={styles.searchProductName} numberOfLines={2}>
                        {item.recipeName}
                      </Text>
                      <Text style={styles.searchProductPrice}>
                        {item.cookingTime ? `${item.cookingTime}분` : "시간정보 없음"}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                showsHorizontalScrollIndicator={false}
              />

              <TouchableOpacity 
                style={{
                  backgroundColor: "#F3F3F3",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 20,
                }} 
                onPress={() => navigation.navigate("AllRecipesScreen")}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#333",
                }}>
                  모든 레시피 보기
                </Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>📍 지도에서 주변 상점 보기</Text>
                <View style={{ height: 300 }}>
                  {location && (
                    <KakaoMapView location={location} stores={nearbyStores} />
                  )}
                </View>
                
              <Text style={styles.sectionTitle}>📍 주변 상점</Text>
              {nearbyStores?.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.storeItem}
                  onPress={() => Linking.openURL(item.place_url)}
                >
                  <Ionicons name="location-outline" size={18} />
                  <Text style={styles.storeText}>
                    {item.place_name} ({item.road_address_name || item.address_name})
                  </Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionTitle}>상품 검색</Text>
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
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.searchProductListItem}
                    onPress={() =>
                      item.productUrl
                        ? Linking.openURL(item.productUrl)
                        : Alert.alert("링크 없음", "해당 상품 링크가 없습니다.")
                    }
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.searchProductListImage} />
                    <View style={styles.searchProductListInfo}>
                      <Text style={styles.searchProductListName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.searchProductListPrice}>
                        {item.price ? `${item.price.toLocaleString()}원` : "가격정보 없음"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center", color: "#888", marginTop: 10 }}>
                    검색 결과가 없습니다.
                  </Text>
                }
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 10 }}
              />

              <View style={{ height: 300 }} />
            </>
          }
          data={[]}
        />
        <BottomTab style={styles.bottomTabFixed} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 0,
  },
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
  storeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  storeText: { fontSize: 16, marginLeft: 6 },
  searchProductCard: {
    backgroundColor: "#FFF5E1",
    borderRadius: 10,
    padding: 14,
    marginRight: 14,
    alignItems: "center",
    width: 160,
  },
  searchProductImage: {
    width: 80,
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
  productCard: {
    backgroundColor: "#FFF5E1",
    padding: 14,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    width: 130,
  },
  productText: { fontSize: 15, fontWeight: "bold" },
  productPrice: { fontSize: 13, color: "gray" },
  searchProductListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
    color: "#4a3c31",
  },
  searchProductListPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default HomeScreen;
