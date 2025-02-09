console.log("🚀 firebase.js가 실행되었습니다.");  // 실행 여부 확인
// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

console.log("✅ Firebase 관련 모듈 가져오기 완료.");  // 모듈 import 확인

const firebaseConfig = {
    apiKey: "AIzaSyD5yPs9kXv7RvgWP5SNu2O--_sW2wA7zYA",
    authDomain: "recipematch-6b729.firebaseapp.com",
    projectId: "recipematch-6b729",
    storageBucket: "recipematch-6b729.firebasestorage.app",
    messagingSenderId: "872848629680",
    appId: "1:872848629680:web:24244e12562c4220898075",
    measurementId: "G-QX2PCQRKEL"
};

// Firebase 앱 초기화
const firebaseApp = initializeApp(firebaseConfig);
console.log('🔥 Firebase Initialized:', firebaseApp); // Firebase가 정상적으로 초기화되었는지 확인

// Firebase Auth 가져오기
const auth = getAuth(firebaseApp);
console.log('✅ Firebase Auth Loaded:', auth);

export { auth };