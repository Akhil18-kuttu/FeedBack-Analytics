import { useState, useEffect } from 'react';
import API from '../../services/api';
import { PageLoader } from '../../components/ui/Spinner';
import StarRating from '../../components/ui/StarRating';
import { Package, Users, MessageSquare, Star, TrendingUp, Calendar } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#6366f1'];
const PIE_COLORS = ['#ef4444', '#f97316', '#fbbf24', '#34d399', '#6366f1'];

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await API.get('/admin/analysis/overview');
        setData(res.data.data);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return null;

  const kpis = [
    { label: 'Total Products', value: data.totalProducts, icon: Package, color: 'bg-primary-50 text-primary-600', iconBg: 'bg-primary-100' },
    { label: 'Total Users', value: data.totalUsers, icon: Users, color: 'bg-emerald-50 text-emerald-600', iconBg: 'bg-emerald-100' },
    { label: 'Total Feedbacks', value: data.totalFeedbacks, icon: MessageSquare, color: 'bg-amber-50 text-amber-600', iconBg: 'bg-amber-100' },
    { label: 'Average Rating', value: `${data.avgRating} ★`, icon: Star, color: 'bg-violet-50 text-violet-600', iconBg: 'bg-violet-100' },
  ];

  const barData = (data.feedbackPerProduct || []).map(item => ({
    name: item.Product?.name || 'Unknown',
    count: parseInt(item.dataValues?.count || item.count || 0)
  })).slice(0, 8);

  const pieData = (data.ratingDistribution || []).map(item => ({
    name: `${item.rating}★`,
    value: parseInt(item.dataValues?.count || item.count || 0),
    rating: item.rating
  }));

  const lineData = (data.feedbackTimeline || []).map(item => ({
    date: new Date(item.dataValues?.date || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: parseInt(item.dataValues?.count || item.count || 0)
  }));

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 mt-1">Overview of your feedback analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="kpi-card animate-slide-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <div className={`kpi-icon ${kpi.iconBg}`}>
                <Icon className={`w-6 h-6 ${kpi.color.split(' ')[1]}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-900">{kpi.value}</p>
                <p className="text-sm text-surface-500">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart — Feedback per Product */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-surface-900 mb-1">Feedback per Product</h3>
          <p className="text-xs text-surface-400 mb-4">Number of feedbacks received by each product</p>
          <div className="h-72">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400 text-sm">No data available</div>
            )}
          </div>
        </div>

        {/* Pie Chart — Rating Distribution */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-surface-900 mb-1">Rating Distribution</h3>
          <p className="text-xs text-surface-400 mb-4">Breakdown of ratings from 1★ to 5★</p>
          <div className="h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.rating - 1] || PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-surface-400 text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Line Chart — Timeline */}
      <div className="card p-6 mb-8">
        <h3 className="text-base font-semibold text-surface-900 mb-1">Feedback Timeline</h3>
        <p className="text-xs text-surface-400 mb-4">Feedbacks submitted over the last 30 days</p>
        <div className="h-64">
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-surface-400 text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Recent Feedbacks */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100">
          <h3 className="text-base font-semibold text-surface-900">Recent Feedbacks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentFeedbacks || []).map(fb => (
                <tr key={fb.id}>
                  <td>
                    <div>
                      <p className="font-medium text-surface-800">{fb.User?.name || 'Unknown'}</p>
                      <p className="text-xs text-surface-400">{fb.User?.email}</p>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">{fb.Product?.name}</span>
                  </td>
                  <td>
                    <StarRating value={fb.rating} readonly size="sm" />
                  </td>
                  <td>
                    <p className="text-sm text-surface-600 max-w-xs truncate">{fb.comment || '—'}</p>
                  </td>
                  <td className="text-xs text-surface-400 whitespace-nowrap">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
