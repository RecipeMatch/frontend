import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BottomTab() {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route.name;

  return (
    <View style={styles.bottomTab}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.tabButton}
      >
        <Ionicons
          name="home"
          size={28}
          color={currentRouteName === "Home" ? "#1FCC79" : "#777"}
        />
        <Text style={[styles.tabText, currentRouteName === "Home" && styles.activeText]}>
          메인
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Upload")}
        style={styles.tabButton}
      >
        <Ionicons
          name="add-circle-outline"
          size={28}
          color={currentRouteName === "Upload" ? "#1FCC79" : "#777"}
        />
        <Text style={[styles.tabText, currentRouteName === "Upload" && styles.activeText]}>
          업로드
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Community")}
        style={styles.tabButton}
      >
        <Ionicons
          name="chatbubbles-outline"
          size={28}
          color={currentRouteName === "Community" ? "#1FCC79" : "#777"}
        />
        <Text style={[styles.tabText, currentRouteName === "Community" && styles.activeText]}>
          커뮤니티
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Notification")}
        style={styles.tabButton}
      >
        <Ionicons
          name="notifications-outline"
          size={28}
          color={currentRouteName === "Notification" ? "#1FCC79" : "#777"}
        />
        <Text style={[styles.tabText, currentRouteName === "Notification" && styles.activeText]}>
          알림
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.tabButton}
      >
        <Ionicons
          name="person-outline"
          size={28}
          color={currentRouteName === "Profile" ? "#1FCC79" : "#777"}
        />
        <Text style={[styles.tabText, currentRouteName === "Profile" && styles.activeText]}>
          프로필
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
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
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  activeText: {
    color: "#1FCC79",
    fontWeight: "bold",
  },
});