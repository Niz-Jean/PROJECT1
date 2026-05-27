import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, workers } from '../services/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '', district: user?.district || '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await auth.updateProfile(formData);
      updateUser(res.data.data);
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (error) { toast.error(error.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto"><div className="bg-white rounded-xl shadow-md overflow-hidden"><div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div><div className="px-6 pb-6"><div className="flex flex-col md:flex-row items-start md:items-center -mt-16 mb-6"><img src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff&size=128`} alt={user?.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" /><div className="mt-4 md:mt-0 md:ml-6 flex-1"><h1 className="text-2xl font-bold">{user?.name}</h1><p className="text-gray-500 capitalize">{user?.role}</p><div className="flex items-center gap-2 mt-2">{user?.isVerified ? <span className="badge-success badge">Verified</span> : <span className="badge-warning badge">Not Verified</span>}</div></div><button onClick={() => setIsEditing(!isEditing)} className="btn-outline flex items-center gap-2">{isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}{isEditing ? 'Cancel' : 'Edit Profile'}</button></div>
      {isEditing ? (<form onSubmit={handleUpdate} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field" required /></div><div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field" required /></div><div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" required /></div><div><label className="block text-sm font-medium mb-1">District</label><input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="input-field" required /></div></div><button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2"><Save className="h-4 w-4" />{loading ? 'Saving...' : 'Save Changes'}</button></form>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"><div className="flex items-center text-gray-600"><Mail className="h-5 w-5 mr-3" /><div><p className="text-sm text-gray-500">Email</p><p>{user?.email}</p></div></div><div className="flex items-center text-gray-600"><Phone className="h-5 w-5 mr-3" /><div><p className="text-sm text-gray-500">Phone</p><p>{user?.phone}</p></div></div><div className="flex items-center text-gray-600"><MapPin className="h-5 w-5 mr-3" /><div><p className="text-sm text-gray-500">Location</p><p>{user?.location}</p></div></div><div className="flex items-center text-gray-600"><User className="h-5 w-5 mr-3" /><div><p className="text-sm text-gray-500">District</p><p>{user?.district}</p></div></div></div>)}
      {user?.role === 'worker' && !user?.workerProfile && (<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-yellow-800">You haven't created your worker profile yet.</p><a href="/worker-profile-setup" className="btn-primary inline-block mt-2">Create Worker Profile</a></div>)}
    </div></div></div>
  );
};

export default Profile;