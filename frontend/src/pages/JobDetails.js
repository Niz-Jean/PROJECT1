import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobs } from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Clock, DollarSign, User, Briefcase, CheckCircle } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState({ proposal: '', proposedPrice: '' });
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try { const res = await jobs.getById(id); setJob(res.data.data); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try { await jobs.apply(id, proposal); toast.success('Application submitted!'); setShowApplyForm(false); fetchJob(); } 
    catch (error) { toast.error(error.response?.data?.message); }
  };

  const handleAcceptWorker = async (workerId) => {
    try { await jobs.accept(id, workerId); toast.success('Worker accepted!'); fetchJob(); } 
    catch (error) { toast.error(error.response?.data?.message); }
  };

  const handleUpdateStatus = async (status) => {
    try { await jobs.updateStatus(id, status); toast.success(`Job marked as ${status}`); fetchJob(); } 
    catch (error) { toast.error(error.response?.data?.message); }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!job) return <div className="text-center py-12"><h2 className="text-2xl font-bold">Job not found</h2></div>;

  const isClient = user?.role === 'client' && job.client?.id === user?.id;
  const isWorker = user?.role === 'worker';
  const hasApplied = job.applications?.some(a => a.worker?.id === user?.id);
  const isAccepted = job.worker?.id === user?.id;

  return (
    <div className="max-w-4xl mx-auto"><div className="bg-white rounded-xl shadow-md overflow-hidden"><div className="p-6">
      <div className="flex justify-between items-start mb-4"><div><h1 className="text-2xl font-bold">{job.title}</h1><div className="flex items-center gap-2 mt-2"><span className={`badge ${job.status === 'completed' ? 'badge-success' : job.status === 'in_progress' ? 'badge-info' : 'badge-warning'}`}>{job.status}</span><span className="text-sm text-gray-500">Posted {new Date(job.createdAt).toLocaleDateString()}</span></div></div><div className="text-right"><div className="text-2xl font-bold text-blue-600">{job.budget?.toLocaleString()} RWF</div><div className="text-sm text-gray-500">Budget</div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><div className="flex items-center text-gray-600"><MapPin className="h-5 w-5 mr-2" />{job.location}</div><div className="flex items-center text-gray-600"><Clock className="h-5 w-5 mr-2" />{job.duration} days</div><div className="flex items-center text-gray-600"><Briefcase className="h-5 w-5 mr-2" />{job.trade}</div></div>
      <div className="mb-6"><h2 className="text-lg font-semibold mb-2">Description</h2><p className="text-gray-600">{job.description}</p></div>
      
      {isClient && job.status === 'pending' && job.applications?.length > 0 && (<div className="mb-6"><h2 className="text-lg font-semibold mb-3">Applications ({job.applications.length})</h2>{job.applications.map(app => (<div key={app.id} className="border rounded-lg p-4 mb-3 flex justify-between items-center"><div><p className="font-semibold">{app.worker?.name}</p><p className="text-sm text-gray-600">{app.proposal}</p><p className="text-sm font-semibold text-blue-600">{app.proposedPrice?.toLocaleString()} RWF</p></div><button onClick={() => handleAcceptWorker(app.worker.id)} className="btn-primary text-sm px-4 py-1">Accept</button></div>))}</div>)}
      
      {isClient && job.status === 'accepted' && (<div className="mb-6"><button onClick={() => handleUpdateStatus('in_progress')} className="btn-primary">Start Job</button></div>)}
      {isClient && job.status === 'in_progress' && (<div className="mb-6"><button onClick={() => handleUpdateStatus('completed')} className="btn-primary">Mark as Completed</button></div>)}
      
      {isWorker && !hasApplied && !isAccepted && job.status === 'pending' && !showApplyForm && (<button onClick={() => setShowApplyForm(true)} className="btn-primary">Apply for this Job</button>)}
      
      {showApplyForm && (<form onSubmit={handleApply} className="mt-4 p-4 bg-gray-50 rounded-lg"><textarea placeholder="Write your proposal..." value={proposal.proposal} onChange={(e) => setProposal({...proposal, proposal: e.target.value})} className="input-field mb-3" rows="3" required /><input type="number" placeholder="Your proposed price (RWF)" value={proposal.proposedPrice} onChange={(e) => setProposal({...proposal, proposedPrice: e.target.value})} className="input-field mb-3" /><div className="flex gap-2"><button type="submit" className="btn-primary">Submit Application</button><button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button></div></form>)}
      
      {isWorker && isAccepted && job.status === 'accepted' && (<button onClick={() => handleUpdateStatus('in_progress')} className="btn-primary">Start Working</button>)}
      {isWorker && isAccepted && job.status === 'in_progress' && (<button onClick={() => handleUpdateStatus('completed')} className="btn-primary">Mark as Completed</button>)}
    </div></div></div>
  );
};

export default JobDetails;