// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMHPMRm3psVvvw9uICHLq2NuZW4wySi70",
  authDomain: "e-commerce-55e6b.firebaseapp.com",
  projectId: "e-commerce-55e6b",
  storageBucket: "e-commerce-55e6b.appspot.com",
  messagingSenderId: "273045714684",
  appId: "1:273045714684:web:182af4bf0aec1a0939c979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
