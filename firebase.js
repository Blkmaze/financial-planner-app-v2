# fix-firebase.ps1
$firebaseFile = "src\firebase.js"

# Backup the existing file if it exists
if (Test-Path $firebaseFile) {
    Copy-Item $firebaseFile "$firebaseFile.bak" -Force
    Write-Host "✅ Backup created: $firebaseFile.bak"
}

# Define the Firebase config content
$firebaseContent = @'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0co2hBRgGRhyveQRcpoUiSOIFft9MqsA",
  authDomain: "financial-planner-app-7b255.firebaseapp.com",
  projectId: "financial-planner-app-7b255",
  storageBucket: "financial-planner-app-7b255.appspot.com",
  messagingSenderId: "889385402973",
  appId: "1:889385402973:web:your-app-id", // Replace if you want to specify it
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
'@

# Write content to firebase.js
$firebaseContent | Set-Content -Path $firebaseFile -Encoding UTF8

Write-Host "`n✅ Firebase configuration successfully written to $firebaseFile"
