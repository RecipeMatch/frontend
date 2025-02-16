import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BottomTab() {
  const navigation = useNavigation();
  const route = useRoute(); // ✅ 현재 경로 가져오기
  const currentRouteName = route.name; // ✅ 현재 활성화된 화면 이름 가져오기

  return (
    <View style={styles.bottomTab}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.tabButton}>
        <Ionicons name="home" size={28} color={currentRouteName === "Home" ? "#1FCC79" : "#777"} />
        <Text style={[styles.tabText, currentRouteName === "Home" && styles.activeText]}>메인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Upload")} style={styles.tabButton}>
        <Ionicons name="add-circle-outline" size={28} color={currentRouteName === "Upload" ? "#1FCC79" : "#777"} />
        <Text style={[styles.tabText, currentRouteName === "Upload" && styles.activeText]}>업로드</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={styles.tabButton}>
        <Ionicons name="notifications-outline" size={28} color={currentRouteName === "Notification" ? "#1FCC79" : "#777"} />
        <Text style={[styles.tabText, currentRouteName === "Notification" && styles.activeText]}>목록</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.tabButton}>
        <Ionicons name="person-outline" size={28} color={currentRouteName === "Profile" ? "#1FCC79" : "#777"} />
        <Text style={[styles.tabText, currentRouteName === "Profile" && styles.activeText]}>프로필</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70, // ✅ 높이 증가하여 텍스트 공간 확보
    backgroundColor: "#fff",
    elevation: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12, // ✅ 텍스트 크기 조정
    color: "#777",
    marginTop: 2, // ✅ 아이콘과 간격 추가
  },
  activeText: {
    color: "#1FCC79", // ✅ 활성화된 화면일 때 색상 강조
    fontWeight: "bold",
  },
});
