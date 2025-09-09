# TripWiser Dashboard - Affiliate System Integration Prompt

## 📋 Overview

This document provides a comprehensive prompt for integrating the TripWiser Affiliate System into your existing dashboard. The integration includes both **Elite Gift Links** and **Influencer Affiliate Links** with full generation, monitoring, and analytics capabilities.

## 🎯 Integration Requirements

### Core Features to Implement
1. **Affiliate Link Generation** (Admin only)
2. **Link Management & Monitoring**
3. **Real-time Analytics Dashboard**
4. **Performance Tracking**
5. **User Management Integration**

---

## 🏗️ Dashboard Architecture Integration

### 1. Navigation Structure
```
Dashboard
├── Overview
├── Users
├── Analytics
├── Settings
└── Affiliate System (NEW)
    ├── Link Generation
    ├── Link Management
    ├── Analytics
    └── Performance
```

### 2. Required Pages/Sections

#### A. Affiliate Dashboard Overview
- **Location**: `/dashboard/affiliate`
- **Purpose**: Main affiliate system overview
- **Access**: Admin only

#### B. Link Generation Page
- **Location**: `/dashboard/affiliate/generate`
- **Purpose**: Generate new affiliate links
- **Access**: Admin only

#### C. Link Management Page
- **Location**: `/dashboard/affiliate/links`
- **Purpose**: View, manage, and monitor all links
- **Access**: Admin only

#### D. Analytics Page
- **Location**: `/dashboard/affiliate/analytics`
- **Purpose**: Detailed analytics and reporting
- **Access**: Admin only

---

## 🎨 UI/UX Design Specifications

### 1. Affiliate Dashboard Overview

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Affiliate System                     │
├─────────────────────────────────────────────────────────┤
│  📊 Quick Stats Cards                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Elite   │ │ Influ.  │ │ Total   │ │ Active  │      │
│  │ Gifts   │ │ Refer.  │ │ Links   │ │ Links   │      │
│  │   25    │ │  150    │ │   12    │ │    8    │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
├─────────────────────────────────────────────────────────┤
│  📈 Performance Charts                                  │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Conversion Trends (30 days)               │ │
│  │  [Line Chart: Elite Gifts vs Influencer Referrals] │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  🏆 Top Performing Links                                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ [Table: Link Type, Uses, Conversion Rate, Status]   │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Quick Stats Cards
```javascript
const AffiliateStatsCards = () => {
  const [stats, setStats] = useState({
    totalEliteGifts: 0,
    totalInfluencerReferrals: 0,
    totalLinks: 0,
    activeLinks: 0
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Elite Gifts Given"
        value={stats.totalEliteGifts}
        icon="🎁"
        color="blue"
        trend="+12%"
      />
      <StatCard
        title="Influencer Referrals"
        value={stats.totalInfluencerReferrals}
        icon="👥"
        color="green"
        trend="+8%"
      />
      <StatCard
        title="Total Links"
        value={stats.totalLinks}
        icon="🔗"
        color="purple"
        trend="+3"
      />
      <StatCard
        title="Active Links"
        value={stats.activeLinks}
        icon="✅"
        color="orange"
        trend="+1"
      />
    </div>
  );
};
```

### 2. Link Generation Page

#### Elite Gift Link Generation Form
```javascript
const EliteGiftLinkForm = () => {
  const [formData, setFormData] = useState({
    maxUses: '',
    expiresAt: '',
    description: ''
  });

  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/affiliate/generate-elite-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          maxUses: formData.maxUses || null,
          expiresAt: formData.expiresAt || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Show success modal with generated link
        showLinkGeneratedModal(data.data.affiliateLink);
      }
    } catch (error) {
      showError('Failed to generate elite gift link');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">🎁 Generate Elite Gift Link</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Limit (optional)
          </label>
          <input
            type="number"
            placeholder="Leave empty for unlimited"
            value={formData.maxUses}
            onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of times this link can be used
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date (optional)
          </label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Link will automatically expire after this date
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Holiday Campaign 2024"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Generate Elite Gift Link
        </button>
      </div>
    </div>
  );
};
```

#### Influencer Affiliate Link Generation Form
```javascript
const InfluencerLinkForm = () => {
  const [formData, setFormData] = useState({
    influencerId: '',
    maxUses: '',
    expiresAt: '',
    description: ''
  });
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    // Fetch available influencers
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const response = await fetch('/api/users?role=influencer', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      setInfluencers(data.users);
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await fetch('/api/affiliate/generate-influencer-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          influencerId: formData.influencerId,
          maxUses: formData.maxUses || null,
          expiresAt: formData.expiresAt || null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showLinkGeneratedModal(data.data.affiliateLink);
      }
    } catch (error) {
      showError('Failed to generate influencer link');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">👥 Generate Influencer Affiliate Link</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Influencer *
          </label>
          <select
            value={formData.influencerId}
            onChange={(e) => setFormData({...formData, influencerId: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Choose an influencer...</option>
            {influencers.map(influencer => (
              <option key={influencer.id} value={influencer.id}>
                {influencer.name} ({influencer.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usage Limit (optional)
          </label>
          <input
            type="number"
            placeholder="Leave empty for unlimited"
            value={formData.maxUses}
            onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiration Date (optional)
          </label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!formData.influencerId}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Generate Influencer Link
        </button>
      </div>
    </div>
  );
};
```

### 3. Link Management Page

#### Links Table Component
```javascript
const AffiliateLinksTable = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    fetchLinks();
  }, [filters]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      
      const response = await fetch(`/api/admin/affiliate/links?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const data = await response.json();
      setLinks(data.data.links);
    } catch (error) {
      showError('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  const toggleLinkStatus = async (linkId) => {
    try {
      const response = await fetch(`/api/admin/affiliate/links/${linkId}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const data = await response.json();
      if (data.success) {
        fetchLinks(); // Refresh the list
        showSuccess(data.message);
      }
    } catch (error) {
      showError('Failed to toggle link status');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess('Link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Affiliate Links</h3>
          <div className="flex space-x-2">
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="elite_gift">Elite Gift</option>
              <option value="influencer">Influencer</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        link.type === 'elite_gift' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {link.type === 'elite_gift' ? '🎁 Elite Gift' : '👥 Influencer'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {link.type === 'influencer' && link.influencerId ? (
                        <div>
                          <div className="font-medium">{link.influencerId.name}</div>
                          <div className="text-gray-500">{link.influencerId.email}</div>
                        </div>
                      ) : (
                        <div className="text-gray-500">Elite Gift Link</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {link.usedCount} / {link.maxUses || '∞'}
                    </div>
                    {link.maxUses && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(link.usedCount / link.maxUses) * 100}%`}}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      link.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {link.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(link.deepLink)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => toggleLinkStatus(link.id)}
                        className={`${
                          link.isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {link.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 4. Analytics Dashboard

#### Analytics Overview Component
```javascript
const AffiliateAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/affiliate/overview?period=${dateRange}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const data = await response.json();
      setAnalytics(data.data);
    } catch (error) {
      showError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Analytics Period</h3>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Elite Gifts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.summary.totalEliteGifts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Influencer Referrals</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.summary.totalInfluencerReferrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Conversions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics?.summary.totalConversions || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Trends Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold mb-4">Conversion Trends</h4>
          <div className="h-64">
            {/* Integration with your charting library (Chart.js, Recharts, etc.) */}
            <ConversionTrendsChart data={analytics?.conversionTrends} />
          </div>
        </div>

        {/* Top Influencers Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold mb-4">Top Influencers</h4>
          <div className="space-y-3">
            {analytics?.topInfluencers?.slice(0, 5).map((influencer, index) => (
              <div key={influencer.influencerId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {influencer.influencerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {influencer.uniqueUsers} unique users
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {influencer.referrals} referrals
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔧 API Integration

### Required API Endpoints
```javascript
// Affiliate Link Generation
const generateEliteLink = async (data) => {
  const response = await fetch('/api/affiliate/generate-elite-link', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

const generateInfluencerLink = async (data) => {
  const response = await fetch('/api/affiliate/generate-influencer-link', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Link Management
const fetchAffiliateLinks = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/admin/affiliate/links?${queryParams}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};

const toggleLinkStatus = async (linkId) => {
  const response = await fetch(`/api/admin/affiliate/links/${linkId}/toggle`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};

// Analytics
const fetchAffiliateOverview = async (period = '30d') => {
  const response = await fetch(`/api/admin/affiliate/overview?period=${period}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};

const fetchConversionData = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/affiliate/conversions?${queryParams}`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};

// User Management
const fetchInfluencers = async () => {
  const response = await fetch('/api/users?role=influencer', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  return response.json();
};
```

---

## 🎨 UI Components Library

### Reusable Components

#### StatCard Component
```javascript
const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600">{trend}</p>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### LinkGeneratedModal Component
```javascript
const LinkGeneratedModal = ({ link, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link.deepLink);
    showSuccess('Link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
            <span className="text-2xl">✅</span>
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Link Generated Successfully!
            </h3>
            <div className="mt-4">
              <div className="bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-600 break-all">
                  {link.deepLink}
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Copy Link
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 📱 Responsive Design

### Mobile-First Approach
```css
/* Mobile styles */
.affiliate-dashboard {
  padding: 1rem;
}

.stats-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet styles */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 🔐 Security Considerations

### Admin Access Control
```javascript
// Check admin permissions
const checkAdminAccess = () => {
  const userRole = getCurrentUserRole();
  if (userRole !== 'admin') {
    redirectToUnauthorized();
    return false;
  }
  return true;
};

// Protect affiliate routes
const AffiliateRoute = ({ children }) => {
  if (!checkAdminAccess()) {
    return <UnauthorizedAccess />;
  }
  return children;
};
```

### Input Validation
```javascript
// Validate form inputs
const validateLinkGeneration = (formData) => {
  const errors = {};
  
  if (formData.maxUses && (formData.maxUses < 1 || formData.maxUses > 10000)) {
    errors.maxUses = 'Usage limit must be between 1 and 10,000';
  }
  
  if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
    errors.expiresAt = 'Expiration date must be in the future';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

---

## 🧪 Testing Requirements

### Unit Tests
```javascript
// Test link generation
describe('Affiliate Link Generation', () => {
  test('should generate elite gift link', async () => {
    const mockResponse = {
      success: true,
      data: {
        affiliateLink: {
          id: 'test-id',
          type: 'elite_gift',
          deepLink: 'https://example.com/register?affiliate=elite&linkId=test-id'
        }
      }
    };
    
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    });
    
    const result = await generateEliteLink({ maxUses: 100 });
    expect(result.success).toBe(true);
    expect(result.data.affiliateLink.type).toBe('elite_gift');
  });
});
```

### Integration Tests
```javascript
// Test complete workflow
describe('Affiliate Dashboard Integration', () => {
  test('should complete link generation workflow', async () => {
    // 1. Generate link
    const link = await generateEliteLink({ maxUses: 10 });
    expect(link.success).toBe(true);
    
    // 2. Fetch links
    const links = await fetchAffiliateLinks();
    expect(links.data.links).toContainEqual(
      expect.objectContaining({ id: link.data.affiliateLink.id })
    );
    
    // 3. Toggle status
    const toggleResult = await toggleLinkStatus(link.data.affiliateLink.id);
    expect(toggleResult.success).toBe(true);
  });
});
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All API endpoints are working
- [ ] Admin authentication is properly configured
- [ ] Database connections are stable
- [ ] Error handling is implemented
- [ ] Loading states are added
- [ ] Mobile responsiveness is tested

### Post-Deployment
- [ ] Test link generation in production
- [ ] Verify analytics data is accurate
- [ ] Check admin access controls
- [ ] Monitor performance metrics
- [ ] Test error scenarios

---

## 📊 Performance Optimization

### Data Fetching
```javascript
// Implement caching
const useAffiliateData = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};
```

### Lazy Loading
```javascript
// Lazy load heavy components
const AffiliateAnalytics = lazy(() => import('./AffiliateAnalytics'));
const LinkManagement = lazy(() => import('./LinkManagement'));

// Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <AffiliateAnalytics />
</Suspense>
```

---

## 🎯 Success Metrics

### Key Performance Indicators
1. **Link Generation Success Rate**: >99%
2. **Page Load Time**: <2 seconds
3. **Mobile Responsiveness**: 100% compatible
4. **Error Rate**: <1%
5. **User Satisfaction**: >4.5/5

### Monitoring
- Real-time error tracking
- Performance monitoring
- User behavior analytics
- API response time tracking

---

## 📞 Support & Maintenance

### Documentation
- API documentation
- Component documentation
- User guides
- Troubleshooting guides

### Regular Maintenance
- Weekly performance reviews
- Monthly security audits
- Quarterly feature updates
- Annual architecture reviews

---

*This comprehensive prompt provides everything needed to integrate the TripWiser Affiliate System into your dashboard with full functionality, monitoring, and analytics capabilities.*
