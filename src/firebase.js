// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEi-yZFMtdYRfhA8IzfgpmQ1I6tX4FZ8A",
  authDomain: "jobt-task.firebaseapp.com",
  projectId: "jobt-task",
  storageBucket: "jobt-task.firebasestorage.app",
  messagingSenderId: "462628130846",
  appId: "1:462628130846:web:e6ae39586ca3d100a39e0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;