# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TripWiser Admin Dashboard - A React/TypeScript web application for managing the TripWiser travel planning platform. This dashboard provides comprehensive admin capabilities including user management, trip oversight, affiliate link generation, analytics, and system monitoring.

## Key Commands

### Development
```bash
npm start                 # Start dev server on http://localhost:3000
npm run build            # Build production bundle
npm test                 # Run tests
```

### Environment Setup
The app requires a `.env` file in the root with:
- `REACT_APP_API_URL` - Backend API URL (default: https://tripwiser-backend.onrender.com/api)
- Firebase configuration variables (see `.env` for complete list)
- `REACT_APP_AUTHORIZED_ADMINS` - Comma-separated list of admin emails

## Architecture

### Authentication Flow
**Firebase-based authentication with backend verification:**

1. User authenticates via Firebase (Email/Password, Google, or Apple)
2. Dashboard obtains Firebase ID token
3. Token sent to backend `/auth/firebase/verify` endpoint
4. Backend validates token and checks if user email is in `ADMIN_EMAILS`
5. If authorized, backend returns user data; otherwise returns 403

**Key files:**
- `src/config/firebase.ts` - Firebase initialization and providers
- `src/services/firebaseAuth.ts` - Authentication service (sign in, sign out, token management)
- `src/App.tsx` - Main auth state management using `useAuthState` from `react-firebase-hooks`
- `src/services/api.ts` - API service with automatic Firebase token injection

**Critical:** All API requests automatically include Firebase ID token via axios interceptors. Token refresh is handled automatically.

### API Integration Pattern

**API Service (`src/services/api.ts`):**
- Singleton axios instance with automatic Firebase token injection
- Interceptors handle token refresh and 401 errors automatically
- All admin endpoints accessed through typed methods
- Consistent error handling with automatic logout on authorization failures

**Request Flow:**
```
Component → apiService method → axios interceptor (adds Firebase token) → Backend API
Backend Response → axios interceptor (handles errors) → Component
```

**Important:** When making backend requests, always use `apiService` methods rather than raw axios calls. This ensures proper authentication and error handling.

### State Management

**React Query for server state:**
- Used throughout the application for data fetching, caching, and synchronization
- Query keys follow pattern: `['resource', filters]` (e.g., `['affiliateLinks', filters]`)
- Automatic refetching on window focus and network reconnection
- Mutations trigger query invalidation for optimistic updates

**Local state with hooks:**
- Component-level state managed with `useState`
- Auth state managed via `useAuthState` from Firebase hooks
- No global state management library (Redux/Zustand) - kept simple intentionally

### Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (Button, Card, Input, Badge, StatCard)
│   ├── Dashboard.tsx          # Main dashboard view with system overview
│   ├── AffiliateDashboard.tsx # Affiliate link generation and management
│   └── Login.tsx              # Multi-method login (Email/Google/Apple)
├── services/
│   ├── api.ts                 # API client with Firebase token handling
│   └── firebaseAuth.ts        # Firebase authentication service
├── config/
│   └── firebase.ts            # Firebase initialization and configuration
├── types/
│   └── index.ts               # TypeScript interfaces for all data models
├── App.tsx                    # Root component with auth flow
└── index.tsx                  # Entry point
```

### Backend API Structure

**Base URL:** `https://tripwiser-backend.onrender.com/api`

**Key endpoint patterns:**
- `/auth/firebase/verify` - Verify Firebase token and admin status
- `/auth/me` - Get current user profile
- `/admin/*` - All admin operations (users, trips, analytics, system)
- `/affiliate/*` - Affiliate link generation
- `/admin/affiliate/*` - Affiliate link management

**Admin verification:** Backend checks if authenticated user's email exists in `ADMIN_EMAILS` environment variable. Dashboard assumes all Firebase-authenticated users who pass this check have full admin access.

### Affiliate System Architecture

**Two link types:**
1. **Elite Gift Links** (`/affiliate/generate-elite-link`) - Provides Elite plan subscription to new users
2. **Influencer Links** (`/affiliate/generate-influencer-link`) - Tracks referrals from specific influencers

**Link generation flow:**
- Select link type and configure options (max uses, expiration, description)
- For influencer links, search and select user via `/users/search` endpoint
- Backend generates unique link with `deepLink` field (e.g., `tripwiser://affiliate/ABC123`)
- Deep links work with mobile app, while web URLs redirect appropriately

**Link management:**
- View all links with filtering by type/status via `/admin/affiliate/links`
- Toggle active/inactive status via PUT `/admin/affiliate/links/:id/toggle`
- Delete links via DELETE `/admin/affiliate/links/:id`
- Track analytics via `/admin/affiliate/overview` (clicks, conversions, revenue)

**Critical:** Always use the `deepLink` field from API responses, not the `shortCode` or other fields. The mobile app expects deep links in format `tripwiser://affiliate/{code}`.

## Design System

**Color Palette:**
- Primary: `#6366f1` (Indigo) - Main actions, CTAs
- Success: `#10b981` (Green) - Success states
- Warning: `#f59e0b` (Orange) - Warnings, packing feature
- Destructive: `#d4183d` (Red) - Errors, destructive actions
- Background: `#f8fafc`, Card: `#ffffff`
- Text: `#030213` (primary), `#717182` (secondary)

**Typography:** Inter font family, sizes: 12px-30px following naming convention (xs, sm, base, lg, xl, 2xl, 3xl)

**Spacing:** 4px grid system (4, 8, 12, 16, 20, 24, 32, 48, 64px)

**Components:** All UI components in `src/components/ui/` follow consistent styling patterns with Tailwind-like API (e.g., variant props, size props)

## Common Development Patterns

### Adding a new admin endpoint

1. Add TypeScript interface to `src/types/index.ts` if needed
2. Add method to `ApiService` class in `src/services/api.ts`:
   ```typescript
   async getNewData(): Promise<NewDataType> {
     const response = await this.api.get<ApiResponse<NewDataType>>('/admin/new-endpoint');
     return response.data.data;
   }
   ```
3. Use in component with React Query:
   ```typescript
   const { data, isLoading } = useQuery('newData', () => apiService.getNewData());
   ```

### Adding a new dashboard view

1. Create component in `src/components/` (e.g., `NewDashboard.tsx`)
2. Import lucide-react icons for consistent iconography
3. Use existing UI components from `src/components/ui/`
4. Add navigation in `Dashboard.tsx` if needed
5. Follow existing layout patterns (Card components with header/content structure)

### Error handling

- API errors are caught by axios interceptors
- 401 errors trigger automatic token refresh attempt
- Failed refresh redirects to login page
- Display user-friendly errors using error state in components
- Backend errors typically include `message` field for user display

## Important Notes

### Authentication
- Never bypass Firebase authentication - all admin access requires Firebase token
- Backend is the source of truth for admin authorization
- Logout clears both Firebase session and localStorage tokens

### API Responses
- Backend uses consistent response structure: `{ success: boolean, data: any, message?: string }`
- Always extract data from `response.data.data` (nested data property)
- Some endpoints return arrays within objects (e.g., `{ users: User[], pagination: any }`)

### Affiliate Links
- Deep links are the primary link format for mobile app integration
- `deepLink` field is required in all affiliate link responses
- Web dashboard can display both deep links and web URLs for testing
- Link analytics track clicks, but conversion tracking depends on backend implementation

### TypeScript
- All API responses should be typed with interfaces from `src/types/index.ts`
- Use `ApiResponse<T>` generic wrapper for all API calls
- Avoid `any` types except in legacy code or third-party integrations

### Performance
- React Query handles caching automatically (5 min stale time, 10 min cache time)
- Images should be optimized and lazy loaded
- Use code splitting for large components if needed
- Dashboard loads stats in parallel using React Query

## Testing Notes

### Manual testing admin features
1. Ensure `.env` file exists with correct Firebase config
2. Login with authorized admin email (`sachamarciano9@gmail.com` or `ron12390@gmail.com`)
3. Verify backend `/auth/firebase/verify` endpoint is accessible
4. Check browser console for API errors or auth failures

### Testing affiliate links
1. Generate link via Affiliate Dashboard
2. Verify `deepLink` field is present in response
3. Test deep link opens mobile app (if app is installed)
4. Test web URL redirects appropriately (for users without app)
5. Verify link appears in links list with correct status

## Troubleshooting

**"Access denied" error:** User email not in backend `ADMIN_EMAILS` environment variable

**Firebase auth errors:** Check Firebase config in `.env` matches project settings

**API 401 errors:** Token expired and refresh failed - check backend Firebase Admin SDK configuration

**Missing `deepLink` in affiliate response:** Backend API issue - verify affiliate endpoints are updated

**Module not found errors:** Run `npm install` to ensure all dependencies are installed
