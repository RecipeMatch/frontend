// src/screens/HomeScreen.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, memo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL, KAKAO_REST_API_KEY } from "@env";
import BottomTab from "../../components/BottomTab";
import * as Location from "expo-location";
import KakaoMapView from "../components/KakaoMapView.js";

// ------------------------
// Small UI components
// ------------------------
const SectionTitle = memo(({ children, right }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{children}</Text>
    {right}
  </View>
));

const Chip = ({ active, icon, label, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[styles.chip, active && styles.chipActive]}
  >
    {icon ? <Ionicons name={icon} size={16} style={[styles.chipIcon, active && styles.chipIconActive]} /> : null}
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const RecipeCard = ({ item, onPress, categoryImages }) => {
  const hasImage = item.imageUrls && item.imageUrls.length > 0;
  const finalImageSource = hasImage
    ? { uri: item.imageUrls[0] }
    : categoryImages[item.category] || categoryImages.DEFAULT;

  return (
    <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.9}>
      <Image source={finalImageSource} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {item.recipeName}
        </Text>
        <View style={styles.recipeMeta}>
          <Ionicons name="time-outline" size={14} />
          <Text style={styles.recipeMetaText}>{item.cookingTime ? `${item.cookingTime}분` : "정보 없음"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [location, setLocation] = useState(null);

  // 옵션 칩 (백엔드 파라미터 1:1 매핑)
  const [useUserInfo, setUseUserInfo] = useState(false);       // userInfo
  const [useAllergyFilter, setUseAllergyFilter] = useState(false); // userAllergic

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

  // 위치 감시
  useEffect(() => {
    let subscription;
    const startWatching = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("위치 권한이 거부되었습니다.");
        return;
      }
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (loc) => setLocation(loc.coords)
      );
    };
    startWatching();
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (location) fetchNearbyStores(location.latitude, location.longitude);
  }, [location]);

  // 최초 추천 호출
  useEffect(() => {
    fetchRecommendedRecipes(false, false);
  }, []);

  const fetchRecommendedRecipes = async (userInfo = false, userAllergic = false) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userUid = await AsyncStorage.getItem("userUid");
      const url =
        `${API_BASE_URL}/api/history/recommended` +
        `?userUid=${encodeURIComponent(userUid)}` +
        `&userInfo=${userInfo}` +
        `&userAllergic=${userAllergic}`;
      const { data } = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setRecommendedRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("추천 레시피 실패:", error.response?.data || error.message);
      setRecommendedRecipes([]);
    }
  };

  const fetchNearbyStores = async (lat, lon) => {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=마트&x=${lon}&y=${lat}&radius=2000&size=10`;
      const response = await fetch(url, { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } });
      const data = await response.json();
      const stores = Array.isArray(data.documents) ? data.documents : [];
      const sorted = stores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 5);
      setNearbyStores(sorted);
    } catch {
      setNearbyStores([]);
    }
  };

  const searchProducts = async () => {
    if (!searchKeyword.trim()) {
      Alert.alert("검색어를 입력해주세요!");
      return;
    }
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/search/recommendations/products?keyword=${encodeURIComponent(searchKeyword)}`
      );
      const data = await res.json();
      setSearchResults(data?.products || []);
    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResults([]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <FlatList
          data={[]}
          ListHeaderComponent={
            <>
              {/* 검색창 */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9AA1A9" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="레시피 검색..."
                  placeholderTextColor="#9AA1A9"
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={() => navigation.navigate("SearchScreen")}
                />
              </View>

              {/* 옵션 칩 */}
              <View style={styles.chipsRow}>
                <Chip
                  active={useUserInfo}
                  icon="sparkles-outline"
                  label="보유 재료 반영"
                  onPress={() => {
                    const next = !useUserInfo;
                    setUseUserInfo(next);
                    fetchRecommendedRecipes(next, useAllergyFilter);
                  }}
                />
                <Chip
                  active={useAllergyFilter}
                  icon="alert-circle-outline"
                  label="알레르기 반영"
                  onPress={() => {
                    const next = !useAllergyFilter;
                    setUseAllergyFilter(next);
                    fetchRecommendedRecipes(useUserInfo, next);
                  }}
                />
              </View>

              {/* 추천 레시피 */}
              <SectionTitle
                right={
                  <TouchableOpacity onPress={() => navigation.navigate("AllRecipesScreen")} hitSlop={8}>
                    <View style={styles.linkRow}>
                      <Text style={styles.linkText}>레시피 모두 보기</Text>
                      <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                    </View>
                  </TouchableOpacity>
                }
              >
                추천 레시피
              </SectionTitle>

              <FlatList
                horizontal
                data={recommendedRecipes}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <RecipeCard
                    item={item}
                    categoryImages={categoryImages}
                    onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 10 }}
                showsHorizontalScrollIndicator={false}
              />

              {/* 지도 섹션 */}
              <SectionTitle>📍 지도에서 주변 상점 보기</SectionTitle>
              <View style={styles.mapContainer}>
                {location && <KakaoMapView location={location} stores={nearbyStores} />}
              </View>

              {/* 주변 상점 리스트 */}
              <SectionTitle>📍 주변 상점</SectionTitle>
              {nearbyStores?.map((item, i) => (
                <TouchableOpacity
                  key={`${item.id || item.place_name}-${i}`}
                  style={styles.storeItem}
                  onPress={() => Linking.openURL(item.place_url)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="location-outline" size={18} color="#111827" />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {item.place_name}
                    </Text>
                    <Text style={styles.storeAddr} numberOfLines={1}>
                      {item.road_address_name || item.address_name}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9AA1A9" />
                </TouchableOpacity>
              ))}

              {/* 상품 검색 */}
              <SectionTitle>상품 검색</SectionTitle>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9AA1A9" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="상품 검색어 입력..."
                  placeholderTextColor="#9AA1A9"
                  value={searchKeyword}
                  onChangeText={setSearchKeyword}
                  onSubmitEditing={searchProducts}
                />
              </View>

              <FlatList
                data={searchResults}
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productRow}
                    onPress={() =>
                      item.productUrl
                        ? Linking.openURL(item.productUrl)
                        : Alert.alert("링크 없음", "해당 상품 링크가 없습니다.")
                    }
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.productThumb} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {item.price ? `${item.price.toLocaleString()}원` : "가격정보 없음"}
                      </Text>
                    </View>
                    <Ionicons name="open-outline" size={18} color="#6B7280" />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                }
                showsVerticalScrollIndicator={false}
                style={{ marginTop: 8 }}
              />

              <View style={{ height: 28 }} />
            </>
          }
        />
        <BottomTab style={styles.bottomTabFixed} />
      </View>
    </SafeAreaView>
  );
};

const CARD_BG = "#FFFFFF";
const SURFACE = "#F7F8FA";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "#6B7280";
const PRIMARY = "#4F46E5";
const BORDER = "#E5E7EB";
const SHADOW =
  Platform.OS === "ios"
    ? { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }
    : { elevation: 4 };

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff", paddingTop: StatusBar.currentHeight || 0 },
  wrapper: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 18 },

  // 섹션 헤더
  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: TEXT_DARK },

  linkRow: { flexDirection: "row", alignItems: "center" },
  linkText: { color: TEXT_MUTED, fontSize: 14, marginRight: 2 },

  // 검색창
  searchContainer: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: TEXT_DARK },

  // 칩
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipIcon: { marginRight: 6, color: PRIMARY },
  chipIconActive: { color: "#FFFFFF" },
  chipText: { fontSize: 13, color: PRIMARY, fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF" },

  // 추천 카드
  recipeCard: {
    width: 170,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    marginRight: 14,
    marginBottom: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
  },
  recipeImage: { width: "100%", height: 110, backgroundColor: "#eee" },
  recipeInfo: { padding: 10, gap: 6 },
  recipeName: { fontSize: 14, fontWeight: "700", color: TEXT_DARK },
  recipeMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  recipeMetaText: { fontSize: 12, color: TEXT_MUTED },

  // 지도
  mapContainer: {
    height: 300,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E9EEF5",
    borderWidth: 1,
    borderColor: BORDER,
    ...SHADOW,
  },

  // 상점 리스트
  storeItem: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
    ...SHADOW,
  },
  storeName: { fontSize: 15, fontWeight: "700", color: TEXT_DARK },
  storeAddr: { fontSize: 13, color: TEXT_MUTED, marginTop: 2 },

  // 상품 검색 리스트
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    ...SHADOW,
  },
  productThumb: { width: 60, height: 60, borderRadius: 10, marginRight: 12, backgroundColor: "#eee" },
  productName: { fontSize: 15, fontWeight: "700", color: TEXT_DARK },
  productPrice: { fontSize: 13, color: TEXT_MUTED, marginTop: 4 },

  emptyText: { textAlign: "center", color: TEXT_MUTED, marginTop: 10 },

  bottomTabFixed: {},
});

export default HomeScreen;
