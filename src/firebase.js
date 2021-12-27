// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
//import { initializeApp } from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB60_dDWO-6nlAQYeZdfL8chi4-6vZGRk4",
  authDomain: "whatsapp-clone-d3270.firebaseapp.com",
  projectId: "whatsapp-clone-d3270",
  storageBucket: "whatsapp-clone-d3270.appspot.com",
  messagingSenderId: "665197750962",
  appId: "1:665197750962:web:0d4d4561512c6aab99f7ab"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
//const provider = new auth.GoogleAuthProvider()
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage().ref('images');
const audioStorage = firebase.storage().ref('audios')
const createTimestamp = firebase.firestore.FieldValue.serverTimestamp;
const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;

export {
    db,
    auth,
    provider,
    storage,
    audioStorage,
    createTimestamp,
    serverTimestamp
}