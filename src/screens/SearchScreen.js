// 📁 src/screens/SearchScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@env";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const OptionButton = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.optionButton, selected && styles.optionButtonSelected]}
    onPress={onPress}
  >
    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const FilterModal = ({ visible, mode, onClose, onApply }) => {
  const { user } = useContext(AuthContext);
  const userUid = user?.email;
  const [selectedSort, setSelectedSort] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (!visible) {
      setSelectedSort(null);
      setSelectedTime(null);
    }
  }, [visible]);

  const handleApply = async () => {
    try {
      console.log("🔥 handleApply called");

      if (mode === "sort") {
        const allRes = await axios.get(`${API_BASE_URL}/api/recipeAll`);
        const recipeIds = allRes.data.map((r) => r.id);
        console.log("📤 정렬 기준:", selectedSort);
        console.log("📦 보내는 recipeIds:", recipeIds);

        const sortRes = await axios.post(`${API_BASE_URL}/api/recipe/sort`, {
          recipeIds,
          sortBy: selectedSort,
        });
        console.log("✅ 정렬 결과 수:", sortRes.data.length);
        onApply(sortRes.data);
      } else if (mode === "time") {
        let min = 0, max = 999;
        if (selectedTime === "30") [min, max] = [0, 30];
        if (selectedTime === "60") [min, max] = [30, 60];
        if (selectedTime === "90") [min, max] = [60, 90];
        if (selectedTime === "999") [min, max] = [90, 999];

        console.log("⏱ 요리 시간 필터:", min, "~", max);

        const res = await axios.post(`${API_BASE_URL}/api/recipe/search`, {
          userUid,
          minTime: min,
          maxTime: max,
          userInfo: true,
        });
        console.log("✅ 시간 필터 결과 수:", res.data.length);
        onApply(res.data);
      }
    } catch (e) {
      console.error("❌ 필터/정렬 실패:", e);
      Alert.alert("에러", "정렬/필터링에 실패했습니다.");
    }
  };

  const renderOptions = () => {
    if (mode === "sort") {
      return ["LIKE", "BOOKMARK"].map((type) => (
        <OptionButton
          key={type}
          label={type === "LIKE" ? "좋아요순" : "즐겨찾기순"}
          selected={selectedSort === type}
          onPress={() => setSelectedSort(type)}
        />
      ));
    } else if (mode === "time") {
      return [
        { label: "30분 이하", value: "30" },
        { label: "30~60분", value: "60" },
        { label: "60~90분", value: "90" },
        { label: "90분 이상", value: "999" },
      ].map((option) => (
        <OptionButton
          key={option.value}
          label={option.label}
          selected={selectedTime === option.value}
          onPress={() => setSelectedTime(option.value)}
        />
      ));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{mode === "sort" ? "정렬 기준" : "요리 시간"}</Text>
          <View style={styles.optionsContainer}>{renderOptions()}</View>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
              <Text style={styles.applyText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleApplyFilter = (data) => {
    console.log("🔥 handleApplyFilter 실행됨. 결과 수:", data.length);
    setRecipes(data);
  };

  const searchHistory = ["김치찌개", "볶음밥", "된장찌개"];
  const recommendedRecipes = ["떡볶이", "카레", "불고기"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <Text style={styles.filterText}>정렬기준 ⬍</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.leftFilter} onPress={() => setShowFilterModal(true)}>
        <Text style={styles.filterText}>요리 시간 ⏱</Text>
      </TouchableOpacity>

      <FlatList
        data={recipes}
        keyExtractor={(item, index) => item?.recipeId?.toString() ?? index.toString()}
        renderItem={({ item }) => {
          const imageUrl = item.imageUrls?.[0] ?? "https://cdn-icons-png.flaticon.com/512/1404/1404945.png";
        
          return (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
            >
              <Image style={styles.recipeImage} source={{ uri: imageUrl }} resizeMode="cover" />
              <Text style={styles.recipeName} numberOfLines={1}>{item.recipeName}</Text>
        
              {/* ⏱ 요리 시간 */}
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
            </TouchableOpacity>
          );
        }}
        
        
        
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>이전 검색 기록</Text>
            <View style={styles.tagContainer}>
              {searchHistory.map((item, index) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Ionicons name="time-outline" size={16} color="gray" />
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>추천 검색어</Text>
            <View style={styles.tagContainer}>
              {recommendedRecipes.map((item, index) => (
                <TouchableOpacity key={index} style={styles.tagRecommended}>
                  <Ionicons name="flame-outline" size={16} color="gray" />
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
      />

      <FilterModal visible={showSortModal} mode="sort" onClose={() => setShowSortModal(false)} onApply={handleApplyFilter} />
      <FilterModal visible={showFilterModal} mode="time" onClose={() => setShowFilterModal(false)} onApply={handleApplyFilter} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    paddingVertical: 8,
  },
  filterText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  leftFilter: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagRecommended: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 16, marginLeft: 5 },
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
    alignItems: "center",
  },
  recipeImage: { width: "100%", height: 120, backgroundColor: "#eee" },
  recipeName: { fontSize: 14, fontWeight: "bold", padding: 8, textAlign: "center" },
  statsContainer: { flexDirection: "row", justifyContent: "center", paddingBottom: 8 },
  statItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8 },
  statText: { fontSize: 14, marginLeft: 4, color: "#444" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#eee",
    marginVertical: 6,
  },
  optionButtonSelected: {
    backgroundColor: "#1FCC79",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  applyButton: {
    backgroundColor: "#1FCC79",
    padding: 10,
    borderRadius: 8,
  },
  recipeTime: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  cancelText: { color: "#000" },
  applyText: { color: "#fff", fontWeight: "bold" },
});

export default SearchScreen;

