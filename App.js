import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

// 네비게이션 스택 생성
const Stack = createStackNavigator();

// 네비게이션을 분리하여 유지보수 용이하게 함
function NavigationProvider() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Expo에서 `App.js`를 정상적으로 인식하도록 등록
export default function App() {
  return <NavigationProvider />;
}

registerRootComponent(App);
