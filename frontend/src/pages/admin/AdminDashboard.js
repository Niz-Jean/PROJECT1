import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Users, Briefcase, Star, CheckCircle, Clock, XCircle, 
  TrendingUp, UserCheck, FileText, MessageSquare, 
  Shield, AlertCircle, Calendar, DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/dashboard/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats?.users?.total || 0, icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { title: 'Total Jobs', value: stats?.jobs?.total || 0, icon: Briefcase, color: 'bg-green-500', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { title: 'Completed Jobs', value: stats?.jobs?.completed || 0, icon: CheckCircle, color: 'bg-purple-500', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { title: 'Pending Jobs', value: stats?.jobs?.pending || 0, icon: Clock, color: 'bg-yellow-500', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { title: 'Total Reviews', value: stats?.reviews?.total || 0, icon: Star, color: 'bg-pink-500', bgColor: 'bg-pink-100', textColor: 'text-pink-600' },
    { title: 'Avg Rating', value: stats?.reviews?.averageRating?.toFixed(1) || 0, icon: Star, color: 'bg-orange-500', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
    { title: 'Verified Workers', value: stats?.workers?.verified || 0, icon: UserCheck, color: 'bg-teal-500', bgColor: 'bg-teal-100', textColor: 'text-teal-600' },
    { title: 'Pending Verification', value: stats?.workers?.pending || 0, icon: Shield, color: 'bg-red-500', bgColor: 'bg-red-100', textColor: 'text-red-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Welcome back, {user?.name}! Manage your platform from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
            <button onClick={() => setActiveTab('users')} className="text-blue-600 text-sm">View All →</button>
          </div>
          <div className="space-y-3">
            {stats?.recent?.users?.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className={`badge ${user.role === 'admin' ? 'badge-danger' : user.role === 'worker' ? 'badge-info' : 'badge-success'}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
            <button onClick={() => setActiveTab('jobs')} className="text-blue-600 text-sm">View All →</button>
          </div>
          <div className="space-y-3">
            {stats?.recent?.jobs?.slice(0, 5).map(job => (
              <div key={job.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-gray-500">Client: {job.client?.name}</p>
                  </div>
                  <span className={`badge ${job.status === 'completed' ? 'badge-success' : job.status === 'in_progress' ? 'badge-info' : 'badge-warning'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Budget: {job.budget?.toLocaleString()} RWF</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;