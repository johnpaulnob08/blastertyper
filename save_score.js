import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc
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

// Exported for use in game logic
export async function saveScore(score) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const displayName = userDoc.exists() ? userDoc.data().displayName || "Player" : "Player";

        await addDoc(collection(db, "scores"), {
          uid: user.uid,
          score: score,
          displayName: displayName,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.error("Error saving score:", e);
      }
    }
  });
}

window.saveScore = saveScore;
