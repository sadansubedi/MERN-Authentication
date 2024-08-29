// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realstate-ce31d.firebaseapp.com",
  projectId: "mern-realstate-ce31d",
  storageBucket: "mern-realstate-ce31d.appspot.com",
  messagingSenderId: "371880286095",
  appId: "1:371880286095:web:99b7bf48843f5a688a5dfa"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);