import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, UserCheck, Eye, EyeOff, ArrowLeft, Wrench } from 'lucide-react';

const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', location: '', district: '', role: 'client' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    if (result.success) navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-blue-600 mb-4"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          <div className="flex justify-center"><div className="bg-blue-100 p-3 rounded-full"><Wrench className="h-12 w-12 text-blue-600" /></div></div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Create Account</h2>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-field pl-10" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input-field pl-10" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field pl-10 pr-10" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}</button></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input-field pl-10" placeholder="+250 788 123 456" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><div className="relative"><MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="input-field pl-10" placeholder="Kigali" required /></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label><select name="district" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="input-field" required><option value="">Select district</option>{districts.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label><div className="grid grid-cols-2 gap-4"><button type="button" onClick={() => setFormData({...formData, role: 'client'})} className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'client' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><User className="h-6 w-6 mx-auto mb-2 text-gray-600" /><span className="text-sm font-medium">Client</span></button><button type="button" onClick={() => setFormData({...formData, role: 'worker'})} className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'worker' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}><User className="h-6 w-6 mx-auto mb-2 text-gray-600" /><span className="text-sm font-medium">Worker</span></button></div></div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2"><UserCheck className="h-5 w-5" />{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
};

export default Register;