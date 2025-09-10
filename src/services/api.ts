import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PlatformStats, User, Trip, Notification, AffiliateLink, AffiliateAnalytics, LinkGenerationData } from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            // Retry the original request
            return this.api.request(error.config);
          } catch (refreshError) {
            // Redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${this.baseURL}/auth/refresh`, {
      refreshToken,
    });

    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  }

  // Authentication
  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/login', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  async logout() {
    await this.api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    const response = await this.api.post<ApiResponse<{ affiliateLink: AffiliateLink }>>('/affiliate/generate-elite-link', data);
    return response.data.data.affiliateLink;
  }

  async generateInfluencerLink(data: LinkGenerationData): Promise<AffiliateLink> {
    const response = await this.api.post<ApiResponse<{ affiliateLink: AffiliateLink }>>('/affiliate/generate-influencer-link', data);
    return response.data.data.affiliateLink;
  }

  async getAffiliateLinks(filters: { type?: string; status?: string } = {}): Promise<{ links: AffiliateLink[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    
    const response = await this.api.get<ApiResponse<{ links: AffiliateLink[]; pagination: any }>>(`/admin/affiliate/links?${queryParams}`);
    return response.data.data;
  }

  async toggleLinkStatus(linkId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.api.put<ApiResponse<{ success: boolean; message: string }>>(`/admin/affiliate/links/${linkId}/toggle`);
    return response.data.data;
  }

  async getAffiliateAnalytics(period: string = '30d'): Promise<AffiliateAnalytics> {
    const response = await this.api.get<ApiResponse<AffiliateAnalytics>>(`/admin/affiliate/overview?period=${period}`);
    return response.data.data;
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.api.get<ApiResponse<{ users: User[] }>>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.data.users;
  }
}

export const apiService = new ApiService();
export default apiService;
