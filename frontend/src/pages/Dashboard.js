import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobs, workers } from '../services/api';
import { Briefcase, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, completedJobs: 0, pendingJobs: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedWorkers, setRecommendedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await jobs.getMyJobs();
        const userJobs = jobsRes.data.data || [];
        setStats({
          activeJobs: userJobs.filter(j => j.status === 'in_progress').length,
          completedJobs: userJobs.filter(j => j.status === 'completed').length,
          pendingJobs: userJobs.filter(j => j.status === 'pending').length
        });
        setRecentJobs(userJobs.slice(0, 5));
        
        if (user?.role === 'client') {
          const workersRes = await workers.getAll({ limit: 5 });
          setRecommendedWorkers(workersRes.data.data || []);
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Murakaza Neza, {user?.name}! 👋</h1>
        <p className="text-blue-100">{user?.role === 'client' ? 'Find skilled workers for your projects' : 'Manage your jobs and connect with clients'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex justify-between"><div><p className="text-gray-500">Active Jobs</p><p className="text-2xl font-bold">{stats.activeJobs}</p></div><div className="bg-blue-100 p-3 rounded-full"><Briefcase className="h-6 w-6 text-blue-600" /></div></div></div>
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex justify-between"><div><p className="text-gray-500">Completed</p><p className="text-2xl font-bold">{stats.completedJobs}</p></div><div className="bg-green-100 p-3 rounded-full"><CheckCircle className="h-6 w-6 text-green-600" /></div></div></div>
        <div className="bg-white rounded-xl shadow-md p-6"><div className="flex justify-between"><div><p className="text-gray-500">Pending</p><p className="text-2xl font-bold">{stats.pendingJobs}</p></div><div className="bg-yellow-100 p-3 rounded-full"><Clock className="h-6 w-6 text-yellow-600" /></div></div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6"><h2 className="text-xl font-bold mb-4">Recent Jobs</h2>{recentJobs.length === 0 ? <p className="text-gray-500 text-center py-8">No jobs yet</p> : recentJobs.map(job => (<Link key={job.id} to={`/jobs/${job.id}`} className="block border rounded-lg p-4 mb-3 hover:shadow-md"><h3 className="font-semibold">{job.title}</h3><div className="flex items-center gap-3 mt-2"><span className="text-xs text-gray-500">{job.budget?.toLocaleString()} RWF</span><span className={`text-xs px-2 py-1 rounded-full ${job.status === 'completed' ? 'bg-green-100 text-green-600' : job.status === 'in_progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{job.status}</span></div></Link>))}</div>
        {user?.role === 'client' && (<div className="bg-white rounded-xl shadow-md p-6"><h2 className="text-xl font-bold mb-4">Recommended Workers</h2>{recommendedWorkers.length === 0 ? <p className="text-gray-500 text-center py-8">No workers available</p> : recommendedWorkers.map(worker => (<Link key={worker.id} to={`/workers/${worker.userId}`} className="flex items-center gap-3 border rounded-lg p-3 mb-3"><img src={worker.user?.profileImage || `https://ui-avatars.com/api/?name=${worker.user?.name}`} className="w-12 h-12 rounded-full" /><div><p className="font-semibold">{worker.user?.name}</p><p className="text-sm text-gray-500">{worker.trade}</p><p className="text-sm font-semibold text-blue-600">{worker.hourlyRate?.toLocaleString()} RWF/hr</p></div></Link>))}</div>)}
      </div>
    </div>
  );
};

export default Dashboard;