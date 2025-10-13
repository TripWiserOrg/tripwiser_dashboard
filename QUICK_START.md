# 🚀 Quick Start Guide - Firebase Authentication

## ⚡ Get Started in 3 Steps

### **Step 1: Create Environment File**

Create a file named `.env` in the root directory (same level as `package.json`):

```bash
REACT_APP_API_URL=https://tripwiser-backend.onrender.com/api
REACT_APP_FIREBASE_API_KEY=AIzaSyDRJXJc2uqRsPwRbDjsw0Fu0tkjdZUniQQ
REACT_APP_FIREBASE_AUTH_DOMAIN=tripwiser-90959.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tripwiser-90959
REACT_APP_FIREBASE_STORAGE_BUCKET=tripwiser-90959.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=511793482274
REACT_APP_FIREBASE_APP_ID=1:511793482274:web:8353abb4ffc18678f8d87b
```

**Windows CMD:**
```cmd
echo REACT_APP_API_URL=https://tripwiser-backend.onrender.com/api > .env
echo REACT_APP_FIREBASE_API_KEY=AIzaSyDRJXJc2uqRsPwRbDjsw0Fu0tkjdZUniQQ >> .env
echo REACT_APP_FIREBASE_AUTH_DOMAIN=tripwiser-90959.firebaseapp.com >> .env
echo REACT_APP_FIREBASE_PROJECT_ID=tripwiser-90959 >> .env
echo REACT_APP_FIREBASE_STORAGE_BUCKET=tripwiser-90959.firebasestorage.app >> .env
echo REACT_APP_FIREBASE_MESSAGING_SENDER_ID=511793482274 >> .env
echo REACT_APP_FIREBASE_APP_ID=1:511793482274:web:8353abb4ffc18678f8d87b >> .env
```

**PowerShell:**
```powershell
@"
REACT_APP_API_URL=https://tripwiser-backend.onrender.com/api
REACT_APP_FIREBASE_API_KEY=AIzaSyDRJXJc2uqRsPwRbDjsw0Fu0tkjdZUniQQ
REACT_APP_FIREBASE_AUTH_DOMAIN=tripwiser-90959.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tripwiser-90959
REACT_APP_FIREBASE_STORAGE_BUCKET=tripwiser-90959.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=511793482274
REACT_APP_FIREBASE_APP_ID=1:511793482274:web:8353abb4ffc18678f8d87b
"@ | Out-File -FilePath .env -Encoding ASCII
```

**Or manually:**
1. Create new file named `.env` (no extension)
2. Copy the configuration above
3. Save in root directory

---

### **Step 2: Start the Dashboard**

```bash
npm start
```

The dashboard will open at `http://localhost:3000`

---

### **Step 3: Login**

You'll see a beautiful login screen with **3 options**:

#### **Option 1: Email/Password**
- Enter your Firebase email and password
- Click "Sign In with Email"

#### **Option 2: Google**
- Click "Sign In with Google"
- Select your Google account

#### **Option 3: Apple**
- Click "Sign In with Apple"
- Authenticate with Apple ID

---

## 🔑 Admin Access

Your email must be in the backend's `ADMIN_EMAILS` list to access the dashboard.

**Current Admins:**
- `sachamarciano9@gmail.com`
- `ron12390@gmail.com`

**If you're not an admin:**
You'll see: _"Access denied. Admin privileges required."_

---

## ✅ What's New

### **Login Methods:**
✅ Email/Password  
✅ Google Sign-In  
✅ Apple Sign-In  

### **Security:**
✅ Firebase authentication  
✅ Backend admin verification  
✅ Automatic token refresh  
✅ Secure session management  

### **UI Improvements:**
✅ Beautiful login screen  
✅ Social login buttons with icons  
✅ Better error messages  
✅ Loading states  

---

## 🆘 Troubleshooting

### **Dashboard won't start?**
```bash
# Install dependencies
npm install

# Then start
npm start
```

### **Login not working?**
1. ✅ Check `.env` file exists
2. ✅ Verify configuration is correct
3. ✅ Restart server: `npm start`

### **"Access denied" error?**
- Your email must be in backend's `ADMIN_EMAILS`
- Contact backend admin to add your email

### **Google/Apple popup blocked?**
- Allow popups in browser settings
- Or use email/password instead

---

## 📚 More Documentation

- **`IMPLEMENTATION_SUMMARY.md`** - Complete implementation details
- **`FIREBASE_SETUP.md`** - Detailed setup and configuration guide
- **`README.md`** - General project information

---

## 🎯 Next Steps

After logging in, you can:
- ✅ View platform statistics
- ✅ Manage users
- ✅ Generate affiliate links
- ✅ Monitor system health
- ✅ Access all admin features

---

**That's it! You're ready to go! 🚀**

If you encounter any issues, check the troubleshooting section above or refer to `FIREBASE_SETUP.md` for detailed help.

