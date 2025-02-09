import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// 배경 이미지 경로 (사용자 첨부 이미지 적용)
import BackgroundImage from "../../assets/images/food_welcome.jpg";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Start Cooking</Text>
        <Text style={styles.subtitle}>Let's join our community to cook better food!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ 어두운 반투명 레이어 추가 (가독성 향상)
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff", // ✅ 흰색으로 가독성 강화
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd", // ✅ 조금 연한 흰색으로 가독성 강화
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
