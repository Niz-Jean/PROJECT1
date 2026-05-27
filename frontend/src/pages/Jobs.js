import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobs } from '../services/api';
import { Briefcase, MapPin, Clock } from 'lucide-react';

const Jobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobs.getMyJobs();
        setJobsList(res.data.data || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'badge-success';
      case 'in_progress': return 'badge-info';
      case 'accepted': return 'badge-warning';
      default: return 'badge-warning';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold mb-6">My Jobs</h1>
      {jobsList.length === 0 ? (<div className="text-center py-12 bg-white rounded-lg"><Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No jobs found</p><Link to="/create-job" className="btn-primary inline-block mt-4">Post Your First Job</Link></div>) : 
        (<div className="space-y-4">{jobsList.map(job => (<Link key={job.id} to={`/jobs/${job.id}`} className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"><div className="flex justify-between items-start"><div><h3 className="text-lg font-semibold">{job.title}</h3><p className="text-gray-600 mt-1">{job.description?.substring(0, 150)}...</p><div className="flex items-center gap-4 mt-3"><div className="flex items-center text-sm text-gray-500"><MapPin className="h-4 w-4 mr-1" />{job.location}</div><div className="flex items-center text-sm text-gray-500"><Clock className="h-4 w-4 mr-1" />{job.duration} days</div><div className="text-sm font-semibold text-blue-600">{job.budget?.toLocaleString()} RWF</div></div></div><span className={`badge ${getStatusColor(job.status)}`}>{job.status?.replace('_', ' ')}</span></div></Link>))}</div>)}
    </div>
  );
};

export default Jobs;