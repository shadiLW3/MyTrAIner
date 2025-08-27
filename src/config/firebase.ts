import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYnlqZwQZ-i6yMlsPEjwP_SzVX2hJzhbk",
  authDomain: "mytrainer-cccb0.firebaseapp.com",
  projectId: "mytrainer-cccb0",
  storageBucket: "mytrainer-cccb0.firebasestorage.app",
  messagingSenderId: "1000210639558",
  appId: "1:1000210639558:web:d86748a987cd02781805c7",
  measurementId: "G-LB1LFH0L5W"
};

// Initialize Firebase



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);