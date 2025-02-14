import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import UploadScreen from "../screens/UploadScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {!userToken ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
