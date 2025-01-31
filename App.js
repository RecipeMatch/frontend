import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import MainScreen from './screens/MainScreen';
import {store} from './redux/store';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import app from './firebase';

console.log('LoginScreen:', LoginScreen);
console.log('MainScreen:', MainScreen);
export default function App() {

  const Stack = createNativeStackNavigator();

  return ( // providr 태그 안에 MainScreen을 넣어줘서 store를 제공한다.
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
       <Stack.Screen name="Main" component={MainScreen} />
       <Stack.Screen name="Login" component={LoginScreen} />
       </Stack.Navigator> 
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
