# TripWiser Admin/Developer Dashboard Development Prompt

## Project Overview

You are tasked with creating a comprehensive, modern, and feature-rich **admin/developer dashboard** for **TripWiser** - a travel planning and management application. This dashboard will serve as the central hub for the founder/developer to monitor, manage, and analyze the entire TripWiser platform, including user management, system analytics, content moderation, and business insights.

## TripWiser Frontend Assets & Visual Elements

### **Brand Assets**

- **Logo**: `logo.png` - Main TripWiser logo (used in app icon, headers, splash screen)
- **Logo with Name**: `logo_name.png` - Combined logo and text version
- **Name Only**: `name.png` - Text-only version of TripWiser branding
- **Amazon Integration**: `amazon.png` - Amazon affiliate integration asset

### **Background Images**

- **Login Background**: `login_bg.jpg` - Background image for login screen
- **Signup Background**: `signup_bg.jpg` - Background image for registration screen

### **Custom Fonts**

- **RacingSansOne-Regular.ttf**: Custom display font for headers and branding
- **Sriracha-Regular.ttf**: Custom script font for decorative text elements

### **UI Component Patterns**

- **Card Design**: Rounded corners (12px), subtle shadows, white backgrounds
- **Button Variants**: Primary (indigo), Secondary (light gray), Outline, Ghost, Destructive (red)
- **Input Fields**: Rounded borders, light gray backgrounds, consistent padding
- **Modal Design**: Bottom sheet style for mobile, centered for desktop
- **Header Components**: Logo + search functionality, consistent spacing
- **Floating Action Button**: Circular, primary color, with optional menu expansion
- **Status Badges**: Rounded pills with color coding for trip status
- **Progress Indicators**: Visual progress bars with percentage displays
- **Icon Usage**: Ionicons throughout the app for consistency

### **Screen Layout Patterns**

- **Main Screens**: Header with logo/search, content area with cards, floating action button
- **Detail Screens**: Hero image section, tabbed content, action buttons
- **Form Screens**: Sectioned layout with clear labels, consistent input styling
- **Auth Screens**: Full-screen background images with centered forms
- **Modal Screens**: Bottom sheet presentation with header and content sections

### **Color Usage Guidelines**

- **Primary Actions**: Use `#6366f1` (indigo) for main CTAs and important elements
- **Success States**: Use `#10b981` (green) for completed items, success messages
- **Warning States**: Use `#f59e0b` (orange) for pending items, warnings
- **Error States**: Use `#d4183d` (red) for errors, destructive actions
- **Feature Differentiation**:
  - Packing lists: Orange theme (`#f59e0b`)
  - Itinerary: Purple theme (`#a855f7`)
  - Journal: Green theme (`#10b981`)
- **Text Hierarchy**: Dark blue (`#030213`) for primary text, gray (`#717182`) for secondary
- **Backgrounds**: Light gray (`#f8fafc`) for main background, white (`#ffffff`) for cards

### **Spacing & Layout**

- **Consistent 4px Grid**: All spacing follows 4px increments (4, 8, 12, 16, 20, 24, 32, 48, 64px)
- **Card Padding**: 16px (lg) standard padding for card content
- **Screen Padding**: 16px (lg) horizontal padding for screen content
- **Section Spacing**: 24px (xl) between major sections
- **Element Spacing**: 8px (sm) between related elements, 16px (lg) between different groups

### **Typography Hierarchy**

- **Page Titles**: 24px (2xl), bold weight, dark blue color
- **Section Headers**: 18px (lg), semibold weight, dark blue color
- **Card Titles**: 18px (lg), semibold weight, dark blue color
- **Body Text**: 16px (base), normal weight, dark blue color
- **Secondary Text**: 14px (sm), normal weight, gray color
- **Caption Text**: 12px (xs), normal weight, gray color
- **Button Text**: 14px (sm), medium weight, appropriate contrast color

### **Component Implementation Patterns**

- **Button Component**: Multiple variants (default, destructive, outline, secondary, ghost, link) with size options (sm, default, lg, icon)
- **Card Component**: Modular structure with CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- **Input Component**: Consistent styling with placeholder support, validation states, and accessibility features
- **Search Bar**: Integrated search functionality with clear button and icon positioning
- **Modal Components**: Bottom sheet presentation with header, content, and footer sections
- **Floating Action Button**: Animated menu expansion with smooth transitions and proper positioning
- **Header Components**: MainScreenHeader with logo, search, and action buttons; SecondaryScreenHeader for detail screens
- **Loading Components**: Lottie animations for different loading states (AI processing, general loading, etc.)
- **Error Boundaries**: FeatureErrorBoundary and ErrorBoundary for graceful error handling
- **Status Components**: Progress bars, status badges, and completion indicators

### **Navigation Patterns**

- **Bottom Tab Navigation**: Primary navigation with icons for main sections
- **Stack Navigation**: Screen-to-screen navigation with back buttons and headers
- **Modal Navigation**: Overlay modals for forms, settings, and detailed views
- **Deep Linking**: Support for external links and app-to-app navigation
- **Gesture Navigation**: Swipe gestures for card interactions and modal dismissal

### **Data Display Patterns**

- **Trip Cards**: Image header, title, details, progress indicators, and action buttons
- **List Views**: Consistent item spacing, dividers, and interaction states
- **Grid Layouts**: Responsive card grids with proper spacing and alignment
- **Detail Views**: Hero sections, tabbed content, and contextual actions
- **Empty States**: Illustrative empty states with clear calls-to-action
- **Loading States**: Skeleton screens and animated loading indicators

### **App Configuration & Environment**

- **App Name**: TripWiser
- **Bundle ID**: com.tripwiser.app (iOS), com.tripwiser.android.app (Android)
- **Version**: 1.1.0
- **URL Scheme**: tripwiser://
- **Splash Screen**: White background with centered logo
- **App Icon**: Uses logo.png as the main icon
- **Orientation**: Portrait mode
- **Platforms**: iOS and Android
- **Build System**: Expo with EAS Build
- **Environment Variables**:
  - API Base URL: https://tripwiser-backend.onrender.com/api
  - Google Maps API Key: Configured for location services
  - Google OAuth Client IDs: Separate for web, iOS, and Android
  - Apple Sign-In: Enabled with proper configuration
  - Notification Configuration: Expo notifications with custom icon and color

### **Third-Party Integrations**

- **Google Maps**: Location services, maps, and directions
- **Google Sign-In**: OAuth authentication
- **Apple Sign-In**: Native iOS authentication
- **Cloudinary**: Image upload and management
- **Expo Notifications**: Push notifications
- **Expo Image Picker**: Camera and photo library access
- **Expo Secure Store**: Secure token storage
- **AsyncStorage**: Local data persistence
- **Lottie**: Animation rendering
- **React Native Maps**: Map components and interactions

## Backend API Information

### Base URL

- **Development**: `https://e2fb1ffcfa14.ngrok-free.app/api`
- **Production**: `https://tripwiser-backend.onrender.com/api`

### Authentication

- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <access_token>`
- **Token Refresh**: Available via `/auth/refresh` endpoint
- **Admin Access**: Requires elevated permissions for admin endpoints
- **Security**: Multi-factor authentication recommended for admin access

### Available API Endpoints

#### Authentication & User Management

```
POST /auth/register          - Register new user
POST /auth/login             - Login with email/password
POST /auth/google            - Google OAuth login
POST /auth/apple             - Apple OAuth login
POST /auth/refresh           - Refresh JWT token
POST /auth/logout            - Logout user
GET  /auth/me                - Get current user profile
GET  /auth/test              - Test auth system
```

#### Trip Management

```
GET    /trips                - Get all user trips (owned + collaborated)
POST   /trips                - Create new trip
GET    /trips/:id            - Get specific trip details
PUT    /trips/:id            - Update trip
DELETE /trips/:id            - Delete trip
POST   /trips/:id/collaborators - Add collaborator
DELETE /trips/:id/collaborators/:userId - Remove collaborator
POST   /trips/:id/share      - Share trip
GET    /trips/:id/summary    - Get trip summary
```

#### Packing Lists

```
GET    /packing-lists/trip/:tripId     - Get packing list for trip
POST   /packing-lists                  - Create packing list
PUT    /packing-lists/:id              - Update packing list
POST   /packing-lists/:id/categories   - Add category
PUT    /packing-lists/:id/categories/:categoryId - Update category
DELETE /packing-lists/:id/categories/:categoryId - Delete category
POST   /packing-lists/:id/categories/:categoryId/items - Add item
PUT    /packing-lists/:id/categories/:categoryId/items/:itemId - Update item
DELETE /packing-lists/:id/categories/:categoryId/items/:itemId - Delete item
PATCH  /packing-lists/:id/categories/:categoryId/items/:itemId/toggle - Toggle item
```

#### Itinerary Management

```
GET    /itinerary/trip/:tripId         - Get itinerary for trip
POST   /itinerary                      - Create itinerary
PUT    /itinerary/:id                  - Update itinerary
GET    /itinerary/generate/:tripId     - Generate AI itinerary
POST   /itinerary/:id/days             - Add day to itinerary
PUT    /itinerary/:id/days/:dayId      - Update day
DELETE /itinerary/:id/days/:dayId      - Delete day
POST   /itinerary/:id/days/:dayId/activities - Add activity
PUT    /itinerary/:id/days/:dayId/activities/:activityId - Update activity
DELETE /itinerary/:id/days/:dayId/activities/:activityId - Delete activity
```

#### Journal Management

```
GET    /journals/trip/:tripId          - Get journal for trip
POST   /journals                       - Create journal
PUT    /journals/:id                   - Update journal
POST   /journals/:id/entries           - Add journal entry
PUT    /journals/:id/entries/:entryId  - Update entry
DELETE /journals/:id/entries/:entryId  - Delete entry
POST   /journals/:id/entries/:entryId/links - Add link to entry
```

#### User Management

```
GET    /users/profile                  - Get user profile
PUT    /users/profile                  - Update user profile
GET    /users/preferences              - Get user preferences
PUT    /users/preferences              - Update preferences
GET    /users/plan                     - Get user plan
PUT    /users/plan                     - Update user plan
GET    /users/stats                    - Get user statistics
GET    /users/content                  - Get user content
GET    /users/:id                      - Get user by ID
POST   /users/block                    - Block user
DELETE /users/block/:userId            - Unblock user
```

#### Discovery & Social Features

```
GET    /discovery/posts                - Get discovery posts
POST   /discovery/posts                - Create discovery post
GET    /discovery/posts/:id            - Get specific post
PUT    /discovery/posts/:id            - Update post
DELETE /discovery/posts/:id            - Delete post
POST   /discovery/posts/:id/like       - Like post
DELETE /discovery/posts/:id/like       - Unlike post
POST   /discovery/posts/:id/share      - Share post
GET    /discovery/trending             - Get trending destinations
GET    /discovery/search               - Search posts
```

#### Templates & Tips

```
GET    /templates                      - Get available templates
GET    /templates/saved                - Get saved templates
POST   /templates/saved                - Save template
DELETE /templates/saved/:id            - Remove saved template
POST   /templates/apply/:id            - Apply template to trip
GET    /templates/my                   - Get user's templates
POST   /templates/create               - Create template
GET    /tips                           - Get travel tips
POST   /tips                           - Create tip
GET    /tips/saved                     - Get saved tips
POST   /tips/saved                     - Save tip
```

#### Weather & External Services

```
GET    /weather/current/:location      - Get current weather
GET    /weather/forecast/:location     - Get weather forecast
GET    /images/search                  - Search images
POST   /images/upload                  - Upload image
```

#### Payments & Subscriptions

```
GET    /payments/status                - Get payment status
GET    /payments/history               - Get payment history
POST   /payments/apple/verify          - Verify Apple payment
POST   /payments/google/verify         - Verify Google payment
```

#### Notifications

```
GET    /notifications                  - Get user notifications
PUT    /notifications/:id/read         - Mark notification as read
PUT    /notifications/read-all         - Mark all as read
GET    /notifications/preferences      - Get notification preferences
PUT    /notifications/preferences      - Update preferences
```

#### Moderation & Reports

```
POST   /reports                        - Report content
GET    /reports                        - Get reports (admin)
PUT    /reports/:id                    - Update report status
```

#### Admin-Only Endpoints (Require Admin Authentication)

```
GET    /admin/users                    - Get all users (admin)
GET    /admin/users/:id                - Get user details (admin)
PUT    /admin/users/:id                - Update user (admin)
DELETE /admin/users/:id                - Delete user (admin)
GET    /admin/trips                    - Get all trips (admin)
GET    /admin/trips/:id                - Get trip details (admin)
PUT    /admin/trips/:id                - Update trip (admin)
DELETE /admin/trips/:id                - Delete trip (admin)
GET    /admin/analytics                - Get platform analytics (admin)
GET    /admin/system/health            - Get system health (admin)
GET    /admin/system/logs              - Get system logs (admin)
GET    /admin/system/metrics           - Get system metrics (admin)
POST   /admin/notifications/broadcast  - Send broadcast notification (admin)
GET    /admin/payments/overview        - Get payment overview (admin)
GET    /admin/content/moderate         - Get content for moderation (admin)
PUT    /admin/content/:id/moderate     - Moderate content (admin)
```

## Data Models

### User Model

```javascript
{
  id: ObjectId,
  name: String,
  email: String,
  auth_provider: ['local', 'google', 'apple'],
  plan: ['free', 'pro', 'elite'],
  avatar: String,
  bio: String,
  preferences: String,
  savedTemplates: [ObjectId],
  savedTips: [ObjectId],
  aiRegenerationCount: Number,
  lastLoginAt: Date,
  blockedUsers: [ObjectId],
  created_at: Date,
  updated_at: Date
}
```

### Trip Model

```javascript
{
  id: ObjectId,
  user: ObjectId,
  ownerId: ObjectId,
  name: String,
  destination: String,
  location: {
    place_id: String,
    lat: String,
    lon: String,
    display_name: String,
    address: {
      name: String,
      city: String,
      country: String,
      country_code: String
    }
  },
  startDate: String,
  endDate: String,
  duration: Number,
  travelers: Number,
  tripType: [String], // business, leisure, adventure, family, romantic, wellness, cultural, backpacking, roadtrip
  activities: [String],
  highlights: [String],
  caption: String,
  additionalInfo: String,
  image: String,
  public: Boolean,
  sharing: {
    trip: String,
    packing: String,
    itinerary: String,
    journal: String
  },
  collaborators: [ObjectId],
  packingListId: ObjectId,
  itineraryId: ObjectId,
  journalId: ObjectId,
  summary: Mixed,
  preview: Mixed,
  completed: Boolean,
  sharedPhotos: [String],
  likes: Number,
  likedBy: [ObjectId],
  shares: Number,
  sharedBy: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model

```javascript
{
  id: ObjectId,
  userId: ObjectId,
  title: String,
  body: String,
  type: String, // trip_collaborator_added, trip_reminder, weather_alert, etc.
  data: Mixed,
  sentAt: Date,
  status: ['sent', 'delivered', 'failed'],
  readAt: Date
}
```

## Admin Dashboard Requirements

### 1. Core Admin Dashboard Features

#### **System Overview Dashboard**

- **Platform Statistics Cards**: Total users, active users, total trips, system health
- **Real-time Activity Feed**: User registrations, trip creations, API calls, errors
- **System Health Widget**: Server status, database connections, API response times
- **Revenue Metrics**: Subscription revenue, payment processing, plan distribution
- **Quick Admin Actions**: User management, content moderation, system maintenance

#### **User Management Interface**

- **User Grid/List View**: All users with filtering and search capabilities
- **Advanced User Filtering**: By registration date, plan type, activity level, location
- **User Search**: Search by name, email, user ID, or activity
- **Bulk User Operations**: Mass actions for user management, plan changes, notifications
- **User Detail Views**: Complete user profiles, activity history, subscription details
- **User Actions**: Suspend/activate accounts, change plans, send notifications, view data

#### **Business Analytics & Insights**

- **User Growth Metrics**: Registration trends, retention rates, churn analysis
- **Revenue Analytics**: Monthly recurring revenue, plan upgrades, payment success rates
- **Platform Usage**: Most popular features, API usage patterns, peak usage times
- **Geographic Distribution**: User locations, popular destinations, regional trends
- **Content Analytics**: Trip creation rates, template usage, discovery engagement
- **Performance Metrics**: System uptime, response times, error rates

#### **Content & Moderation Management**

- **Content Overview**: All trips, posts, templates, and user-generated content
- **Moderation Queue**: Reported content, flagged items, review status
- **Content Filtering**: By type, status, user, date, moderation flags
- **Bulk Content Actions**: Approve, reject, delete, feature content
- **Content Analytics**: Popular content, engagement metrics, sharing statistics
- **Template Management**: Create, edit, approve, and manage travel templates

### 2. Advanced Admin Features

#### **System Monitoring & Alerts**

- **Real-time System Monitoring**: Server performance, database health, API status
- **Alert Management**: Configure alerts for system issues, high error rates, performance degradation
- **Log Analysis**: Centralized logging with search, filtering, and analysis capabilities
- **Performance Tracking**: API response times, database query performance, user experience metrics
- **Error Tracking**: Error rates, stack traces, user impact analysis

#### **Business Intelligence & Reporting**

- **Custom Reports**: Generate reports on user behavior, revenue, content performance
- **Data Export**: Export user data, analytics, and system metrics
- **Trend Analysis**: Identify patterns in user behavior, content creation, system usage
- **A/B Testing Dashboard**: Monitor and analyze feature experiments
- **Competitive Analysis**: Track market trends and user preferences

#### **Advanced User Management**

- **User Segmentation**: Create and manage user segments based on behavior, demographics, usage
- **Automated Workflows**: Set up automated actions for user onboarding, retention, churn prevention
- **Communication Tools**: Send targeted notifications, emails, in-app messages to user segments
- **User Journey Analysis**: Track user paths through the platform, identify drop-off points
- **Support Integration**: Link to customer support tickets, user feedback, bug reports

#### **Platform Administration**

- **Feature Flags**: Enable/disable features for specific users or user segments
- **System Configuration**: Manage app settings, API configurations, third-party integrations
- **Backup & Recovery**: Monitor backup status, manage data recovery procedures
- **Security Management**: Monitor security events, manage access controls, audit logs
- **Database Administration**: Query database, manage indexes, monitor performance

### 3. Technical Requirements

#### **Frontend Technology Stack**

- **Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **UI Library**: Material-UI (MUI) v5 or Ant Design
- **Charts**: Chart.js or Recharts
- **Maps**: Google Maps API or Mapbox
- **Date Handling**: date-fns or dayjs
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Forms**: React Hook Form with validation
- **Icons**: Material Icons or React Icons
- **Animation**: Lottie React Native for loading animations
- **Image Handling**: Expo Image Picker for photo uploads
- **Authentication**: Expo Apple Authentication, Google Sign-In
- **Notifications**: Expo Notifications
- **Storage**: AsyncStorage for local data persistence

#### **Design System**

- **Color Palette**:
  - **Primary**: `#6366f1` (Indigo) - Main brand color for buttons, links, and accents
  - **Secondary**: `#f3f3f5` (Light Gray) - Secondary backgrounds and subtle elements
  - **Background**: `#f8fafc` (Very Light Gray) - Main app background
  - **Card Background**: `#ffffff` (White) - Card and modal backgrounds
  - **Foreground**: `#030213` (Dark Blue) - Primary text color
  - **Muted Foreground**: `#717182` (Medium Gray) - Secondary text and placeholders
  - **Border**: `rgba(0, 0, 0, 0.1)` - Subtle borders and dividers
  - **Success**: `#10b981` (Green) - Success states and positive actions
  - **Warning**: `#f59e0b` (Orange) - Warning states and alerts
  - **Destructive**: `#d4183d` (Red) - Error states and destructive actions
  - **Feature Colors**:
    - **Packing**: `#f59e0b` (Orange) - Packing list feature
    - **Itinerary**: `#a855f7` (Purple) - Itinerary feature
    - **Journal**: `#10b981` (Green) - Journal feature
- **Typography**:
  - **Font Sizes**: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl), 24px (2xl), 30px (3xl)
  - **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
  - **Custom Fonts**: RacingSansOne-Regular.ttf, Sriracha-Regular.ttf
- **Spacing**: Consistent 4px grid system (4, 8, 12, 16, 20, 24, 32, 48, 64px)
- **Border Radius**: 4px (sm), 6px (md), 12px (lg), 18px (xl), 24px (2xl), 9999px (full)
- **Shadows**: Subtle elevation with multiple levels (sm, md, lg, xl)
- **Components**: Reusable, accessible components with consistent styling
- **Responsive Design**: Mobile-first approach, tablet and desktop optimized

#### **Performance Requirements**

- **Loading Times**: < 2 seconds for initial load
- **Bundle Size**: Optimized with code splitting
- **Caching**: Implement proper caching strategies
- **Lazy Loading**: Load components and data on demand
- **Image Optimization**: Compress and lazy load images

#### **Accessibility**

- **WCAG 2.1 AA Compliance**: Meet accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios
- **Focus Management**: Clear focus indicators

### 4. Dashboard Layout Structure

#### **Header/Navigation**

- **Logo**: TripWiser Admin branding
- **Main Navigation**: Dashboard, Users, Content, Analytics, System, Reports
- **Admin Menu**: Profile, Settings, Logs, Alerts, Logout
- **Global Search**: Search across users, content, logs, and system data
- **System Status Indicator**: Real-time system health status
- **Alert Bell**: System alerts and notifications

#### **Sidebar (Optional)**

- **Quick Stats**: User count, system health, revenue metrics
- **Recent Activity**: Latest user registrations, content creation, system events
- **Quick Actions**: User management, content moderation, system maintenance
- **Navigation Shortcuts**: Jump to critical admin functions

#### **Main Content Area**

- **System Overview**: Platform statistics, health metrics, recent activity
- **User Management**: User grid/list with advanced filtering and actions
- **Content Management**: Content moderation, template management, analytics
- **System Administration**: Monitoring, configuration, maintenance tools

#### **Footer**

- **Links**: Privacy Policy, Terms of Service, Support
- **Social Media**: Links to social platforms
- **Version Info**: App version and last updated

### 5. API Integration Guidelines

#### **Authentication Flow**

```javascript
// Login and store tokens
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
};

// Auto-refresh tokens
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await api.post("/auth/refresh", { refreshToken });
  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
};
```

#### **Error Handling**

```javascript
// Global error handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await refreshToken();
        return api.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
```

#### **Data Fetching Patterns**

```javascript
// React Query for data fetching
const {
  data: trips,
  isLoading,
  error,
} = useQuery(
  "trips",
  () => api.get("/trips").then((res) => res.data.data.trips),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);
```

### 6. Key Admin Dashboard Pages

#### **System Overview Dashboard**

- Platform health status and key metrics
- Real-time user activity and system events
- Revenue and subscription analytics
- Quick access to critical admin functions
- System alerts and notifications
- Performance metrics and uptime statistics

#### **User Management Page**

- Complete user database with advanced filtering
- User search and segmentation tools
- Bulk user operations and management
- User detail views with activity history
- Plan management and subscription controls
- User communication and notification tools

#### **Content Management Page**

- All user-generated content overview
- Content moderation queue and tools
- Template management and creation
- Content analytics and engagement metrics
- Bulk content operations
- Content policy enforcement tools

#### **Analytics & Reports Page**

- Business intelligence dashboards
- Custom report generation
- User behavior analytics
- Revenue and growth metrics
- Content performance analysis
- Export and data visualization tools

#### **System Administration Page**

- Server and database monitoring
- API performance and health metrics
- Log analysis and error tracking
- System configuration management
- Backup and recovery status
- Security monitoring and audit logs

#### **Reports & Insights Page**

- Automated report generation
- Trend analysis and forecasting
- A/B testing results
- Competitive analysis
- User journey mapping
- Business performance insights

### 7. Mobile Responsiveness

#### **Mobile-First Design**

- Touch-friendly interface
- Swipe gestures for navigation
- Optimized for thumb navigation
- Reduced data usage
- Offline capabilities where possible

#### **Breakpoints**

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

#### **Mobile-Specific Features**

- Pull-to-refresh
- Infinite scroll
- Bottom navigation
- Floating action buttons
- Gesture-based interactions

### 8. Security Considerations

#### **Data Protection**

- Secure token storage
- HTTPS enforcement
- Input validation
- XSS protection
- CSRF protection

#### **Privacy Features**

- Data export functionality
- Account deletion
- Privacy settings
- Content visibility controls
- Block/unblock users

### 9. Performance Optimization

#### **Code Splitting**

```javascript
// Lazy load components
const TripsPage = lazy(() => import("./pages/TripsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
```

#### **Image Optimization**

- WebP format support
- Lazy loading
- Responsive images
- CDN integration

#### **Caching Strategy**

- Service worker for offline support
- API response caching
- Image caching
- Static asset caching

### 10. Testing Requirements

#### **Unit Testing**

- Component testing with React Testing Library
- Utility function testing
- API integration testing
- State management testing

#### **Integration Testing**

- User flow testing
- API endpoint testing
- Authentication flow testing
- Error handling testing

#### **E2E Testing**

- Critical user journeys
- Cross-browser testing
- Mobile device testing
- Performance testing

### 11. Deployment & DevOps

#### **Build Process**

- TypeScript compilation
- Bundle optimization
- Asset optimization
- Environment configuration

#### **Deployment**

- Static hosting (Vercel, Netlify)
- CDN integration
- Environment variables
- Health checks

#### **Monitoring**

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- API monitoring

## Success Criteria

### Functional Requirements

- ✅ All API endpoints properly integrated for admin access
- ✅ Admin authentication and authorization working
- ✅ User management fully functional
- ✅ Content moderation tools operational
- ✅ System monitoring and alerts working
- ✅ Analytics and business intelligence accurate

### Performance Requirements

- ✅ Initial load time < 2 seconds
- ✅ Page transitions < 500ms
- ✅ API response times < 1 second
- ✅ 99.9% uptime
- ✅ Mobile performance optimized

### User Experience Requirements

- ✅ Intuitive navigation
- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ Error handling graceful
- ✅ Loading states clear

### Technical Requirements

- ✅ TypeScript implementation
- ✅ Component reusability
- ✅ Code maintainability
- ✅ Security best practices
- ✅ Testing coverage > 80%

## Additional Considerations

### Future Enhancements

- **Advanced Monitoring**: Real-time system monitoring with Grafana/Prometheus integration
- **Machine Learning Insights**: Predictive analytics for user behavior and system performance
- **API Management**: Advanced API monitoring, rate limiting, and usage analytics
- **Multi-tenant Support**: Support for multiple environments and deployments
- **Advanced Security**: Security scanning, vulnerability assessment, compliance monitoring
- **Automated Operations**: Automated scaling, deployment, and maintenance workflows

### Third-Party Integrations

- **Monitoring Tools**: Grafana, Prometheus, DataDog, New Relic
- **Analytics Platforms**: Google Analytics, Mixpanel, Amplitude
- **Error Tracking**: Sentry, Bugsnag, Rollbar
- **Communication Tools**: Slack, Discord, email services for alerts
- **Database Tools**: MongoDB Compass, database monitoring tools
- **Payment Analytics**: Stripe Dashboard, payment processing insights

### Compliance & Legal

- **GDPR Compliance**: Data protection and user rights
- **Terms of Service**: Clear usage terms
- **Privacy Policy**: Transparent data handling
- **Cookie Policy**: Cookie usage disclosure

---

## Development Timeline

### Phase 1: Foundation (Week 1-2)

- Project setup and configuration
- Admin authentication system implementation
- Basic routing and navigation
- API integration setup for admin endpoints
- Core admin component library

### Phase 2: Core Admin Features (Week 3-4)

- User management interface
- System overview dashboard
- Content moderation tools
- Basic analytics and reporting
- Responsive admin design

### Phase 3: Advanced Admin Features (Week 5-6)

- Business intelligence dashboards
- System monitoring and alerts
- Advanced user segmentation
- Content management tools
- Performance optimization

### Phase 4: Polish & Launch (Week 7-8)

- Testing and bug fixes
- Performance optimization
- Security hardening
- Documentation
- Deployment and monitoring setup

---

This comprehensive prompt provides everything needed to build a world-class TripWiser admin/developer dashboard. The development team should focus on creating a powerful, efficient, and comprehensive administrative solution that provides complete visibility and control over the TripWiser platform, enabling effective business management and system administration.
