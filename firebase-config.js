// firebase-config.js
// Thay config bên dưới bằng config từ Firebase Console của bạn
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export function initFirebase() {
  const firebaseConfig = {
  apiKey: "AIzaSyAhr3M8NstaVwXR3UWIeuwsfcPLSfuEKWo",
  authDomain: "remokerv.firebaseapp.com",
  projectId: "remokerv",
  storageBucket: "remokerv.firebasestorage.app",
  messagingSenderId: "456411908450",
  appId: "1:456411908450:web:1285fad321ac1ef942443b",
  measurementId: "G-FRDZC8DJPJ"
};

  const app = initializeApp(firebaseConfig);
  return getFirestore(app);
}











 /**
  * // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhr3M8NstaVwXR3UWIeuwsfcPLSfuEKWo",
  authDomain: "remokerv.firebaseapp.com",
  projectId: "remokerv",
  storageBucket: "remokerv.firebasestorage.app",
  messagingSenderId: "456411908450",
  appId: "1:456411908450:web:1285fad321ac1ef942443b",
  measurementId: "G-FRDZC8DJPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  */