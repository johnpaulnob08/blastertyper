import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiZQ28ZUAiuXjd_7Xnq_4QeB6iYUR-zWI",
  authDomain: "blastertypergame.firebaseapp.com",
  projectId: "blastertypergame",
  storageBucket: "blastertypergame.appspot.com",
  messagingSenderId: "529599702301",
  appId: "1:529599702301:web:591b249d8c7c490c072df4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  const greeting = document.getElementById("greeting");
  const recentBox = document.querySelector(".recent-placeholder");

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const displayName = userDoc.exists() ? userDoc.data().displayName || "Player" : "Player";
    greeting.textContent = `Hello, ${displayName}!`;
  } else {
    greeting.textContent = "Recent Global Games";
  }

  const scoresRef = collection(db, "scores");
  const q = query(scoresRef, orderBy("timestamp", "desc"), limit(10));
  const querySnapshot = await getDocs(q);

  recentBox.innerHTML = "";

  if (!querySnapshot.empty) {
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const score = data.score;
      const username = data.displayName || "Unknown Player";
      const date = data.timestamp?.toDate().toLocaleString() || "Unknown date";

      const div = document.createElement("div");
      div.classList.add("score-entry");
      div.innerHTML = `
        👤 <strong>${username}</strong><br>
        🕹️ Score: <strong>${score}</strong><br>
        <small>${date}</small>
      `;
      recentBox.appendChild(div);
    });
  } else {
    recentBox.textContent = "No recent games yet.";
  }
});

document.getElementById("startGameBtn").addEventListener("click", () => {
  window.location.href = "game.html";
});
