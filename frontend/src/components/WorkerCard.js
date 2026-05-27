import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, DollarSign, MapPin, Star } from 'lucide-react';

const formatTrade = (trade) => {
  if (!trade) return 'Skilled worker';
  return trade.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatRate = (rate) => {
  const amount = Number(rate || 0);
  return amount.toLocaleString();
};

const WorkerCard = ({ worker }) => {
  const user = worker?.user || {};
  const rating = Number(worker?.rating || 0);
  const isVerified = worker?.verificationStatus === 'verified';

  return (
    <Link
      to={`/workers/${worker.userId}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Worker')}&background=3b82f6&color=fff`}
            alt={user.name || 'Worker'}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{user.name || 'Unnamed Worker'}</h3>
              {isVerified && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
            </div>
            <p className="text-sm text-blue-600 font-medium">{formatTrade(worker.trade)}</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{user.district || user.location || 'Rwanda'}</span>
            </div>
          </div>
        </div>

        {worker.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{worker.description}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-gray-500">({worker.totalReviews || 0})</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>{formatRate(worker.hourlyRate)} RWF/hr</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkerCard;
