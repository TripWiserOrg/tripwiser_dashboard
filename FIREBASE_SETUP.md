# Firebase Authentication Setup Guide

## ✅ Implementation Complete!

Firebase authentication has been successfully integrated into your TripWiser Admin Dashboard. Follow the steps below to complete the setup.

---

## 📋 Required Environment Variables

Create a `.env` file in the root directory with the following configuration:

```bash
# Backend API Configuration
REACT_APP_API_URL=https://tripwiser-backend.onrender.com/api

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyDRJXJc2uqRsPwRbDjsw0Fu0tkjdZUniQQ
REACT_APP_FIREBASE_AUTH_DOMAIN=tripwiser-90959.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tripwiser-90959
REACT_APP_FIREBASE_STORAGE_BUCKET=tripwiser-90959.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=511793482274
REACT_APP_FIREBASE_APP_ID=1:511793482274:web:8353abb4ffc18678f8d87b
```

---

## 🔧 What Has Been Implemented

### 1. **Firebase Configuration** (`src/config/firebase.ts`)
- ✅ Firebase app initialization
- ✅ Google provider setup
- ✅ Apple provider setup
- ✅ Auth instance export

### 2. **Firebase Authentication Service** (`src/services/firebaseAuth.ts`)
- ✅ Email/Password sign-in
- ✅ Google sign-in
- ✅ Apple sign-in
- ✅ Sign out functionality
- ✅ Token management (automatic refresh)
- ✅ Backend verification for admin status

### 3. **Updated API Service** (`src/services/api.ts`)
- ✅ Uses Firebase tokens instead of JWT
- ✅ Automatic token refresh in interceptors
- ✅ Proper error handling with Firebase auth

### 4. **Updated Login Component** (`src/components/Login.tsx`)
- ✅ Email/Password login
- ✅ Google login button
- ✅ Apple login button
- ✅ Improved error messages
- ✅ Admin privilege error handling

### 5. **Updated App Component** (`src/App.tsx`)
- ✅ Firebase auth state listener
- ✅ Backend admin verification
- ✅ Proper loading states
- ✅ Error handling for unauthorized access

---

## 🚀 How to Use

### For Admins to Login:

1. **Email/Password Login:**
   - Admin must have a Firebase account (created in Firebase Console or via app registration)
   - Email must be in backend's `ADMIN_EMAILS` environment variable
   - Enter credentials and click "Sign In with Email"

2. **Google Login:**
   - Click "Sign In with Google"
   - Select Google account
   - Email must be in backend's `ADMIN_EMAILS` to get admin access

3. **Apple Login:**
   - Click "Sign In with Apple"
   - Authenticate with Apple ID
   - Email must be in backend's `ADMIN_EMAILS` to get admin access

### Authentication Flow:

```
1. User signs in with Firebase (email/password, Google, or Apple)
   ↓
2. Dashboard gets Firebase ID token
   ↓
3. Token sent to backend: POST /auth/firebase/verify
   ↓
4. Backend verifies token and checks if email is in ADMIN_EMAILS
   ↓
5. If authorized: Admin gets access to dashboard
   If not authorized: Error message displayed
```

---

## 🔐 Backend Setup Required

Your backend must have the `/auth/firebase/verify` endpoint that:

1. Accepts Firebase ID token
2. Verifies the token with Firebase Admin SDK
3. Checks if user's email is in `ADMIN_EMAILS` environment variable
4. Returns success/failure response

**Backend Environment Variables Needed:**
```bash
ADMIN_EMAILS=admin1@example.com,admin2@example.com,sachamarciano9@gmail.com,ron12390@gmail.com
```

---

## 👥 Adding New Admins

To add a new admin:

1. **Have them create a Firebase account:**
   - Email/Password: In Firebase Console → Authentication → Users → Add User
   - Or let them sign up via Google/Apple

2. **Add their email to backend:**
   ```bash
   # In backend .env file
   ADMIN_EMAILS=existing@admin.com,new@admin.com
   ```

3. **Restart backend** to load new admin emails

4. **Admin can now login** via dashboard

---

## 🧪 Testing

### Test Admin Login:
```bash
# Use an email from ADMIN_EMAILS
Email: sachamarciano9@gmail.com
Password: [Firebase password]
```

### Test Non-Admin (Should Fail):
```bash
# Use any email NOT in ADMIN_EMAILS
Email: regular@user.com
Password: [their password]
# Expected: "Access denied. Admin privileges required."
```

---

## 🔍 Troubleshooting

### "Access denied. Admin privileges required."
- ✅ Verify email is in backend's `ADMIN_EMAILS`
- ✅ Check backend environment variables loaded correctly
- ✅ Restart backend after changing `ADMIN_EMAILS`

### "Invalid email or password"
- ✅ Check Firebase Console for user account
- ✅ Verify password is correct
- ✅ Try password reset if needed

### "Popup blocked by browser"
- ✅ Allow popups for this site
- ✅ Try different browser
- ✅ Use email/password instead

### Firebase not loading
- ✅ Check `.env` file exists in root directory
- ✅ Verify all Firebase config values are correct
- ✅ Restart development server: `npm start`

---

## 📦 Dependencies Installed

The following packages were added:

```json
{
  "firebase": "^10.x.x",
  "react-firebase-hooks": "^5.x.x"
}
```

---

## 🎯 Next Steps

1. ✅ Create `.env` file with Firebase configuration (see above)
2. ✅ Ensure backend has `/auth/firebase/verify` endpoint
3. ✅ Add admin emails to backend `ADMIN_EMAILS`
4. ✅ Test login with admin account
5. ✅ Test login with non-admin account (should fail)

---

## 📁 Files Modified/Created

**Created:**
- `src/config/firebase.ts` - Firebase configuration
- `src/services/firebaseAuth.ts` - Firebase auth service
- `FIREBASE_SETUP.md` - This guide

**Modified:**
- `src/App.tsx` - Updated to use Firebase auth
- `src/components/Login.tsx` - Added Google/Apple login
- `src/services/api.ts` - Updated to use Firebase tokens
- `package.json` - Added Firebase dependencies

---

## 🔒 Security Notes

- ✅ Firebase tokens automatically refresh
- ✅ Admin verification happens on backend
- ✅ No admin credentials in frontend code
- ✅ Secure token storage
- ✅ Automatic logout on unauthorized access

---

**Last Updated:** January 2025  
**Status:** ✅ Ready for Testing

