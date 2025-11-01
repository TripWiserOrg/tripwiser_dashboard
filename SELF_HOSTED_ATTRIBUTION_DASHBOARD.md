# Self-Hosted Attribution System - Admin Dashboard Integration Guide

This guide provides comprehensive instructions for integrating attribution analytics into the TripWiser admin dashboard. You'll be able to view click-through rates, match rates, and attribution performance.

## Table of Contents
- [Overview](#overview)
- [Update API Service](#update-api-service)
- [Update Type Definitions](#update-type-definitions)
- [Attribution Analytics View](#attribution-analytics-view)
- [Upgrade Tracking](#upgrade-tracking)
- [Enhanced Affiliate Dashboard](#enhanced-affiliate-dashboard)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Overview

### What You'll Add

1. **Attribution System Status**
   - Match rate indicator
   - Total clicks vs matches
   - System health monitoring

2. **Enhanced Analytics**
   - Click-through rates
   - Attribution match rates
   - Platform breakdown (iOS vs Android)
   - Time-to-install metrics

3. **Upgrade Tracking**
   - Free → Pro → Elite conversions
   - Upgrade rates per influencer
   - Revenue impact calculations

4. **Detailed Click View**
   - See all attribution clicks
   - Filter by matched/unmatched
   - View fingerprint data for debugging

---

## Update API Service

### Modify `TRIPWISER_DASHBOARD/src/services/api.ts`

Add methods to fetch attribution data:

```typescript
// src/services/api.ts

class ApiService {
  // ... existing methods ...

  /**
   * Get attribution system overview
   */
  async getAttributionOverview(days: number = 30): Promise<{
    stats: {
      totalClicks: number;
      matchedClicks: number;
      unmatchedClicks: number;
      eliteGiftClicks: number;
      influencerClicks: number;
      matchRate: string;
    };
    topLinks: Array<{ _id: string; conversions: number }>;
    period: { startDate: string; endDate: string; days: number };
  }> {
    const response = await this.api.get<ApiResponse<any>>(
      `/admin/attribution/overview?days=${days}`
    );
    return response.data.data;
  }

  /**
   * Get attribution clicks (paginated)
   */
  async getAttributionClicks(params: {
    page?: number;
    limit?: number;
    matched?: boolean;
  }): Promise<{
    clicks: Array<any>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.matched !== undefined) queryParams.append('matched', params.matched.toString());

    const response = await this.api.get<ApiResponse<any>>(
      `/admin/attribution/clicks?${queryParams.toString()}`
    );
    return response.data.data;
  }

  /**
   * Get upgrade analysis for an influencer
   */
  async getInfluencerUpgradeAnalysis(influencerId: string): Promise<{
    totalReferrals: number;
    planDistribution: {
      elite: number;
      pro: number;
      free: number;
    };
    upgrades: {
      freeToElite: number;
      freeToPro: number;
      proToElite: number;
      stillAtOriginalPlan: number;
    };
    upgradeRate: string;
    users: Array<{
      userId: string;
      email: string;
      initialPlan: string;
      currentPlan: string;
      upgraded: boolean;
      convertedAt: string;
    }>;
  }> {
    const response = await this.api.get<ApiResponse<any>>(
      `/affiliate/influencer/${influencerId}/upgrade-analysis`
    );
    return response.data.data;
  }
}

export const apiService = new ApiService();
```

---

## Update Type Definitions

### Modify `TRIPWISER_DASHBOARD/src/types/index.ts`

Add new types for attribution data:

```typescript
// src/types/index.ts

// ... existing types ...

/**
 * Attribution System Types
 */

export interface AttributionStats {
  totalClicks: number;
  matchedClicks: number;
  unmatchedClicks: number;
  eliteGiftClicks: number;
  influencerClicks: number;
  matchRate: string;
}

export interface AttributionClick {
  _id: string;
  fingerprint: string;
  fingerprintData: {
    platform: 'iOS' | 'Android' | 'Web' | 'Unknown';
    osVersion: string;
    deviceModel: string;
    screenResolution: string;
    timezone: string;
    language: string;
    userAgent: string;
    ipHash: string;
  };
  affiliateType: 'elite_gift' | 'influencer_referral';
  influencerId?: {
    _id: string;
    name: string;
    email: string;
  };
  linkId?: string;
  clickedAt: string;
  matched: boolean;
  matchedAt?: string;
  matchedUserId?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface UpgradeAnalysis {
  totalReferrals: number;
  planDistribution: {
    elite: number;
    pro: number;
    free: number;
  };
  upgrades: {
    freeToElite: number;
    freeToPro: number;
    proToElite: number;
    stillAtOriginalPlan: number;
  };
  upgradeRate: string;
  users: Array<{
    userId: string;
    email: string;
    initialPlan: string;
    currentPlan: string;
    upgraded: boolean;
    convertedAt: string;
  }>;
}
```

---

## Attribution Analytics View

### Add Attribution Tab to Affiliate Dashboard

Modify `TRIPWISER_DASHBOARD/src/components/AffiliateDashboard.tsx`:

```typescript
// Add to the existing AffiliateDashboard component

import { useQuery } from 'react-query';
import { apiService } from '../services/api';
import { AttributionStats, AttributionClick } from '../types';

export function AffiliateDashboard({ onBack }: AffiliateDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'links' | 'detailed' | 'analytics' | 'attribution'>('overview');

  // Fetch attribution overview
  const { data: attributionData, isLoading: attributionLoading } = useQuery(
    'attributionOverview',
    () => apiService.getAttributionOverview(30),
    {
      enabled: activeTab === 'attribution',
    }
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card-background border-b border-border shadow-sm">
        {/* ... existing header ... */}
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto p-lg">
        <div className="flex space-x-1 mb-lg bg-muted/30 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'generate', label: 'Generate Links', icon: Plus },
            { id: 'links', label: 'Manage Links', icon: LinkIcon },
            { id: 'detailed', label: 'Detailed View', icon: List },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'attribution', label: 'Attribution', icon: Target }, // NEW TAB
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-sm px-lg py-md rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {/* ... existing tabs ... */}

        {activeTab === 'attribution' && (
          <AttributionAnalyticsView
            data={attributionData}
            loading={attributionLoading}
          />
        )}
      </div>
    </div>
  );
}
```

### Create Attribution Analytics View Component

Add this to `AffiliateDashboard.tsx`:

```typescript
// Attribution Analytics View Component
function AttributionAnalyticsView({
  data,
  loading,
}: {
  data?: any;
  loading: boolean;
}) {
  const [clicksPage, setClicksPage] = useState(1);
  const [clicksFilter, setClicksFilter] = useState<'all' | 'matched' | 'unmatched'>('all');

  // Fetch clicks
  const { data: clicksData, isLoading: clicksLoading } = useQuery(
    ['attributionClicks', clicksPage, clicksFilter],
    () => apiService.getAttributionClicks({
      page: clicksPage,
      limit: 20,
      matched: clicksFilter === 'all' ? undefined : clicksFilter === 'matched',
    })
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="space-y-lg">
      {/* Attribution Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalClicks || 0}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <MousePointerClick className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="text-xs text-muted-foreground">
                Elite: {stats?.eliteGiftClicks || 0} | Influencer: {stats?.influencerClicks || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Matched Clicks</p>
                <p className="text-3xl font-bold mt-2 text-success">{stats?.matchedClicks || 0}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Match Rate</span>
                <span className="font-semibold">{stats?.matchRate || '0'}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{ width: `${stats?.matchRate || 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unmatched Clicks</p>
                <p className="text-3xl font-bold mt-2 text-warning">{stats?.unmatchedClicks || 0}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <XCircle className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {stats?.totalClicks > 0
                ? `${((stats.unmatchedClicks / stats.totalClicks) * 100).toFixed(1)}% of total`
                : '0% of total'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attribution Clicks Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attribution Clicks</CardTitle>
            <div className="flex items-center gap-2">
              <select
                value={clicksFilter}
                onChange={(e) => {
                  setClicksFilter(e.target.value as any);
                  setClicksPage(1);
                }}
                className="px-3 py-2 border border-border rounded-md text-sm bg-background"
              >
                <option value="all">All Clicks</option>
                <option value="matched">Matched Only</option>
                <option value="unmatched">Unmatched Only</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clicksLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                        Matched User
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {clicksData?.clicks.map((click: AttributionClick) => (
                      <tr key={click._id} className="hover:bg-muted/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {new Date(click.clickedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={click.affiliateType === 'elite_gift' ? 'default' : 'success'}>
                            {click.affiliateType === 'elite_gift' ? '🎁 Elite' : '👥 Influencer'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {click.fingerprintData.platform === 'iOS' ? '📱 iOS' : '🤖 Android'}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <div>{click.fingerprintData.deviceModel}</div>
                          <div className="text-xs">{click.fingerprintData.osVersion}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={click.matched ? 'success' : 'secondary'}>
                            {click.matched ? '✅ Matched' : '⏳ Pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {click.matched && click.matchedUserId ? (
                            <div>
                              <div className="font-medium">{click.matchedUserId.name}</div>
                              <div className="text-xs text-muted-foreground">{click.matchedUserId.email}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {clicksData && clicksData.pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={clicksPage === 1}
                    onClick={() => setClicksPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {clicksPage} of {clicksData.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={clicksPage === clicksData.pagination.pages}
                    onClick={() => setClicksPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Match Rate Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Attribution Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats && stats.matchRate < 70 && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Low Match Rate Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your current match rate is {stats.matchRate}%. This could mean users are taking
                      longer to install, or switching networks between clicking and installing.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Suggestions:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Increase attribution window to 72-96 hours in backend settings</li>
                        <li>Check if users are switching from WiFi to cellular</li>
                        <li>Verify fingerprint data is being collected correctly</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stats && stats.matchRate >= 75 && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Great Attribution Performance!</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your match rate of {stats.matchRate}% is excellent. This means your attribution
                      system is accurately tracking most app installs from referral links.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {stats && stats.unmatchedClicks > 50 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Pending Matches</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      You have {stats.unmatchedClicks} clicks waiting to be matched. These may convert
                      within the next 48 hours as users install and open the app.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Upgrade Tracking

### Add Upgrade Analysis to Detailed View

Modify the `DetailedAffiliateView` component in `AffiliateDashboard.tsx`:

```typescript
// Add upgrade analysis component
function InfluencerUpgradeAnalysis({ influencerId }: { influencerId: string }) {
  const { data: upgradeAnalysis, isLoading } = useQuery(
    ['upgradeAnalysis', influencerId],
    () => apiService.getInfluencerUpgradeAnalysis(influencerId)
  );

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!upgradeAnalysis) {
    return null;
  }

  return (
    <div className="mt-md pt-md border-t border-border">
      <h4 className="font-semibold text-foreground mb-md flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Upgrade Analysis
      </h4>

      {/* Upgrade Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-success/10 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Free → Elite</p>
          <p className="text-lg font-bold text-success">
            {upgradeAnalysis.upgrades.freeToElite}
          </p>
        </div>
        <div className="bg-warning/10 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Free → Pro</p>
          <p className="text-lg font-bold text-warning">
            {upgradeAnalysis.upgrades.freeToPro}
          </p>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Pro → Elite</p>
          <p className="text-lg font-bold text-primary">
            {upgradeAnalysis.upgrades.proToElite}
          </p>
        </div>
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Upgrade Rate</p>
          <p className="text-lg font-bold text-foreground">
            {upgradeAnalysis.upgradeRate}
          </p>
        </div>
      </div>

      {/* Current Plan Distribution */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Current Plan Distribution:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted/30 rounded-full h-8 overflow-hidden">
            <div className="h-full flex">
              {upgradeAnalysis.planDistribution.elite > 0 && (
                <div
                  className="bg-success flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${(upgradeAnalysis.planDistribution.elite / upgradeAnalysis.totalReferrals) * 100}%`
                  }}
                >
                  {upgradeAnalysis.planDistribution.elite}
                </div>
              )}
              {upgradeAnalysis.planDistribution.pro > 0 && (
                <div
                  className="bg-warning flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${(upgradeAnalysis.planDistribution.pro / upgradeAnalysis.totalReferrals) * 100}%`
                  }}
                >
                  {upgradeAnalysis.planDistribution.pro}
                </div>
              )}
              {upgradeAnalysis.planDistribution.free > 0 && (
                <div
                  className="bg-muted flex items-center justify-center text-foreground text-xs font-medium"
                  style={{
                    width: `${(upgradeAnalysis.planDistribution.free / upgradeAnalysis.totalReferrals) * 100}%`
                  }}
                >
                  {upgradeAnalysis.planDistribution.free}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-success rounded"></div>
            <span>Elite ({upgradeAnalysis.planDistribution.elite})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-warning rounded"></div>
            <span>Pro ({upgradeAnalysis.planDistribution.pro})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-muted rounded"></div>
            <span>Free ({upgradeAnalysis.planDistribution.free})</span>
          </div>
        </div>
      </div>

      {/* Upgraded Users List */}
      <div>
        <p className="text-sm font-medium mb-2">
          Users Who Upgraded ({upgradeAnalysis.users.filter(u => u.upgraded).length})
        </p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {upgradeAnalysis.users
            .filter(user => user.upgraded)
            .map(user => (
              <div key={user.userId} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Signed up: {new Date(user.convertedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="success">
                  {user.initialPlan.toUpperCase()} → {user.currentPlan.toUpperCase()}
                </Badge>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
```

### Add to Detailed Affiliate View

In the `DetailedAffiliateView`, add the upgrade analysis component:

```typescript
// Inside the expanded influencer section
{expandedInfluencer === affiliate.influencer._id && (
  <div className="mt-md pt-md border-t border-border">
    {/* Existing Converted Users List */}
    {/* ... */}

    {/* Add Upgrade Analysis */}
    <InfluencerUpgradeAnalysis influencerId={affiliate.influencer._id} />
  </div>
)}
```

---

## Enhanced Affiliate Dashboard

### Add Attribution Status to Overview Tab

In the `AffiliateDashboard` overview tab, add attribution stats:

```typescript
{activeTab === 'overview' && (
  <div className="space-y-lg">
    {/* Existing Quick Stats */}
    {/* ... */}

    {/* Attribution Overview Card */}
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="h-4 w-4 text-primary" />
          </div>
          Attribution System
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AttributionOverviewWidget />
      </CardContent>
    </Card>
  </div>
)}
```

### Create Attribution Overview Widget

```typescript
function AttributionOverviewWidget() {
  const { data, isLoading } = useQuery(
    'attributionOverviewWidget',
    () => apiService.getAttributionOverview(7) // Last 7 days
  );

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  const stats = data?.stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Clicks (7d)</p>
        <p className="text-2xl font-bold mt-1">{stats?.totalClicks || 0}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Matched</p>
        <p className="text-2xl font-bold mt-1 text-success">{stats?.matchedClicks || 0}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Match Rate</p>
        <p className="text-2xl font-bold mt-1">
          {stats?.matchRate || '0'}%
        </p>
      </div>
    </div>
  );
}
```

---

## Testing

### 1. Test Attribution Stats Display

1. **Generate test clicks** via backend:
   ```bash
   # Create several test clicks
   for i in {1..10}; do
     curl -X POST http://localhost:3000/api/attribution/click \
       -H "Content-Type: application/json" \
       -d "{\"affiliateType\":\"elite_gift\",\"linkId\":\"test\",\"platform\":\"iOS\",\"osVersion\":\"15.$i\"}"
   done
   ```

2. **Open dashboard** → Navigate to Attribution tab

3. **Verify stats** show:
   - Total clicks: 10
   - Matched/unmatched breakdown
   - Match rate percentage

### 2. Test Clicks Table

1. **View clicks table**
2. **Filter** by matched/unmatched
3. **Check pagination** if >20 clicks
4. **Verify** fingerprint data displays correctly

### 3. Test Upgrade Analysis

1. **Create test influencer** with referrals
2. **Manually update** some user plans in MongoDB:
   ```javascript
   // Upgrade a user
   db.users.updateOne(
     { email: 'test@example.com' },
     { $set: { plan: 'elite' } }
   )
   ```
3. **View detailed influencer view**
4. **Verify** upgrade stats show correctly

---

## Deployment

### 1. No Environment Variables Needed

Dashboard uses existing API configuration. No new environment variables required!

### 2. Build and Deploy

```bash
cd TRIPWISER_DASHBOARD

# Build
npm run build

# Deploy (if using Vercel)
# Automatic on git push
```

### 3. Verify Production

After deployment:

1. Login to dashboard
2. Navigate to Affiliate System → Attribution tab
3. Verify data loads correctly
4. Test all filters and pagination

---

## Troubleshooting

### Issue: "No data available" in Attribution tab

**Check:**
1. Backend has attribution endpoints: `/api/admin/attribution/overview`
2. API service has `getAttributionOverview()` method
3. User is authenticated with admin token
4. CORS allows dashboard domain

### Issue: Match rate shows 0%

**Check:**
1. Attribution clicks exist in database: `db.attributionclicks.countDocuments()`
2. Some clicks are matched: `db.attributionclicks.find({matched: true}).count()`
3. Backend attribution service is running correctly

### Issue: Upgrade analysis not loading

**Check:**
1. Backend has upgrade analysis endpoint
2. Influencer ID is correct
3. Conversions exist for that influencer
4. Check browser console for API errors

---

## Next Steps

1. ✅ Dashboard attribution analytics complete
2. ⏭️ Update website: See `SELF_HOSTED_ATTRIBUTION_WEBSITE.md`

---

## Support

**Need Help?**
- Check browser console for API errors
- Review Network tab for failed requests
- Verify backend endpoints are responding
- Refer to `CLAUDE.md` in dashboard directory
