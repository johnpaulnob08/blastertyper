import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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
const db = getFirestore(app);

const submit = document.getElementById("submitBtn");

submit.addEventListener("click", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: username,
      });
    })
    .then(() => {
      alert("User registered successfully");
      window.location.href = "login_page.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});
