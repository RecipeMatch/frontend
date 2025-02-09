import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // 현재 화면 감지
  const [searchText, setSearchText] = useState("");

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
        />
      </View>

      {/* 🔻 하단 네비게이션 바 */}
      <View style={styles.bottomTab}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.tabButton}>
          <Ionicons name="home" size={28} color={isFocused ? "#1FCC79" : "#777"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Upload")} style={styles.tabButton}>
          <Ionicons name="add-circle-outline" size={28} color="#777" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={styles.tabButton}>
          <Ionicons name="notifications-outline" size={28} color="#777" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.tabButton}>
          <Ionicons name="person-outline" size={28} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 50 },
  searchContainer: { flexDirection: "row", backgroundColor: "#f1f1f1", borderRadius: 10, padding: 10, alignItems: "center", marginBottom: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  bottomTab: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", height: 60, backgroundColor: "#fff", elevation: 10, position: "absolute", bottom: 0, left: 0, right: 0, paddingVertical: 10 },
  tabButton: { alignItems: "center" },
});
