import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/ui/StarRating';
import { PageLoader } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ArrowLeft, Trash2, ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

const RATING_COLORS = ['#ef4444', '#f97316', '#fbbf24', '#34d399', '#6366f1'];
const SENTIMENT_COLORS = { positive: '#10b981', neutral: '#f59e0b', negative: '#ef4444' };

export default function ProductAnalysisPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/admin/analysis/${productId}`);
      setData(res.data.data);
    } catch {
      toast.error('Failed to load analysis');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [productId]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/feedbacks/${deleteTarget.id}`);
      toast.success('Feedback deleted');
      setDeleteTarget(null);
      fetchData();
    } catch {
      toast.error('Failed to delete feedback');
    }
  };

  if (loading) return <PageLoader />;
  if (!data) return null;

  const ratingData = (data.ratingBreakdown || []).map(item => ({
    name: `${item.rating}★`,
    count: item.count,
    rating: item.rating
  }));

  const sentimentData = [
    { name: 'Positive', value: data.sentiment?.positive || 0 },
    { name: 'Neutral', value: data.sentiment?.neutral || 0 },
    { name: 'Negative', value: data.sentiment?.negative || 0 },
  ].filter(s => s.value > 0);

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Product Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-24 h-24 rounded-xl bg-surface-100 overflow-hidden flex-shrink-0">
            {data.product?.imageUrl ? (
              <img src={data.product.imageUrl} alt={data.product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-surface-300 text-2xl">📦</div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-surface-900">{data.product?.name}</h1>
                {data.product?.category && <Badge variant="primary" className="mt-1">{data.product.category}</Badge>}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-surface-900">{data.avgRating}<span className="text-lg text-amber-400">★</span></p>
                <p className="text-xs text-surface-400">{data.totalCount} reviews</p>
              </div>
            </div>
            <p className="text-sm text-surface-500 mt-2">{data.product?.description}</p>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-surface-900">{data.sentiment?.positive || 0}</p>
            <p className="text-xs text-surface-400">Positive</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Minus className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-surface-900">{data.sentiment?.neutral || 0}</p>
            <p className="text-xs text-surface-400">Neutral</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <ThumbsDown className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-surface-900">{data.sentiment?.negative || 0}</p>
            <p className="text-xs text-surface-400">Negative</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-base font-semibold text-surface-900 mb-4">Rating Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={35} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {ratingData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={RATING_COLORS[entry.rating - 1]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-base font-semibold text-surface-900 mb-4">Sentiment Distribution</h3>
          <div className="h-56">
            {sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={5} dataKey="value">
                    {sentimentData.map((entry) => (
                      <Cell key={entry.name} fill={SENTIMENT_COLORS[entry.name.toLowerCase()]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400 text-sm">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100">
          <h3 className="text-base font-semibold text-surface-900">All Feedbacks ({data.feedbacks?.length || 0})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.feedbacks || []).map(fb => (
                <tr key={fb.id}>
                  <td>
                    <p className="font-medium text-surface-800">{fb.User?.name || 'Unknown'}</p>
                    <p className="text-xs text-surface-400">{fb.User?.email}</p>
                  </td>
                  <td><StarRating value={fb.rating} readonly size="sm" /></td>
                  <td><p className="text-sm text-surface-600 max-w-xs">{fb.comment || '—'}</p></td>
                  <td className="text-xs text-surface-400 whitespace-nowrap">{new Date(fb.createdAt).toLocaleDateString()}</td>
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
      </div>

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
