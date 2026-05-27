import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workers, upload } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';
import { Wrench, Briefcase, Clock, DollarSign, Plus, X } from 'lucide-react';

const trades = ['carpentry', 'plumbing', 'electrical', 'welding', 'masonry', 'painting', 'auto_mechanic', 'hvac', 'tailoring', 'hairdressing', 'it_repair', 'catering', 'farming', 'construction'];

const WorkerProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    skills: [],
    trade: '',
    experience: '',
    description: '',
    hourlyRate: '',
    availabilityStatus: 'available',
    portfolio: [],
    certificates: []
  });
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await workers.createProfile(formData);
      toast.success('Worker profile created successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4"><Wrench className="h-10 w-10" /><h1 className="text-3xl font-bold">Complete Your Worker Profile</h1></div>
        <p className="text-blue-100">Set up your professional profile to start receiving job offers</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Trade / Profession</label>
            <select required value={formData.trade} onChange={(e) => setFormData({...formData, trade: e.target.value})} className="input-field">
              <option value="">Select your trade</option>
              {trades.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Experience (years)</label>
            <input type="number" required value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} className="input-field" placeholder="e.g., 5" />
          </div>
        </div>

        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
          <div className="flex gap-2 mb-3"><input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="input-field flex-1" placeholder="e.g., Carpentry" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} /><button type="button" onClick={addSkill} className="btn-secondary"><Plus className="h-5 w-5" /></button></div>
          <div className="flex flex-wrap gap-2">{formData.skills.map(skill => (<span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">{skill}<button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-600"><X className="h-3 w-3" /></button></span>))}</div>
        </div>

        <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea rows="4" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="Tell clients about your experience, expertise, and what makes you unique..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Hourly Rate (RWF)</label>
            <input type="number" required value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} className="input-field" placeholder="e.g., 5000" />
          </div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
            <select value={formData.availabilityStatus} onChange={(e) => setFormData({...formData, availabilityStatus: e.target.value})} className="input-field">
              <option value="available">Available for work</option>
              <option value="busy">Currently busy</option>
              <option value="unavailable">Not available</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2"><Briefcase className="h-5 w-5" />{loading ? 'Creating Profile...' : 'Create Worker Profile'}</button>
      </form>
    </div>
  );
};

export default WorkerProfileSetup;