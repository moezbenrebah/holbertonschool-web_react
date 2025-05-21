// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCE1JAcdlXIdRycp8xbvnnpcMJhDEDToA",
  authDomain: "holberton-cf87f.firebaseapp.com",
  projectId: "holberton-cf87f",
  storageBucket: "holberton-cf87f.appspot.com",
  messagingSenderId: "584086758508",
  appId: "1:584086758508:web:941436ab9cf03e0f5f2449",
  measurementId: "G-NB6EKCL2JR"
};

// ✅ Initialize app BEFORE using it
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, storage, auth };
