import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDRJXJc2uqRsPwRbDjsw0Fu0tkjdZUniQQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "tripwiser-90959.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "tripwiser-90959",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "tripwiser-90959.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "511793482274",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:511793482274:web:8353abb4ffc18678f8d87b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export auth methods
export {
  signInWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  type User
};

export default app;

