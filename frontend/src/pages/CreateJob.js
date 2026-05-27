import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobs } from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

const trades = ['carpentry', 'plumbing', 'electrical', 'welding', 'masonry', 'painting', 'auto_mechanic', 'hvac', 'tailoring', 'hairdressing', 'it_repair', 'catering', 'construction'];

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', trade: '', location: '', budget: '', duration: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await jobs.create(formData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to post job'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white"><h1 className="text-3xl font-bold mb-2">Post a New Job</h1><p className="text-blue-100">Find the perfect skilled worker for your project</p></div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label><input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="e.g., Kitchen Cabinet Installation" /></div>
        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea rows="5" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="Describe the job in detail..." /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-semibold text-gray-700 mb-2">Trade</label><select required value={formData.trade} onChange={(e) => setFormData({...formData, trade: e.target.value})} className="input-field"><option value="">Select trade</option>{trades.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">Location</label><input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field" placeholder="e.g., Kigali, Gasabo" /></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-semibold text-gray-700 mb-2">Budget (RWF)</label><input type="number" required value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="input-field" placeholder="e.g., 100000" /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">Duration (days)</label><input type="number" required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="input-field" placeholder="e.g., 3" /></div></div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2"><Briefcase className="h-5 w-5" />{loading ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
  );
};

export default CreateJob;