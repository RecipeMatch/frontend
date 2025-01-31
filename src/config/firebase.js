import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage 추가

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyD5yPs9kXv7RvgWP5SNu2O--_sW2wA7zYA",
  authDomain: "recipematch-6b729.firebaseapp.com",
  projectId: "recipematch-6b729",
  storageBucket: "recipematch-6b729.firebasestorage.app",
  messagingSenderId: "872848629680",
  appId: "1:872848629680:web:24244e12562c4220898075",
  measurementId: "G-QX2PCQRKEL",
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 🔹 인증(Auth) 초기화 (AsyncStorage 적용)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// 구글 로그인
const config = {
  webClientId: "872848629680-mkqahn8lgsng4e9eg8e0p3p220svimn5.apps.googleusercontent.com",
};


// Firebase 인증 내보내기
export { auth };
