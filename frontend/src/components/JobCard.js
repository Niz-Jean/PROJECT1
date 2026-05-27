import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Briefcase } from 'lucide-react';

const WorkerCard = ({ worker }) => {
  return (
    <Link to={`/workers/${worker.userId}`} className="block card hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <img src={worker.user?.profileImage || `https://ui-avatars.com/api/?name=${worker.user?.name}&background=3b82f6&color=fff`} alt={worker.user?.name} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1"><h3 className="text-lg font-semibold text-gray-900">{worker.user?.name}</h3><p className="text-sm text-gray-500 capitalize">{worker.trade?.replace('_', ' ')}</p>
            <div className="flex items-center gap-2 mt-2"><div className="flex items-center"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="text-sm font-medium ml-1">{worker.rating?.toFixed(1)}</span></div><span className="text-xs text-gray-400">•</span><span className="text-sm text-gray-500">{worker.totalReviews} reviews</span></div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500"><MapPin className="h-4 w-4" /><span>{worker.user?.district}</span></div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t"><div className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-gray-400" /><span className="text-sm text-gray-600">{worker.experience} years</span></div><div className="text-right"><span className="text-lg font-bold text-blue-600">{worker.hourlyRate?.toLocaleString()}</span><span className="text-sm text-gray-500"> RWF/hr</span></div></div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkerCard;