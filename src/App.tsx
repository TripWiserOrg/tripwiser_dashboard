import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { firebaseAuthService } from './services/firebaseAuth';
import { apiService } from './services/api';
import { User } from './types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import './App.css';

function App() {
  const [firebaseUser, firebaseLoading] = useAuthState(auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for Firebase auth state to be determined
        if (firebaseLoading) {
          return;
        }

        // If no Firebase user, not authenticated
        if (!firebaseUser) {
          const firebaseToken = localStorage.getItem('firebaseToken');
          if (firebaseToken) {
            // Token exists but user not loaded yet, wait a bit
            setTimeout(() => setIsLoading(false), 500);
          } else {
            setIsLoading(false);
          }
          return;
        }

        // Firebase user exists, verify with backend
        const token = await firebaseAuthService.getToken();
        if (token) {
          try {
            // Fetch current user from backend to verify admin status
            const user = await apiService.getCurrentUser();
            setCurrentUser(user);
            setIsAuthorized(true);
          } catch (error: any) {
            console.error('Authorization check failed:', error);
            if (error.response?.status === 403 || error.message?.includes('Admin privileges required')) {
              setAuthError('Access denied. You are not authorized to access the admin dashboard.');
              await firebaseAuthService.signOut();
            } else {
              setAuthError('Failed to verify admin access. Please try logging in again.');
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthError('Authentication error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [firebaseUser, firebaseLoading]);

  const handleLogin = async () => {
    setAuthError('');
    setIsLoading(true);
    
    try {
      // Firebase auth already completed in Login component
      // Just fetch user data and update state
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
      setIsAuthorized(true);
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      if (error.response?.status === 403 || error.message?.includes('Admin privileges required')) {
        setAuthError('Access denied. Admin privileges required.');
        await firebaseAuthService.signOut();
      } else {
        // Still allow login even if user fetch fails
        setIsAuthorized(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await firebaseAuthService.signOut();
      setIsAuthorized(false);
      setCurrentUser(null);
      setAuthError('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading || firebaseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-lg shadow-lg">
            <img 
              src="/assets/logo.png" 
              alt="TripWiser Logo" 
              className="h-10 w-10 object-contain animate-pulse"
            />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-md"></div>
          <p className="text-muted-foreground font-medium">Loading TripWiser Admin...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser || !isAuthorized) {
    return <Login onLogin={handleLogin} error={authError} />;
  }

  return (
    <div className="App">
      <Dashboard currentUser={currentUser} onLogout={handleLogout} />
    </div>
  );
}

export default App;
