// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2jp3UQSKLpW5vPV95xV6xKWhZCu1uQA8",
  authDomain: "rn-bookapp-e626c.firebaseapp.com",
  projectId: "rn-bookapp-e626c",
  storageBucket: "rn-bookapp-e626c.firebasestorage.app",
  messagingSenderId: "610339982106",
  appId: "1:610339982106:web:1c28619891d8564cdd7aa3",
  measurementId: "G-CDX7SL615S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);