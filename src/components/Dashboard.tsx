import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { StatCard } from './ui/StatCard';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { apiService } from '../services/api';
import { AffiliateDashboard } from './AffiliateDashboard';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Link as LinkIcon
} from 'lucide-react';

export function Dashboard() {
  const [showAffiliateDashboard, setShowAffiliateDashboard] = useState(false);

  const { data: platformStats, isLoading, error } = useQuery(
    'platformStats',
    () => apiService.getPlatformStats()
  );

  // Fetch system health and payment data separately
  const { data: systemHealth } = useQuery(
    'systemHealth',
    () => apiService.getSystemHealth()
  );

  const { data: paymentOverview } = useQuery(
    'paymentOverview',
    () => apiService.getPaymentOverview()
  );

  // Debug logging
  console.log('Dashboard - platformStats:', platformStats);
  console.log('Dashboard - systemHealth:', systemHealth);
  console.log('Dashboard - paymentOverview:', paymentOverview);
  console.log('Dashboard - isLoading:', isLoading);
  console.log('Dashboard - error:', error);

  const { data: recentUsers } = useQuery(
    'recentUsers',
    () => apiService.getAllUsers(),
    {
      select: (users) => users.slice(0, 5), // Get only first 5 users
    }
  );

  const { data: recentTrips } = useQuery(
    'recentTrips',
    () => apiService.getAllTrips(),
    {
      select: (trips) => trips.slice(0, 5), // Get only first 5 trips
    }
  );

  
  const getSystemHealthVariant = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getSystemHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <Clock className="h-4 w-4" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };


  if (showAffiliateDashboard) {
    return <AffiliateDashboard onBack={() => setShowAffiliateDashboard(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load platform statistics. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card-background border-b border-border shadow-sm">
        <div className="container mx-auto p-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-lg">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-md">
                <img 
                  src="/assets/logo.png" 
                  alt="TripWiser Logo" 
                  className="max-h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary font-racing">
                  TripWiser Admin
                </h1>
                <p className="text-muted-foreground mt-xs">
                  Monitor and manage your travel platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <Badge variant={getSystemHealthVariant(systemHealth?.status || 'unknown')} className="px-md py-sm">
                {getSystemHealthIcon(systemHealth?.status || 'unknown')}
                <span className="ml-sm font-medium">
                  {systemHealth?.status || 'Unknown'}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-lg">

        {/* Platform Statistics */}
        <div className="mt-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-lg">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-2xl">
            <StatCard
              title="Total Users"
              value={platformStats?.totalUsers?.toLocaleString() || '0'}
              description="Registered users"
              trend={{ value: 12, isPositive: true }}
              icon={<Users className="h-5 w-5" />}
              variant="default"
            />
            <StatCard
              title="Active Users"
              value={platformStats?.activeUsers?.toLocaleString() || '0'}
              description="Last 30 days"
              trend={{ value: 8, isPositive: true }}
              icon={<Activity className="h-5 w-5" />}
              variant="success"
            />
            <StatCard
              title="Total Trips"
              value={platformStats?.totalTrips?.toLocaleString() || '0'}
              description="Created trips"
              trend={{ value: 15, isPositive: true }}
              icon={<MapPin className="h-5 w-5" />}
              variant="default"
            />
            <StatCard
              title="Revenue"
              value={`$${paymentOverview?.totalRevenue?.toLocaleString() || '0'}`}
              description="Monthly recurring"
              trend={{ value: 23, isPositive: true }}
              icon={<DollarSign className="h-5 w-5" />}
              variant="success"
            />
          </div>
        </div>

        {/* System Health & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg mb-2xl">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-sm">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-success" />
                </div>
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-lg">
                <div className="flex items-center justify-between p-md bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">API Status</span>
                  <Badge variant={systemHealth?.apiStatus === 'operational' ? 'success' : 'warning'}>
                    {systemHealth?.apiStatus || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-md bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Database</span>
                  <Badge variant={systemHealth?.databaseStatus === 'connected' ? 'success' : 'destructive'}>
                    {systemHealth?.databaseStatus || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-md bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Response Time</span>
                  <span className="text-sm font-semibold text-foreground">
                    {systemHealth?.responseTime || 0}ms
                  </span>
                </div>
                <div className="flex items-center justify-between p-md bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium text-foreground">Uptime</span>
                  <span className="text-sm font-semibold text-foreground">
                    {systemHealth?.uptime ? 
                      `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m` : 
                      'Unknown'
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-md">
                <Button variant="outline" className="h-auto p-lg flex flex-col items-center gap-sm hover:bg-primary/5 hover:border-primary/20">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Manage Users</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-lg flex flex-col items-center gap-sm hover:bg-primary/5 hover:border-primary/20"
                  onClick={() => setShowAffiliateDashboard(true)}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Affiliate</span>
                </Button>
                <Button variant="outline" className="h-auto p-lg flex flex-col items-center gap-sm hover:bg-warning/5 hover:border-warning/20">
                  <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-warning" />
                  </div>
                  <span className="text-sm font-medium">Moderate Content</span>
                </Button>
                <Button variant="outline" className="h-auto p-lg flex flex-col items-center gap-sm hover:bg-success/5 hover:border-success/20">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-sm font-medium">System Logs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                Recent Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {recentUsers?.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-md bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-md">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-sm">
                        <span className="text-sm font-semibold text-white">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant={user.plan === 'elite' ? 'success' : user.plan === 'pro' ? 'warning' : 'secondary'}>
                      {user.plan}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-sm">
                <div className="h-8 w-8 rounded-lg bg-itinerary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-itinerary" />
                </div>
                Recent Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-md">
                {recentTrips?.map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-md bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-md">
                      <div className="h-10 w-10 rounded-full bg-gradient-itinerary flex items-center justify-center shadow-sm">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{trip.name}</p>
                        <p className="text-xs text-muted-foreground">{trip.destination}</p>
                      </div>
                    </div>
                    <Badge variant={trip.completed ? 'success' : 'secondary'}>
                      {trip.completed ? 'Completed' : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
