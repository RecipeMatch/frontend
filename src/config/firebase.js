import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN, 
  FIREBASE_PROJECT_ID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID, 
  FIREBASE_APP_ID, 
  FIREBASE_MEASUREMENT_ID 
} from "@env"; // 🔹 .env 변수 불러오기

// 🔹 Firebase 설정 정보 (환경 변수 사용)
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 🔹 인증(Auth) 초기화 (AsyncStorage 적용)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
