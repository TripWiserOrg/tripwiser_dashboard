import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../config/firebase';
import { User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'https://tripwiser-backend.onrender.com/api';

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
  };
}

export const firebaseAuthService = {
  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      // Step 1: Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Step 2: Verify with backend (checks admin status)
      const response = await fetch(`${API_URL}/auth/firebase/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const result: AuthResponse = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Authentication failed');
      }
      
      // Store Firebase token for future requests
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('firebaseUser', JSON.stringify(userCredential.user));
      
      return result.data.user;
      
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      }
      throw error;
    }
  },

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      // Verify with backend
      const response = await fetch(`${API_URL}/auth/firebase/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data: AuthResponse = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('firebaseUser', JSON.stringify(result.user));
      
      return data.data.user;
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please allow popups for this site.');
      }
      throw error;
    }
  },

  /**
   * Sign in with Apple
   */
  async signInWithApple(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const idToken = await result.user.getIdToken();
      
      // Verify with backend
      const response = await fetch(`${API_URL}/auth/firebase/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      
      const data: AuthResponse = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      localStorage.setItem('firebaseToken', idToken);
      localStorage.setItem('firebaseUser', JSON.stringify(result.user));
      
      return data.data.user;
      
    } catch (error: any) {
      console.error('Apple sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please allow popups for this site.');
      }
      throw error;
    }
  },

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('firebaseToken');
      localStorage.removeItem('firebaseUser');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  /**
   * Get current Firebase token (for API requests)
   * Automatically refreshes if needed
   */
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      try {
        // Force refresh to ensure token is valid
        return await user.getIdToken(true);
      } catch (error) {
        console.error('Error getting token:', error);
        return localStorage.getItem('firebaseToken');
      }
    }
    return localStorage.getItem('firebaseToken');
  },

  /**
   * Get current Firebase user
   */
  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser || !!localStorage.getItem('firebaseToken');
  }
};

export default firebaseAuthService;

