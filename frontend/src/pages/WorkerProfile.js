import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workers } from '../services/api';
import { Star, MapPin, Mail, Phone, MessageCircle, Clock, Briefcase, Award } from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await workers.getById(id);
        setWorker(res.data.data.worker);
        setReviews(res.data.data.reviews || []);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchWorker();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!worker) return <div className="text-center py-12"><h2 className="text-2xl font-bold">Worker not found</h2><Link to="/workers" className="text-blue-600">Back to workers</Link></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center -mt-16 mb-6">
            <img src={worker.user?.profileImage || `https://ui-avatars.com/api/?name=${worker.user?.name}&background=3b82f6&color=fff&size=128`} alt={worker.user?.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
            <div className="mt-4 md:mt-0 md:ml-6 flex-1"><h1 className="text-2xl font-bold">{worker.user?.name}</h1><p className="text-gray-600 capitalize">{worker.trade?.replace('_', ' ')}</p><div className="flex items-center gap-4 mt-2"><div className="flex items-center"><Star className="h-5 w-5 text-yellow-400 fill-current" /><span className="ml-1 font-semibold">{worker.rating?.toFixed(1)}</span><span className="text-gray-500 ml-1">({worker.totalReviews} reviews)</span></div><div className="flex items-center text-gray-500"><MapPin className="h-4 w-4 mr-1" /><span>{worker.user?.district}</span></div></div></div>
            <Link to={`/messages?worker=${worker.userId}`} className="btn-primary flex items-center gap-2 mt-4 md:mt-0"><MessageCircle className="h-4 w-4" />Contact</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><h2 className="text-lg font-semibold mb-3">About</h2><p className="text-gray-600">{worker.description || 'No description provided'}</p><h2 className="text-lg font-semibold mt-6 mb-3">Skills</h2><div className="flex flex-wrap gap-2">{worker.skills?.map((skill, idx) => (<span key={idx} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">{skill}</span>))}</div><h2 className="text-lg font-semibold mt-6 mb-3">Experience</h2><p className="text-gray-600"><Briefcase className="h-4 w-4 inline mr-2" />{worker.experience} years of experience</p><h2 className="text-lg font-semibold mt-6 mb-3">Completed Jobs</h2><p className="text-gray-600"><Award className="h-4 w-4 inline mr-2" />{worker.completedJobs} jobs completed successfully</p></div>
            <div className="bg-gray-50 rounded-lg p-6"><h3 className="text-lg font-semibold mb-4">Contact Information</h3><div className="space-y-3"><div className="flex items-center text-gray-600"><Mail className="h-4 w-4 mr-2" /><span>{worker.user?.email}</span></div><div className="flex items-center text-gray-600"><Phone className="h-4 w-4 mr-2" /><span>{worker.user?.phone}</span></div><div className="pt-4 border-t"><div className="text-2xl font-bold text-blue-600">{worker.hourlyRate?.toLocaleString()} RWF</div><div className="text-sm text-gray-500">per hour</div></div><div className="mt-4"><div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${worker.availabilityStatus === 'available' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}><Clock className="h-3 w-3 mr-1" />{worker.availabilityStatus === 'available' ? 'Available Now' : 'Currently Busy'}</div></div></div></div>
          </div>
          {reviews.length > 0 && (<div className="mt-6"><h2 className="text-lg font-semibold mb-4">Reviews ({reviews.length})</h2>{reviews.map(review => (<div key={review.id} className="border-t pt-4 mt-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="ml-1 font-medium">{review.rating}</span><span className="ml-2 text-sm text-gray-500">by {review.reviewer?.name}</span></div><span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="text-gray-600">{review.comment}</p></div>))}</div>)}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;