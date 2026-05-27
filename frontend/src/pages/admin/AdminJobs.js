import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Eye, Edit2, Trash2, MapPin, DollarSign, Clock } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [search, statusFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/jobs', {
        params: { search, status: statusFilter }
      });
      setJobs(res.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      try {
        await axios.delete(`/api/admin/jobs/${jobId}`);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/jobs/${editingJob.id}`, editingJob);
      toast.success('Job updated successfully');
      setShowEditModal(false);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    }
  };

  const viewJobDetails = async (jobId) => {
    try {
      const res = await axios.get(`/api/admin/jobs/${jobId}`);
      setSelectedJob(res.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      toast.error('Failed to load job details');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      accepted: 'badge-info',
      in_progress: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-danger'
    };
    return <span className={`badge ${badges[status]}`}>{status.replace('_', ' ')}</span>;
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
        <h1 className="text-2xl font-bold mb-2">Job Management</h1>
        <p className="text-purple-100">Monitor and manage all job postings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-48">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4"><div><p className="font-medium text-gray-900">{job.title}</p><p className="text-sm text-gray-500 line-clamp-1">{job.description?.substring(0, 60)}</p></div></td>
                  <td className="px-6 py-4"><p className="text-sm">{job.client?.name}</p><p className="text-xs text-gray-500">{job.location}</p></td>
                  <td className="px-6 py-4"><p className="font-semibold text-blue-600">{job.budget?.toLocaleString()} RWF</p><p className="text-xs text-gray-500">{job.duration} days</p></td>
                  <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => viewJobDetails(job.id)} className="text-blue-600 hover:text-blue-800 p-1"><Eye className="h-5 w-5" /></button><button onClick={() => { setEditingJob(job); setShowEditModal(true); }} className="text-green-600 hover:text-green-800 p-1"><Edit2 className="h-5 w-5" /></button><button onClick={() => handleDeleteJob(job.id, job.title)} className="text-red-600 hover:text-red-800 p-1"><Trash2 className="h-5 w-5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Job</h2>
            <form onSubmit={handleUpdateJob} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={editingJob.title} onChange={(e) => setEditingJob({...editingJob, title: e.target.value})} className="input-field" required /></div>
              <div><label className="block text-sm font-medium mb-1">Description</label><textarea rows="4" value={editingJob.description} onChange={(e) => setEditingJob({...editingJob, description: e.target.value})} className="input-field" required /></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Trade</label><input type="text" value={editingJob.trade} onChange={(e) => setEditingJob({...editingJob, trade: e.target.value})} className="input-field" /></div><div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={editingJob.location} onChange={(e) => setEditingJob({...editingJob, location: e.target.value})} className="input-field" /></div></div>
              <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Budget (RWF)</label><input type="number" value={editingJob.budget} onChange={(e) => setEditingJob({...editingJob, budget: e.target.value})} className="input-field" /></div><div><label className="block text-sm font-medium mb-1">Duration (days)</label><input type="number" value={editingJob.duration} onChange={(e) => setEditingJob({...editingJob, duration: e.target.value})} className="input-field" /></div></div>
              <div><label className="block text-sm font-medium mb-1">Status</label><select value={editingJob.status} onChange={(e) => setEditingJob({...editingJob, status: e.target.value})} className="input-field"><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
              <div className="flex gap-3 pt-4"><button type="submit" className="btn-primary flex-1">Save Changes</button><button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancel</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4"><h2 className="text-xl font-bold">{selectedJob.title}</h2><button onClick={() => setShowDetailsModal(false)} className="text-gray-500 hover:text-gray-700">✕</button></div>
            <div className="space-y-4"><div><p className="text-sm text-gray-500">Client</p><p className="font-medium">{selectedJob.client?.name} ({selectedJob.client?.email})</p></div><div><p className="text-sm text-gray-500">Description</p><p>{selectedJob.description}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-gray-500">Location</p><p>{selectedJob.location}</p></div><div><p className="text-sm text-gray-500">Budget</p><p className="font-semibold text-blue-600">{selectedJob.budget?.toLocaleString()} RWF</p></div><div><p className="text-sm text-gray-500">Duration</p><p>{selectedJob.duration} days</p></div><div><p className="text-sm text-gray-500">Status</p>{getStatusBadge(selectedJob.status)}</div></div>
              {selectedJob.worker && (<div><p className="text-sm text-gray-500">Assigned Worker</p><p>{selectedJob.worker.name} ({selectedJob.worker.email})</p></div>)}
              {selectedJob.applications?.length > 0 && (<div><p className="text-sm text-gray-500 mb-2">Applications ({selectedJob.applications.length})</p><div className="space-y-2">{selectedJob.applications.map(app => (<div key={app.id} className="bg-gray-50 p-3 rounded-lg"><p className="font-medium">{app.worker?.name}</p><p className="text-sm">{app.proposal}</p><p className="text-sm font-semibold text-blue-600">{app.proposedPrice?.toLocaleString()} RWF</p></div>))}</div></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;