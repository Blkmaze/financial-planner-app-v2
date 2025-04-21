import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0co2hBRgGRhyveQRcpoUiSOIFft9MqsA",
  authDomain: "financial-planner-app-7b255.firebaseapp.com",
  projectId: "financial-planner-app-7b255",
  storageBucket: "financial-planner-app-7b255.appspot.com",
  messagingSenderId: "889385402973",
  appId: "1:889385402973:web:your-app-id" // Replace with actual App ID if needed
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
