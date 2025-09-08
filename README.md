# TripWiser Admin Dashboard

A comprehensive admin dashboard for managing the TripWiser travel platform. Built with React, TypeScript, and modern web technologies.

## Features

- **System Overview**: Real-time platform statistics and health monitoring
- **User Management**: View and manage user accounts, plans, and activity
- **Content Moderation**: Monitor and moderate user-generated content
- **Analytics**: Business intelligence and platform insights
- **System Monitoring**: Server health, API status, and performance metrics
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: React Query for server state
- **UI Components**: Custom component library with TripWiser design system
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: CSS Custom Properties with design tokens

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Access to TripWiser backend API

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tripwiser-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables:

```env
REACT_APP_API_URL=https://tripwiser-backend.onrender.com
```

5. Start the development server:

```bash
npm start
```

The dashboard will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Card, Button, Input, etc.)
│   ├── Dashboard.tsx   # Main dashboard component
│   └── Login.tsx       # Authentication component
├── services/           # API services and utilities
│   └── api.ts         # API client with authentication
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
├── App.tsx            # Main application component
├── App.css            # Application styles
├── index.tsx          # Application entry point
└── index.css          # Global styles and design tokens
```

## Design System

The dashboard follows the TripWiser design system with:

- **Colors**: Primary indigo (#6366f1), success green (#10b981), warning orange (#f59e0b), destructive red (#d4183d)
- **Typography**: Inter font family with consistent sizing and weights
- **Spacing**: 4px grid system for consistent layouts
- **Components**: Reusable, accessible components with consistent styling

## API Integration

The dashboard integrates with the TripWiser backend API:

- **Authentication**: JWT token-based authentication with automatic refresh
- **Admin Endpoints**: Full access to admin-only endpoints for user and content management
- **Real-time Updates**: Automatic data refresh and error handling
- **Error Handling**: Graceful error handling with user-friendly messages

## Key Components

### Dashboard

- Platform statistics and metrics
- System health monitoring
- Recent user and trip activity
- Quick action buttons

### Authentication

- Secure login with JWT tokens
- Automatic token refresh
- Session management

### UI Components

- **Card**: Flexible container component
- **Button**: Multiple variants and sizes
- **Input**: Form input with validation
- **Badge**: Status indicators
- **StatCard**: Metric display component

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent naming conventions
- Responsive design patterns

## Deployment

The dashboard can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect repository for automatic deployments
- **AWS S3**: Upload build folder to S3 bucket
- **GitHub Pages**: Use GitHub Actions for deployment

## Security

- JWT token authentication
- Secure token storage
- HTTPS enforcement
- Input validation
- XSS protection

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for TripWiser platform administration.

## Support

For support and questions, contact the development team.
