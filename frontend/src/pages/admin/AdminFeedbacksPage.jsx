import { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';
import StarRating from '../../components/ui/StarRating';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import { Trash2, MessageSquare, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ productId: '', rating: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.productId) params.set('productId', filters.productId);
      if (filters.rating) params.set('rating', filters.rating);
      const qs = params.toString();
      const res = await API.get(`/admin/feedbacks${qs ? `?${qs}` : ''}`);
      setFeedbacks(res.data.data);
    } catch {
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchFeedbacks(); }, [fetchFeedbacks]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/feedbacks/${deleteTarget.id}`);
      toast.success('Feedback deleted');
      setDeleteTarget(null);
      fetchFeedbacks();
    } catch {
      toast.error('Failed to delete feedback');
    }
  };

  const clearFilters = () => {
    setFilters({ productId: '', rating: '' });
  };

  const hasActiveFilters = filters.productId || filters.rating;

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Feedbacks</h1>
          <p className="text-surface-500 text-sm">{feedbacks.length} total feedbacks</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary ${hasActiveFilters ? 'ring-2 ring-primary-200' : ''}`}
        >
          <Filter className="w-4 h-4" /> Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 mb-6 animate-slide-down flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-surface-500">Rating</label>
            <select
              value={filters.rating}
              onChange={e => setFilters({ ...filters, rating: e.target.value })}
              className="input py-2"
            >
              <option value="">All Ratings</option>
              {[1, 2, 3, 4, 5].map(r => (
                <option key={r} value={r}>{r}★</option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost text-red-500 hover:text-red-600">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No feedbacks" message="Feedbacks will appear here once users submit reviews." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(fb => (
                <tr key={fb.id}>
                  <td>
                    <div>
                      <p className="font-medium text-surface-800">{fb.User?.name || 'Unknown'}</p>
                      <p className="text-xs text-surface-400">{fb.User?.email}</p>
                    </div>
                  </td>
                  <td>
                    <p className="font-medium">{fb.Product?.name || 'Unknown'}</p>
                    {fb.Product?.category && (
                      <span className="text-xs text-surface-400">{fb.Product.category}</span>
                    )}
                  </td>
                  <td><StarRating value={fb.rating} readonly size="sm" /></td>
                  <td>
                    <p className="text-sm text-surface-600 max-w-xs truncate">{fb.comment || '—'}</p>
                  </td>
                  <td className="text-xs text-surface-400 whitespace-nowrap">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => setDeleteTarget(fb)}
                      className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This cannot be undone."
      />
    </div>
  );
}
