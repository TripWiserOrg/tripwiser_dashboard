import axios, { AxiosInstance } from 'axios';
import { ApiResponse, PlatformStats, User, Trip, AffiliateLink, AffiliateAnalytics, LinkGenerationData } from '../types';
import { firebaseAuthService } from './firebaseAuth';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://tripwiser-backend.onrender.com/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add Firebase auth token
    this.api.interceptors.request.use(
      async (config) => {
        // Get Firebase token (automatically refreshes if needed)
        const token = await firebaseAuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // Try to get a fresh token
            const token = await firebaseAuthService.getToken();
            if (token) {
              // Retry the original request with new token
              error.config.headers.Authorization = `Bearer ${token}`;
              return this.api.request(error.config);
            } else {
              // No token available, redirect to login
              await firebaseAuthService.signOut();
              window.location.href = '/';
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            await firebaseAuthService.signOut();
            window.location.href = '/';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication - Now handled by firebaseAuthService
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // Admin endpoints
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await this.api.get<ApiResponse<any>>('/admin/analytics');
    console.log('Platform Stats API Response:', response.data);
    console.log('Platform Stats data type:', typeof response.data.data);
    console.log('Platform Stats data structure:', response.data.data);
    
    // Map the response data to the expected PlatformStats structure
    const analyticsData = response.data.data;
    return {
      totalUsers: analyticsData.users?.total || 0,
      activeUsers: analyticsData.users?.new || 0, // Using new users as active for now
      totalTrips: analyticsData.trips?.total || 0,
      totalRevenue: 0, // Will be fetched from payments endpoint
      systemHealth: {
        status: 'healthy' as const,
        uptime: 0,
        responseTime: 0,
        databaseStatus: 'connected' as const,
        apiStatus: 'operational' as const
      }
    };
  }

  async getAllUsers(): Promise<User[]> {
    const response = await this.api.get<ApiResponse<{ users: User[]; pagination: any; stats: any }>>('/admin/users');
    // Extract the users array from the response object
    return response.data.data.users || [];
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.api.put<ApiResponse<User>>(`/admin/users/${id}`, userData);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/admin/users/${id}`);
  }

  async getAllTrips(): Promise<Trip[]> {
    const response = await this.api.get<ApiResponse<{ trips: Trip[]; pagination: any; stats: any }>>('/admin/trips');
    // Extract the trips array from the response object
    return response.data.data.trips || [];
  }

  async getTripById(id: string): Promise<Trip> {
    const response = await this.api.get<ApiResponse<Trip>>(`/admin/trips/${id}`);
    return response.data.data;
  }

  async updateTrip(id: string, tripData: Partial<Trip>): Promise<Trip> {
    const response = await this.api.put<ApiResponse<Trip>>(`/admin/trips/${id}`, tripData);
    return response.data.data;
  }

  async deleteTrip(id: string): Promise<void> {
    await this.api.delete(`/admin/trips/${id}`);
  }

  async getSystemHealth() {
    try {
      const response = await this.api.get<ApiResponse<any>>('/admin/system/health');
      console.log('System Health API Response:', response.data);
      
      // Map the response to our expected structure
      const healthData = response.data.data;
      return {
        status: healthData.status || 'healthy',
        uptime: healthData.system?.uptime || 0,
        responseTime: 150, // Default since not provided in response
        databaseStatus: healthData.database?.status || 'connected',
        apiStatus: 'operational' // Default since not provided in response
      };
    } catch (error: any) {
      console.log('System Health API Error:', error);
      // Fallback data
      return {
        status: 'healthy',
        uptime: 0,
        responseTime: 150,
        databaseStatus: 'connected',
        apiStatus: 'operational'
      };
    }
  }

  async getSystemLogs() {
    const response = await this.api.get<ApiResponse<any>>('/admin/system/logs');
    return response.data.data;
  }

  async getSystemMetrics() {
    const response = await this.api.get<ApiResponse<any>>('/admin/system/metrics');
    return response.data.data;
  }

  async sendBroadcastNotification(notification: { title: string; body: string; type: string }) {
    const response = await this.api.post<ApiResponse<any>>('/admin/notifications/broadcast', notification);
    return response.data.data;
  }

  async getPaymentOverview() {
    try {
      const response = await this.api.get<ApiResponse<any>>('/admin/payments/overview');
      console.log('Payment Overview API Response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.log('Payment Overview API Error:', error);
      // Return fallback payment data
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalTransactions: 0
      };
    }
  }

  async getContentForModeration() {
    const response = await this.api.get<ApiResponse<any>>('/admin/content/moderate');
    return response.data.data;
  }

  async moderateContent(id: string, action: 'approve' | 'reject' | 'delete') {
    const response = await this.api.put<ApiResponse<any>>(`/admin/content/${id}/moderate`, { action });
    return response.data.data;
  }

  // Affiliate System endpoints
  async generateEliteGiftLink(data: LinkGenerationData): Promise<AffiliateLink> {
    // Format request body to match backend expectations
    const requestBody: any = {};
    
    if (data.maxUses) {
      requestBody.maxUses = data.maxUses;
    }
    
    if (data.expiresAt) {
      // Convert datetime-local format to ISO 8601 format
      const date = new Date(data.expiresAt);
      requestBody.expiresAt = date.toISOString();
    }
    
    // Add description to metadata if provided
    if (data.description) {
      requestBody.metadata = {
        description: data.description
      };
    }
    
    console.log('Generating Elite Gift Link with request:', requestBody);
    const response = await this.api.post<ApiResponse<{ affiliateLink: AffiliateLink }>>('/affiliate/generate-elite-link', requestBody);
    console.log('Elite Gift Link API Response:', response.data);
    
    const link = response.data.data.affiliateLink;
    if (!link.deepLink) {
      console.error('WARNING: No deepLink in response!', link);
      throw new Error('Generated link is missing deepLink field');
    }
    
    console.log('Elite Gift DeepLink:', link.deepLink);
    return link;
  }

  async generateInfluencerLink(data: LinkGenerationData): Promise<AffiliateLink> {
    // Format request body to match backend expectations
    const requestBody: any = {
      influencerId: data.influencerId
    };
    
    if (data.maxUses) {
      requestBody.maxUses = data.maxUses;
    }
    
    if (data.expiresAt) {
      // Convert datetime-local format to ISO 8601 format
      const date = new Date(data.expiresAt);
      requestBody.expiresAt = date.toISOString();
    }
    
    // Add description to metadata if provided
    if (data.description) {
      requestBody.metadata = {
        description: data.description
      };
    }
    
    console.log('Generating Influencer Link with request:', requestBody);
    const response = await this.api.post<ApiResponse<{ affiliateLink: AffiliateLink }>>('/affiliate/generate-influencer-link', requestBody);
    console.log('Influencer Link API Response:', response.data);
    
    const link = response.data.data.affiliateLink;
    if (!link.deepLink) {
      console.error('WARNING: No deepLink in response!', link);
      throw new Error('Generated link is missing deepLink field');
    }
    
    console.log('Influencer DeepLink:', link.deepLink);
    return link;
  }

  async getAffiliateLinks(filters: { type?: string; status?: string } = {}): Promise<{ links: AffiliateLink[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    
    const response = await this.api.get<ApiResponse<{ links: AffiliateLink[]; pagination: any }>>(`/admin/affiliate/links?${queryParams}`);
    return response.data.data;
  }

  async toggleLinkStatus(linkId: string): Promise<{ success: boolean; message: string }> {
    console.log('Toggling link status for:', linkId);
    const response = await this.api.put<ApiResponse<{ success: boolean; message: string }>>(`/admin/affiliate/links/${linkId}/toggle`);
    console.log('Toggle response:', response.data);
    return response.data.data;
  }

  async deleteAffiliateLink(linkId: string): Promise<void> {
    console.log('Deleting link:', linkId);
    await this.api.delete(`/admin/affiliate/links/${linkId}`);
    console.log('Link deleted successfully');
  }

  async getAffiliateAnalytics(period: string = '30d'): Promise<AffiliateAnalytics> {
    console.log('Fetching affiliate analytics for period:', period);
    const response = await this.api.get<ApiResponse<AffiliateAnalytics>>(`/admin/affiliate/overview?period=${period}`);
    console.log('Affiliate Analytics Response:', response.data);
    return response.data.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.api.get<ApiResponse<{ users: User[] }>>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.data.users;
  }
}

export const apiService = new ApiService();
export default apiService;
