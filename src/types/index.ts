export interface User {
  _id: string;
  name: string;
  email: string;
  auth_provider: 'local' | 'google' | 'apple';
  plan: 'free' | 'pro' | 'elite';
  avatar?: string;
  bio?: string;
  preferences?: string;
  savedTemplates: string[];
  savedTips: string[];
  aiRegenerationCount: number;
  lastLoginAt: Date;
  blockedUsers: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Trip {
  _id: string;
  user: string;
  ownerId: string;
  name: string;
  destination: string;
  location: {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: {
      name: string;
      city: string;
      country: string;
      country_code: string;
    };
  };
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  tripType: string[];
  activities: string[];
  highlights: string[];
  caption: string;
  additionalInfo: string;
  image: string;
  public: boolean;
  sharing: {
    trip: string;
    packing: string;
    itinerary: string;
    journal: string;
  };
  collaborators: string[];
  packingListId: string;
  itineraryId: string;
  journalId: string;
  summary: any;
  preview: any;
  completed: boolean;
  sharedPhotos: string[];
  likes: number;
  likedBy: string[];
  shares: number;
  sharedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  data: any;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
  readAt?: Date;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  databaseStatus: 'connected' | 'disconnected';
  apiStatus: 'operational' | 'degraded' | 'down';
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalTrips: number;
  totalRevenue: number;
  systemHealth: SystemHealth;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
