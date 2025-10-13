import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { firebaseAuthService } from '../services/firebaseAuth';
import { Chrome, Apple } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  error?: string;
}

export function Login({ onLogin, error: propError }: LoginProps) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await firebaseAuthService.signInWithEmail(credentials.email, credentials.password);
      onLogin();
    } catch (err: any) {
      if (err.message?.includes('Admin privileges required') || err.message?.includes('not authorized')) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await firebaseAuthService.signInWithGoogle();
      onLogin();
    } catch (err: any) {
      if (err.message === 'Sign-in cancelled') {
        setError('');
      } else if (err.message?.includes('Admin privileges required') || err.message?.includes('not authorized')) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.message || 'Google login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await firebaseAuthService.signInWithApple();
      onLogin();
    } catch (err: any) {
      if (err.message === 'Sign-in cancelled') {
        setError('');
      } else if (err.message?.includes('Admin privileges required') || err.message?.includes('not authorized')) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.message || 'Apple login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-lg relative overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/login_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Login Card */}
      <Card className="w-full max-w-lg relative z-10 animate-fade-in shadow-2xl border-0 bg-white">
        <CardHeader className="text-center pb-lg bg-white">
          <div className="mx-auto mb-lg">
            <div className="h-24 w-24 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto shadow-lg">
              <img 
                src="/assets/logo.png" 
                alt="TripWiser Logo" 
                height={150}
                width={150}
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient-primary font-racing">
            TripWiser Admin
          </CardTitle>
          <p className="text-muted-foreground mt-sm">Sign in to your admin dashboard</p>
        </CardHeader>
        <CardContent className="bg-white">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="admin@tripwiser.com"
              required
              className="h-14 text-base"
            />
            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter your password"
              required
              className="h-14 text-base"
            />
            {(error || propError) && (
              <div className="text-sm text-destructive bg-destructive/10 p-md rounded-lg border border-destructive/20 flex items-center gap-sm">
                <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error || propError}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In with Email'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold"
            >
              <Chrome className="h-5 w-5 mr-2" />
              Sign In with Google
            </Button>

            <Button 
              type="button"
              variant="outline"
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full h-14 text-base font-semibold"
            >
              <Apple className="h-5 w-5 mr-2" />
              Sign In with Apple
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
