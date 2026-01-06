// Firebase configuration using CDN imports (for vanilla HTML/JS)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYyuD5-cNdDG9pNkZqu3GNiKCksmTlcDc",
  authDomain: "gym-tracker-bogi.firebaseapp.com",
  projectId: "gym-tracker-bogi",
  storageBucket: "gym-tracker-bogi.firebasestorage.app",
  messagingSenderId: "1042119277094",
  appId: "1:1042119277094:web:35fdab2baca267a84244e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth, doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, ref, uploadBytes, getDownloadURL, signInWithEmailAndPassword, signOut, onAuthStateChanged };
