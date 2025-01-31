import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>홈 화면</Text>
      <Button title="로그인" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

export default HomeScreen;
