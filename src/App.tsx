import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { apiService } from './services/api';
import { User } from './types';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check if user is already authenticated and authorized
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      setIsAuthorized(true);
   } else {
      setAuthError('Access denied. You are not authorized to access the admin dashboard.');
      // Clear tokens for unauthorized users
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setIsLoading(false);
  }, []);

  // const checkAdminAuthorization = async () => {
  //   try {
  //     const user = await apiService.getCurrentUser();
  //     setCurrentUser(user);
      
  //     // Check if user email is in AUTHORIZED_ADMINS
  //     const authorizedAdmins = process.env.REACT_APP_AUTHORIZED_ADMINS?.split(',') || ["sachamarciano9@gmail.com","ron12390@gmail.com"];
  //     const isAdmin = authorizedAdmins.includes(user.email);
      
  //     if (isAdmin) {
  //       setIsAuthenticated(true);
  //       setIsAuthorized(true);
  //     } else {
  //       setAuthError('Access denied. You are not authorized to access the admin dashboard.');
  //       // Clear tokens for unauthorized users
  //       localStorage.removeItem('accessToken');
  //       localStorage.removeItem('refreshToken');
  //     }
  //   } catch (error) {
  //     console.error('Authorization check failed:', error);
  //     setAuthError('Failed to verify admin access. Please try logging in again.');
  //     // Clear tokens on error
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async () => {
    setAuthError('');
    // Check if tokens exist after successful login
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      setIsAuthorized(true);
      // Optionally fetch current user data
      try {
        const user = await apiService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Still allow login even if user fetch fails
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setIsAuthorized(false);
    setCurrentUser(null);
    setAuthError('');
  };

  if (isLoading) {
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

  if (!isAuthenticated || !isAuthorized) {
    return <Login onLogin={handleLogin} error={authError} />;
  }

  return (
    <div className="App">
      <Dashboard currentUser={currentUser} onLogout={handleLogout} />
    </div>
  );
}

export default App;
