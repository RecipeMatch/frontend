import React, { useState, useContext } from "react";
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
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import FilterModal from "./FilterModal";

const getDefaultImageUrl = (category) => {
  switch (category) {
    case "KOREAN":
      return `${API_BASE_URL}/images/korean.jpg`;
    case "WESTERN":
      return `${API_BASE_URL}/images/western.jpg`;
    case "CHINESE":
      return `${API_BASE_URL}/images/chinese.jpg`;
    case "JAPANESE":
      return `${API_BASE_URL}/images/japanese.jpg`;
    default:
      return `${API_BASE_URL}/images/default.jpg`;
  }
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);

  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [filterState, setFilterState] = useState({
    difficulty: null,
    minTime: null,
    maxTime: null,
    userInfo: false,
    category: null,
    sortBy: null,
  });

  const applySearchWithFilter = async (customFilter = {}) => {
    const fullFilter = {
      ...filterState,
      ...customFilter,
      keyword: searchText,
      userUid: userInfo?.uid,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/recipe/search`, fullFilter);
      let result = [...res.data];
      const activeSort = customFilter.sortBy ?? sortBy;
      if (activeSort === "LIKE") result.sort((a, b) => b.likeSize - a.likeSize);
      else if (activeSort === "BOOKMARK") result.sort((a, b) => b.bookMarkSize - a.bookMarkSize);
      setRecipes(result);
    } catch (e) {
      console.error("❌ 검색/필터 실패:", e);
      Alert.alert("에러", "레시피를 불러오는 중 문제가 발생했습니다.");
    }
  };

  const handleApplyFilter = async (partialFilter) => {
    const updatedSortBy = partialFilter.sortBy ?? sortBy;
    setSortBy(updatedSortBy);
    setFilterState((prev) => ({ ...prev, ...partialFilter }));
    await applySearchWithFilter({ ...partialFilter, sortBy: updatedSortBy });
  };

  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    applySearchWithFilter();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.searchBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.searchInput}
                placeholder="레시피 이름으로 검색"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearchSubmit}
              />
              <TouchableOpacity onPress={handleSearchSubmit}>
                <Ionicons name="search-outline" size={22} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterBtn, filterState.minTime !== null && styles.selected]}
                onPress={() => setShowFilterModal(true)}
              >
                <Text style={styles.filterText}>
                  {filterState.minTime === 0 && filterState.maxTime === 30
                    ? "30분 이하"
                    : filterState.minTime === 30 && filterState.maxTime === 60
                    ? "30~60분"
                    : filterState.minTime === 60 && filterState.maxTime === 90
                    ? "60~90분"
                    : filterState.minTime === 90
                    ? "90분 이상"
                    : "요리 시간 ⏱"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBtn, !!filterState.difficulty && styles.selected]}
                onPress={() => setShowLevelModal(true)}
              >
                <Text style={styles.filterText}>
                  {filterState.difficulty === "EASY"
                    ? "초보 🎚"
                    : filterState.difficulty === "MIDDLE"
                    ? "보통 🎚"
                    : filterState.difficulty === "HARD"
                    ? "어려움 🎚"
                    : "난이도 🎚"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBtn, !!filterState.category && styles.selected]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={styles.filterText}>
                  {{
                    KOREAN: "한식",
                    CHINESE: "중식",
                    JAPANESE: "일식",
                    WESTERN: "양식",
                    SOUTHEAST_ASIAN: "동남아시아",
                    ITALIAN: "이탈리안",
                    FUSION: "퓨전",
                    DEFAULT: "기본",
                  }[filterState.category] ?? "카테고리 🍱"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBtn, filterState.userInfo && styles.selected]}
                onPress={() => setShowUserModal(true)}
              >
                <Text style={styles.filterText}>
                  {filterState.userInfo ? "내 정보 필터 ✅" : "내 정보 필터"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterBtn, sortBy && styles.selected]}
                onPress={() => setShowSortModal(true)}
              >
                <Text style={styles.filterText}>
                  {sortBy === "LIKE"
                    ? "좋아요순"
                    : sortBy === "BOOKMARK"
                    ? "즐겨찾기순"
                    : "정렬기준 ⬍"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
            activeOpacity={0.8}
          >
            <View style={styles.recipeCard}>
              <Image
                source={{ uri: item.imageUrls?.[0] ?? getDefaultImageUrl(item.category) }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeName}>{item.recipeName}</Text>
              <Text style={styles.recipeTime}>⏱ {item.cookingTime}분</Text>
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
        )}
        
      />
      <FilterModal visible={showSortModal} mode="sort" onClose={() => setShowSortModal(false)} onApply={handleApplyFilter} filterState={filterState} />
      <FilterModal visible={showFilterModal} mode="time" onClose={() => setShowFilterModal(false)} onApply={handleApplyFilter} filterState={filterState} />
      <FilterModal visible={showLevelModal} mode="level" onClose={() => setShowLevelModal(false)} onApply={handleApplyFilter} filterState={filterState} />
      <FilterModal visible={showUserModal} mode="userinfo" onClose={() => setShowUserModal(false)} onApply={handleApplyFilter} filterState={filterState} />
      <FilterModal visible={showCategoryModal} mode="category" onClose={() => setShowCategoryModal(false)} onApply={handleApplyFilter} filterState={filterState} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: StatusBar.currentHeight || 40, paddingHorizontal: 20 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: "#d6f5e3",
    borderColor: "#1FCC79",
    borderWidth: 1,
  },
  filterText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  recipeImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recipeName: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 12,
    marginTop: 10,
  },
  recipeTime: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    marginHorizontal: 12,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
    gap: 20,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontWeight: "600", fontSize: 13, color: "#333" },
});

export default SearchScreen;
