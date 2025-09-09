import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { StatCard } from './ui/StatCard';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { apiService } from '../services/api';
import { AffiliateLink, AffiliateAnalytics, LinkGenerationData, User } from '../types';
import { 
  ArrowLeft,
  Gift, 
  Users, 
  Link as LinkIcon, 
  CheckCircle,
  TrendingUp,
  Copy,
  ToggleLeft,
  ToggleRight,
  Plus,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Eye
} from 'lucide-react';

interface AffiliateDashboardProps {
  onBack: () => void;
}

export function AffiliateDashboard({ onBack }: AffiliateDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'generate' | 'links' | 'analytics'>('overview');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<AffiliateLink | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    search: ''
  });

  // Fetch affiliate analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'affiliateAnalytics',
    () => apiService.getAffiliateAnalytics('30d')
  );

  // Fetch affiliate links
  const { data: linksData, isLoading: linksLoading, refetch: refetchLinks } = useQuery(
    ['affiliateLinks', filters],
    () => apiService.getAffiliateLinks({
      type: filters.type !== 'all' ? filters.type : undefined,
      status: filters.status !== 'all' ? filters.status : undefined
    })
  );

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search users function
  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await apiService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(userSearchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [userSearchQuery]);

  const handleGenerateLink = async (type: 'elite_gift' | 'influencer', data: LinkGenerationData) => {
    try {
      let link: AffiliateLink;
      if (type === 'elite_gift') {
        link = await apiService.generateEliteGiftLink(data);
      } else {
        link = await apiService.generateInfluencerLink(data);
      }
      
      setGeneratedLink(link);
      setShowLinkModal(true);
      refetchLinks();
    } catch (error) {
      console.error('Failed to generate link:', error);
    }
  };

  const handleToggleLinkStatus = async (linkId: string) => {
    try {
      await apiService.toggleLinkStatus(linkId);
      refetchLinks();
    } catch (error) {
      console.error('Failed to toggle link status:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Link copied to clipboard!');
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        alert('Failed to copy link. Please copy manually: ' + text);
      }
    }
  };

  const filteredLinks = linksData?.links?.filter(link => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        link.metadata?.description?.toLowerCase().includes(searchTerm) ||
        (typeof link.influencerId === 'string' 
          ? link.influencerId.toLowerCase().includes(searchTerm)
          : (link.influencerId as any)?.name?.toLowerCase().includes(searchTerm) ||
            (link.influencerId as any)?.email?.toLowerCase().includes(searchTerm)
        )
      );
    }
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card-background border-b border-border shadow-sm">
        <div className="container mx-auto p-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gradient-primary font-racing">
                  Affiliate System
                </h1>
                <p className="text-muted-foreground mt-xs">
                  Manage affiliate links and track performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto p-lg">
        <div className="flex space-x-1 mb-lg bg-muted/30 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'generate', label: 'Generate Links', icon: Plus },
            { id: 'links', label: 'Manage Links', icon: LinkIcon },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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
        {activeTab === 'overview' && (
          <div className="space-y-lg">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
              <StatCard
                title="Elite Gifts Given"
                value={analytics?.summary.totalEliteGifts || 0}
                description="Total elite gifts"
                trend={{ value: 12, isPositive: true }}
                icon={<Gift className="h-5 w-5" />}
                variant="default"
              />
              <StatCard
                title="User Referrals"
                value={analytics?.summary.totalInfluencerReferrals || 0}
                description="Total referrals"
                trend={{ value: 8, isPositive: true }}
                icon={<Users className="h-5 w-5" />}
                variant="success"
              />
              <StatCard
                title="Total Links"
                value={analytics?.summary.totalLinks || 0}
                description="Generated links"
                trend={{ value: 3, isPositive: true }}
                icon={<LinkIcon className="h-5 w-5" />}
                variant="default"
              />
              <StatCard
                title="Active Links"
                value={analytics?.summary.activeLinks || 0}
                description="Currently active"
                trend={{ value: 1, isPositive: true }}
                icon={<CheckCircle className="h-5 w-5" />}
                variant="success"
              />
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-sm">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    {linksData?.links?.slice(0, 5).map((link) => (
                      <div key={link._id} className="flex items-center justify-between p-md bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-md">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            link.type === 'elite_gift' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {link.type === 'elite_gift' ? (
                              <Gift className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Users className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {link.type === 'elite_gift' ? 'Elite Gift Link' : 'User Link'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {link.usedCount} uses
                            </p>
                          </div>
                        </div>
                        <Badge variant={link.isActive ? 'success' : 'secondary'}>
                          {link.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-sm">
                    <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-success" />
                    </div>
                    Top Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-md">
                    {analytics?.topInfluencers?.slice(0, 5).map((influencer, index) => (
                      <div key={influencer.influencerId} className="flex items-center justify-between p-md bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-md">
                          <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{influencer.influencerName}</p>
                            <p className="text-xs text-muted-foreground">{influencer.uniqueUsers} unique users</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{influencer.referrals} referrals</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <EliteGiftLinkForm onGenerate={(data) => handleGenerateLink('elite_gift', data)} />
            <InfluencerLinkForm 
              searchQuery={userSearchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              onSearchChange={setUserSearchQuery}
              onGenerate={(data) => handleGenerateLink('influencer', data)} 
            />
          </div>
        )}

        {activeTab === 'links' && (
          <AffiliateLinksTable 
            links={filteredLinks}
            loading={linksLoading}
            filters={filters}
            onFiltersChange={setFilters}
            onToggleStatus={handleToggleLinkStatus}
            onCopyLink={copyToClipboard}
          />
        )}

        {activeTab === 'analytics' && (
          <AffiliateAnalyticsView analytics={analytics} loading={analyticsLoading} />
        )}
      </div>

      {/* Link Generated Modal */}
      {showLinkModal && generatedLink && (
        <LinkGeneratedModal 
          link={generatedLink} 
          onClose={() => {
            setShowLinkModal(false);
            setGeneratedLink(null);
          }}
          onCopy={copyToClipboard}
        />
      )}
    </div>
  );
}

// Elite Gift Link Generation Form
function EliteGiftLinkForm({ onGenerate }: { onGenerate: (data: LinkGenerationData) => void }) {
  const [formData, setFormData] = useState<LinkGenerationData>({
    maxUses: undefined,
    expiresAt: undefined,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Gift className="h-4 w-4 text-blue-600" />
          </div>
          Generate Elite Gift Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Usage Limit (optional)
            </label>
            <Input
              type="number"
              placeholder="Leave empty for unlimited"
              value={formData.maxUses || ''}
              onChange={(e) => setFormData({...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined})}
            />
            <p className="text-xs text-muted-foreground mt-xs">
              Maximum number of times this link can be used
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Expiration Date (optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.expiresAt || ''}
              onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
            />
            <p className="text-xs text-muted-foreground mt-xs">
              Link will automatically expire after this date
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Description (optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., Holiday Campaign 2024"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full">
            Generate Elite Gift Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Influencer Link Generation Form
function InfluencerLinkForm({ 
  searchQuery,
  searchResults,
  isSearching,
  onSearchChange,
  onGenerate 
}: { 
  searchQuery: string;
  searchResults: User[];
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onGenerate: (data: LinkGenerationData) => void;
}) {
  const [formData, setFormData] = useState<LinkGenerationData>({
    influencerId: '', // This will be the user._id when selected
    maxUses: undefined,
    expiresAt: undefined,
    description: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.influencerId) return;
    onGenerate(formData);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData(prevFormData => {
      const userId = (user as any).id || user._id;
      return {...prevFormData, influencerId: userId};
    });
    setShowSearchResults(false);
    onSearchChange(user.name); // Update search query to show selected user
  };

  const handleSearchFocus = () => {
    if (searchResults.length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding to allow clicking on results
    setTimeout(() => setShowSearchResults(false), 200);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Users className="h-4 w-4 text-green-600" />
          </div>
          Generate User Affiliate Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-lg">
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-sm">
              Search User by Name or Email *
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Type name or email to search..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSelectedUser(null);
                  setFormData(prevFormData => ({...prevFormData, influencerId: ''}));
                }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pr-10"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={(user as any).id || user._id}
                    onClick={() => handleUserSelect(user)}
                    className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-md">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Plan: {user.plan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected User Display */}
            {selectedUser && (
              <div className="mt-2 p-3 bg-muted/30 rounded-md">
                <div className="flex items-center gap-md">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                    {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedUser.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <Badge variant={selectedUser.plan === 'elite' ? 'success' : selectedUser.plan === 'pro' ? 'warning' : 'secondary'}>
                    {selectedUser.plan}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Usage Limit (optional)
            </label>
            <Input
              type="number"
              placeholder="Leave empty for unlimited"
              value={formData.maxUses || ''}
              onChange={(e) => setFormData({...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Expiration Date (optional)
            </label>
            <Input
              type="datetime-local"
              value={formData.expiresAt || ''}
              onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-sm">
              Description (optional)
            </label>
            <Input
              type="text"
              placeholder="e.g., Holiday Campaign 2024"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!formData.influencerId}
          >
            Generate User Affiliate Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Affiliate Links Table
function AffiliateLinksTable({ 
  links, 
  loading, 
  filters, 
  onFiltersChange, 
  onToggleStatus, 
  onCopyLink 
}: {
  links: AffiliateLink[];
  loading: boolean;
  filters: { type: string; status: string; search: string };
  onFiltersChange: (filters: { type: string; status: string; search: string }) => void;
  onToggleStatus: (linkId: string) => void;
  onCopyLink: (text: string) => void;
}) {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-sm">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <LinkIcon className="h-4 w-4 text-primary" />
          </div>
          Affiliate Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-md mb-lg">
          <div className="flex items-center gap-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filters.type}
              onChange={(e) => onFiltersChange({...filters, type: e.target.value})}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background text-foreground"
            >
              <option value="all">All Types</option>
              <option value="elite_gift">Elite Gift</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({...filters, status: e.target.value})}
            className="px-3 py-1 border border-border rounded-md text-sm bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex items-center gap-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={filters.search}
              onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
              className="w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={link.type === 'elite_gift' ? 'default' : 'success'}>
                        {link.type === 'elite_gift' ? '🎁 Elite Gift' : '👥 User'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground">
                        {link.type === 'influencer' && link.influencerId ? (
                          <div>
                            <div className="font-medium">
                              {typeof link.influencerId === 'string' 
                                ? `User ID: ${link.influencerId}` 
                                : `User: ${(link.influencerId as any).name || 'Unknown'}`
                              }
                            </div>
                            {typeof link.influencerId === 'object' && (link.influencerId as any).email && (
                              <div className="text-muted-foreground">{(link.influencerId as any).email}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-muted-foreground">Elite Gift Link</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {link.usedCount} / {link.maxUses || '∞'}
                      </div>
                      {link.maxUses && (
                        <div className="w-full bg-muted rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{width: `${(link.usedCount / link.maxUses) * 100}%`}}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={link.isActive ? 'success' : 'secondary'}>
                        {link.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCopyLink(link.deepLink)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleStatus(link._id)}
                          className={link.isActive ? 'text-destructive hover:text-destructive/80' : 'text-success hover:text-success/80'}
                        >
                          {link.isActive ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Analytics View
function AffiliateAnalyticsView({ 
  analytics, 
  loading 
}: { 
  analytics?: AffiliateAnalytics; 
  loading: boolean;
}) {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="space-y-lg">
      {/* Date Range Selector */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-sm">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            Analytics Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Elite Gifts</p>
                <p className="text-2xl font-semibold text-foreground">
                  {analytics?.summary.totalEliteGifts || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">User Referrals</p>
                <p className="text-2xl font-semibold text-foreground">
                  {analytics?.summary.totalInfluencerReferrals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-semibold text-foreground">
                  {analytics?.summary.totalConversions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Conversion Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart integration placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.topInfluencers?.slice(0, 5).map((influencer, index) => (
                <div key={influencer.influencerId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {influencer.influencerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {influencer.uniqueUsers} unique users
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {influencer.referrals} referrals
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Link Generated Modal
function LinkGeneratedModal({ 
  link, 
  onClose, 
  onCopy 
}: { 
  link: AffiliateLink; 
  onClose: () => void;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-background">
        <div className="mt-3">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-success/10 rounded-full">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-lg font-medium text-foreground">
              Link Generated Successfully!
            </h3>
            <div className="mt-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground break-all">
                  {link.deepLink}
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button
                  onClick={() => onCopy(link.deepLink)}
                  className="flex-1"
                >
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
