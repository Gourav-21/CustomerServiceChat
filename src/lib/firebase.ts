// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrm4HvLIh_Ildk12Y7Yvlx0f36yumCBRc",
  authDomain: "chat-8639e.firebaseapp.com",
  projectId: "chat-8639e",
  storageBucket: "chat-8639e.appspot.com",
  messagingSenderId: "577560535989",
  appId: "1:577560535989:web:abca634f93c6812a92effc",
  measurementId: "G-QZ5GDVLXKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export {  db };