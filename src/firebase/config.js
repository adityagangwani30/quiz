import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, update, remove, push } from 'firebase/database';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app = null;
let db = null;
let firebaseEnabled = false;

try {
  if (firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    firebaseEnabled = true;
  }
} catch (e) {
  console.warn('Firebase not configured. Using localStorage fallback.');
}

// ============= FIREBASE OPERATIONS =============

export const saveTeamSession = async (sessionId, data) => {
  if (firebaseEnabled && db) {
    try {
      await set(ref(db, `sessions/${sessionId}`), {
        ...data,
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn('Firebase save failed, using localStorage');
    }
  }
  // Always save to localStorage as fallback
  localStorage.setItem(`kiadb_session_v2_${sessionId}`, JSON.stringify(data));
};

export const getTeamSession = async (sessionId) => {
  if (firebaseEnabled && db) {
    try {
      const snapshot = await get(ref(db, `sessions/${sessionId}`));
      if (snapshot.exists()) return snapshot.val();
    } catch (e) {
      console.warn('Firebase read failed, using localStorage');
    }
  }
  const data = localStorage.getItem(`kiadb_session_v2_${sessionId}`);
  return data ? JSON.parse(data) : null;
};

export const saveLeaderboardEntry = async (entry) => {
  if (firebaseEnabled && db) {
    try {
      await set(ref(db, `leaderboard/${entry.sessionId}`), {
        ...entry,
        submittedAt: Date.now()
      });
      return;
    } catch (e) {
      console.warn('Firebase leaderboard save failed');
    }
  }
  // localStorage fallback for leaderboard
  const existing = JSON.parse(localStorage.getItem('kiadb_leaderboard_v2') || '[]');
  const idx = existing.findIndex(e => e.sessionId === entry.sessionId);
  if (idx >= 0) existing[idx] = entry;
  else existing.push(entry);
  localStorage.setItem('kiadb_leaderboard_v2', JSON.stringify(existing));
};

export const getLeaderboard = async () => {
  if (firebaseEnabled && db) {
    try {
      const snapshot = await get(ref(db, 'leaderboard'));
      if (snapshot.exists()) {
        return Object.values(snapshot.val())
          .sort((a, b) => b.finalScore - a.finalScore);
      }
    } catch (e) {
      console.warn('Firebase leaderboard read failed');
    }
  }
  const data = JSON.parse(localStorage.getItem('kiadb_leaderboard_v2') || '[]');
  return data.sort((a, b) => b.finalScore - a.finalScore);
};

export const onLeaderboardUpdate = (callback) => {
  if (firebaseEnabled && db) {
    return onValue(ref(db, 'leaderboard'), (snapshot) => {
      if (snapshot.exists()) {
        const entries = Object.values(snapshot.val())
          .sort((a, b) => b.finalScore - a.finalScore);
        callback(entries);
      } else {
        callback([]);
      }
    });
  }
  // Poll localStorage for updates
  const interval = setInterval(() => {
    const data = JSON.parse(localStorage.getItem('kiadb_leaderboard_v2') || '[]');
    callback(data.sort((a, b) => b.finalScore - a.finalScore));
  }, 2000);
  return () => clearInterval(interval);
};

// Admin operations
export const getAllSessions = async () => {
  if (firebaseEnabled && db) {
    try {
      const snapshot = await get(ref(db, 'sessions'));
      if (snapshot.exists()) return Object.values(snapshot.val());
    } catch (e) {
      console.warn('Firebase sessions read failed');
    }
  }
  const keys = Object.keys(localStorage).filter(k => k.startsWith('kiadb_session_v2_'));
  return keys.map(k => JSON.parse(localStorage.getItem(k)));
};

export const clearAllData = async () => {
  if (firebaseEnabled && db) {
    try {
      await remove(ref(db, 'sessions'));
      await remove(ref(db, 'leaderboard'));
    } catch (e) { /* silent */ }
  }
  const keys = Object.keys(localStorage).filter(k => k.startsWith('kiadb_'));
  keys.forEach(k => localStorage.removeItem(k));
};

export const updateSessionScore = async (sessionId, score) => {
  if (firebaseEnabled && db) {
    try {
      await update(ref(db, `sessions/${sessionId}`), { adjustedScore: score });
      await update(ref(db, `leaderboard/${sessionId}`), { finalScore: score, adjusted: true });
    } catch (e) { /* silent */ }
  }
};

export { firebaseEnabled };
