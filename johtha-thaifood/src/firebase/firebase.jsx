import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD00G9rsM85v5256jk7isI5PCnFIbB2Dgc",
  authDomain: "webapp-johtha-e0661.firebaseapp.com",
  projectId: "webapp-johtha-e0661",
  storageBucket: "webapp-johtha-e0661.appspot.com", // ✅ แก้ตรงนี้
  messagingSenderId: "342385029538",
  appId: "1:342385029538:web:896d5ed37c23faa7e982fb",
  measurementId: "G-S13H3E8FTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Analytics (ใช้เฉพาะ browser)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;