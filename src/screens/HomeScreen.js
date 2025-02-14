import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BottomTab from "../../components/BottomTab";

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 현재 화면 감지
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 🔹 임시 데이터 (추후 백엔드 연동 예정)
  const searchHistory = ["김치찌개", "볶음밥", "된장찌개"];
  const recommendedRecipes = ["떡볶이", "카레", "불고기"];

  return (
    <View style={styles.container}>
      {/* 🔍 검색 바 */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for recipes..."
          value={searchText}
          onChangeText={setSearchText}
          onFocus={() => setShowSuggestions(true)}
        />
      </View>

      {/* 🔻 검색창을 눌렀을 때 추천 목록 표시 */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {/* 🔹 이전 검색 기록 */}
          <Text style={styles.sectionTitle}>이전 검색 기록</Text>
          <FlatList
            data={searchHistory}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem}>
                <Ionicons name="time-outline" size={18} color="gray" />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* 🔹 추천 레시피 */}
          <Text style={styles.sectionTitle}>추천 레시피</Text>
          <FlatList
            data={recommendedRecipes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem}>
                <Ionicons name="fast-food-outline" size={18} color="gray" />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* 🔻 검색창 외부 클릭 시 추천 목록 닫기 */}
      {showSuggestions && (
        <TouchableOpacity style={styles.overlay} onPress={() => setShowSuggestions(false)} />
      )}

      {/* 🔻 하단 네비게이션 바 */}
      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 50 },
  searchContainer: { flexDirection: "row", backgroundColor: "#f1f1f1", borderRadius: 10, padding: 10, alignItems: "center", marginBottom: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  suggestionsContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  suggestionItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  suggestionText: { fontSize: 16, marginLeft: 8 },
  overlay: { position: "absolute", top: 100, left: 0, right: 0, bottom: 0 },
  bottomTab: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", height: 60, backgroundColor: "#fff", elevation: 10, position: "absolute", bottom: 0, left: 0, right: 0, paddingVertical: 10 },
  tabButton: { alignItems: "center" },
});

export default HomeScreen;
