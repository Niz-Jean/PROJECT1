import React, { useState, useEffect } from 'react';
import { workers } from '../services/api';
import WorkerCard from '../components/WorkerCard';
import { Search, Filter, X } from 'lucide-react';

const trades = ['carpentry', 'plumbing', 'electrical', 'welding', 'masonry', 'painting', 'auto_mechanic', 'hvac', 'tailoring', 'hairdressing', 'it_repair', 'catering', 'construction'];

const Workers = () => {
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ trade: '', minRating: '', minRate: '', maxRate: '' });

  useEffect(() => { fetchWorkers(); }, [filters]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const res = await workers.getAll(params);
      setWorkersList(res.data.data || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const filteredWorkers = searchTerm ? workersList.filter(w => w.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || w.trade?.includes(searchTerm.toLowerCase())) : workersList;
  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Find Skilled Workers</h1><p className="text-gray-600">Connect with verified TVET professionals across Rwanda</p></div>
      <div className="mb-6 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search by name or trade..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10 pr-24" /><button onClick={() => setShowFilters(!showFilters)} className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"><Filter className="h-4 w-4" /><span className="text-sm">Filters</span>{activeFiltersCount > 0 && <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>}</button></div>
      {showFilters && (<div className="bg-white rounded-lg shadow-md p-6 mb-8"><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><select name="trade" value={filters.trade} onChange={(e) => setFilters({...filters, trade: e.target.value})} className="input-field"><option value="">All Trades</option>{trades.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select><select name="minRating" value={filters.minRating} onChange={(e) => setFilters({...filters, minRating: e.target.value})} className="input-field"><option value="">Any Rating</option><option value="4">4+ Stars</option><option value="3">3+ Stars</option></select><input type="number" placeholder="Min Rate (RWF)" value={filters.minRate} onChange={(e) => setFilters({...filters, minRate: e.target.value})} className="input-field" /><input type="number" placeholder="Max Rate (RWF)" value={filters.maxRate} onChange={(e) => setFilters({...filters, maxRate: e.target.value})} className="input-field" /></div><button onClick={() => setFilters({ trade: '', minRating: '', minRate: '', maxRate: '' })} className="mt-4 text-sm text-blue-600 flex items-center gap-1"><X className="h-3 w-3" />Clear all</button></div>)}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredWorkers.map(worker => (<WorkerCard key={worker.id} worker={worker} />))}</div>
      {filteredWorkers.length === 0 && (<div className="text-center py-12"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-900 mb-2">No workers found</h3><p className="text-gray-500">Try adjusting your filters</p></div>)}
    </div>
  );
};

export default Workers;