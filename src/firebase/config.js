import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ_NKcRew6q3HFRI1adt0eDqoz4vX6KCw",
  authDomain: "mini-blog-68ef7.firebaseapp.com",
  projectId: "mini-blog-68ef7",
  storageBucket: "mini-blog-68ef7.appspot.com",
  messagingSenderId: "58080511666",
  appId: "1:58080511666:web:782cca422e45ba4daaebab"
};

const app = initializeApp(firebaseConfig);

const  db = getFirestore(app);

export { db };