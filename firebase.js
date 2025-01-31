console.log("🚀 firebase.js가 실행되었습니다.");  // 실행 여부 확인
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

console.log("✅ Firebase 관련 모듈 가져오기 완료.");  // 모듈 import 확인


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlYq3azzuS4N4Fo3cGnkzEW9_0zuQcoec",
  authDomain: "react-native-recipe-app-cf43a.firebaseapp.com",
  projectId: "react-native-recipe-app-cf43a",
  storageBucket: "react-native-recipe-app-cf43a.firebasestorage.app",
  messagingSenderId: "1091857883173",
  appId: "1:1091857883173:web:a73750832367b4e409dfcc"
};

console.log("✅ Firebase 설정 로드 완료.");  // Firebase 설정 확인

// ✅ Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase Initialized:", app);

// ✅ Firebase 인증 초기화 (AsyncStorage 적용)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
console.log("✅ Firebase Auth Object:", auth);

// ✅ Firestore 초기화
const db = getFirestore(app);
console.log("✅ Firestore Initialized:", db);

// ✅ Firebase 객체 export
export { app, auth, db };
