import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiZQ28ZUAiuXjd_7Xnq_4QeB6iYUR-zWI",
  authDomain: "blastertypergame.firebaseapp.com",
  projectId: "blastertypergame",
  storageBucket: "blastertypergame.firebasestorage.app",
  messagingSenderId: "529599702301",
  appId: "1:529599702301:web:591b249d8c7c490c072df4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
  const email = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
