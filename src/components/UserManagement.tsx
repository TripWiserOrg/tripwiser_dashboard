import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Input } from './ui/Input';
import { apiService } from '../services/api';
import { User } from '../types';
import {
  Users,
  Search,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Shield,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

interface UserManagementProps {
  onBack: () => void;
}

export function UserManagement({ onBack }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading, error } = useQuery(
    'allUsers',
    () => apiService.getAllUsers()
  );

  // Delete user mutation
  const deleteMutation = useMutation(
    (userId: string) => apiService.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allUsers');
        queryClient.invalidateQueries('platformStats');
        setShowDeleteModal(false);
        setSelectedUser(null);
      },
    }
  );

  // Update user mutation
  const updateMutation = useMutation(
    ({ id, userData }: { id: string; userData: Partial<User> }) =>
      apiService.updateUser(id, userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allUsers');
        setShowEditModal(false);
        setSelectedUser(null);
      },
    }
  );

  // Filter users based on search
  const filteredUsers = users?.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser._id);
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'elite':
        return 'default';
      case 'pro':
        return 'secondary';
      case 'free':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-destructive">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p>Failed to load users</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-lg">
      {/* Header */}
      <div className="mb-2xl">
        <Button variant="outline" size="sm" onClick={onBack} className="mb-4">
          ← Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, update plans, and monitor account status
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">{filteredUsers?.length || 0} Users</Badge>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-lg">
        <CardContent className="p-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-sm">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getPlanBadgeVariant(user.plan)}>
                          {user.plan.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          {user.auth_provider || 'local'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={(userData) => {
            updateMutation.mutate({ id: selectedUser._id, userData });
          }}
          isLoading={updateMutation.isLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Delete User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                This will permanently delete the user account and all associated data. This action
                cannot be undone.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1"
                  disabled={deleteMutation.isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                  disabled={deleteMutation.isLoading}
                >
                  {deleteMutation.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({
  user,
  onClose,
  onSave,
  isLoading,
}: {
  user: User;
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [plan, setPlan] = useState<'free' | 'pro' | 'elite'>(user.plan);
  const [bio, setBio] = useState(user.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, plan, bio });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as 'free' | 'pro' | 'elite')}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="elite">Elite</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                placeholder="User bio..."
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
