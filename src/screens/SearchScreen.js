import React, { useState } from "react";
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const searchHistory = ["김치찌개", "볶음밥", "된장찌개"];
  const recommendedRecipes = ["떡볶이", "카레", "불고기"];

  return (
    <View style={styles.container}>
      {/* 🔍 검색 바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)} style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* ⏳ 이전 검색 기록 */}
        <Text style={styles.sectionTitle}>이전 검색 기록</Text>
        <View style={styles.tagContainer}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity key={index} style={styles.tag}>
              <Ionicons name="time-outline" size={16} color="gray" />
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🔥 추천 검색어 */}
        <Text style={styles.sectionTitle}>추천 검색어</Text>
        <View style={styles.tagContainer}>
          {recommendedRecipes.map((item, index) => (
            <TouchableOpacity key={index} style={styles.tagRecommended}>
              <Ionicons name="flame-outline" size={16} color="gray" />
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 🔽 필터 모달 */}
      <Modal visible={showFilterModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.filterTitle}>필터링</Text>
            <Text style={styles.filterLabel}>카테고리</Text>
            <TextInput style={styles.filterInput} placeholder="예: 한식, 양식, 중식" />
            <Text style={styles.filterLabel}>요리 시간 (분)</Text>
            <TextInput style={styles.filterInput} placeholder="예: 30" keyboardType="numeric" />
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.applyButtonText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 50 },
  searchBar: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { padding: 8 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 10, paddingVertical: 8 },
  filterButton: { padding: 8 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },

  /* 🔹 태그 스타일 (이전 검색 기록 & 추천 검색어) */
  tagContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagRecommended: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAEAFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagText: { fontSize: 16, marginLeft: 5 },

  /* 🔹 필터 모달 스타일 */
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  filterTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  filterLabel: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  filterInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginTop: 10 },
  applyButton: { backgroundColor: "#1FCC79", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  applyButtonText: { color: "#fff", fontWeight: "bold" },
});

export default SearchScreen;
