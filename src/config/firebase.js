// src/firebase.js
import firebase from "firebase";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAvTopFYcA7edQ3kJo6OdtZpmbrIGD9cRc",
  authDomain: "chineseflashcards-55c62.firebaseapp.com",
  databaseURL: "https://chineseflashcards-55c62.firebaseio.com",
  projectId: "chineseflashcards-55c62",
  storageBucket: "chineseflashcards-55c62.appspot.com",
  messagingSenderId: "437788442231"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;
