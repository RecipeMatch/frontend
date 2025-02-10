import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackgroundImage from "../../assets/images/food_welcome.jpg";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <Text style={styles.title}>RecipeMatch</Text>
        <Text style={styles.subtitle}>쉽고 맛있게, 나만의 레시피!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>🍽 요리 시작!</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#f8f8f8",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1FCC79",
    paddingVertical: 14,
    paddingHorizontal: 38,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
