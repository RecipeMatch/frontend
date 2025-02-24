import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./src/context/AuthContext";
import { UploadProvider } from "./src/context/UploadContext"; // ✅ UploadProvider 추가
import { StatusBar } from "react-native";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import UploadScreen from "./src/screens/UploadScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ProfileEditScreen from "./src/screens/ProfileEditScreen";
import UploadScreen2 from "./src/screens/UploadScreen2";
import SearchScreen from "./src/screens/SearchScreen";

const Stack = createStackNavigator();

function NavigationProvider() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UploadScreen2" component={UploadScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />      
        <Stack.Screen name="MyRecipeList" component={Myrecipe} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <AuthProvider>
        <UploadProvider>
          <NavigationProvider />
        </UploadProvider>
      </AuthProvider>
    </>
  );
}

registerRootComponent(App);
