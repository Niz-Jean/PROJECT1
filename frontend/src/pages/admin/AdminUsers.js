import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Edit2, Trash2, CheckCircle, XCircle, UserCheck, Shield, Eye } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users', {
        params: { search, role: roleFilter }
      });
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleVerifyWorker = async (userId, status) => {
    try {
      await axios.put(`/api/admin/users/${userId}/verify-worker`, { status });
      toast.success(`Worker ${status} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/users/${editingUser.id}`, editingUser);
      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return <span className="badge-danger badge">Admin</span>;
      case 'worker': return <span className="badge-info badge">Worker</span>;
      default: return <span className="badge-success badge">Client</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-purple-100">Manage all users, verify workers, and control access</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field w-48"
          >
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="worker">Workers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.phone}</p>
                    <p className="text-sm text-gray-500">{user.district}, {user.location}</p>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        {user.isVerified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                        <span className="text-sm">{user.isVerified ? 'Verified' : 'Unverified'}</span>
                      </div>
                      {user.role === 'worker' && user.workerProfile && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-gray-500 capitalize">{user.workerProfile.verificationStatus}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setShowEditModal(true); }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      {user.role === 'worker' && user.workerProfile?.verificationStatus === 'pending' && (
                        <button
                          onClick={() => handleVerifyWorker(user.id, 'verified')}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Verify Worker"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={editingUser.phone} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={editingUser.location} onChange={(e) => setEditingUser({...editingUser, location: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">District</label><input type="text" value={editingUser.district} onChange={(e) => setEditingUser({...editingUser, district: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Role</label><select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} className="input-field"><option value="client">Client</option><option value="worker">Worker</option><option value="admin">Admin</option></select></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={editingUser.isVerified} onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.checked})} className="w-4 h-4" /><label className="text-sm">Verified</label></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary flex-1">Save Changes</button><button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;