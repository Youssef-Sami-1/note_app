import { useState, useEffect } from 'react';
import { Card, Alert, Spinner, Badge } from 'flowbite-react';
import { HiUser, HiMail, HiCalendar, HiDocumentText } from 'react-icons/hi';
import { authApi, notesApi } from '../api/notesApi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalNotes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch user info and notes stats
      const [userResponse, notesResponse] = await Promise.all([
        authApi.getCurrentUser().catch(() => ({ name: 'User', email: 'user@example.com' })),
        notesApi.getAllNotes().catch(() => ({ notes: [] }))
      ]);

      setUser(userResponse);
      setStats({
        totalNotes: notesResponse.notes?.length || notesResponse.length || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert color="failure" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Information Card */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <HiUser className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user?.name || 'User'}
                    </h2>
                    <p className="text-gray-600">Note App User</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <HiMail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <HiCalendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-gray-600">{formatDate(user?.createdAt)}</p>
                    </div>
                  </div>

                  {user?.lastLogin && (
                    <div className="flex items-center space-x-3">
                      <HiCalendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Login</p>
                        <p className="text-gray-600">{formatDate(user.lastLogin)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Statistics Card */}
            <div>
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HiDocumentText className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Total Notes</span>
                    </div>
                    <Badge color="success" size="sm">
                      {stats.totalNotes}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {stats.totalNotes}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stats.totalNotes === 1 ? 'Note Created' : 'Notes Created'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Status Card */}
              <Card className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Account Type</span>
                    <Badge color="info">Free</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status</span>
                    <Badge color="success">Active</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
