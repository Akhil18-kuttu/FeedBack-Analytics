import { useState, useEffect } from 'react';
import API from '../../services/api';
import StarRating from '../../components/ui/StarRating';
import { PageLoader } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { MessageSquare, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await API.get('/feedbacks/my');
        setFeedbacks(res.data.data);
      } catch {
        toast.error('Failed to load your feedbacks');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">My Feedbacks</h1>
        <p className="text-surface-500 mt-1">
          {feedbacks.length > 0
            ? `You have submitted ${feedbacks.length} review${feedbacks.length > 1 ? 's' : ''}`
            : 'Your submitted reviews will appear here'
          }
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No feedbacks yet"
          message="Start by browsing products and submitting your first review."
        />
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb, i) => (
            <div
              key={fb.id}
              className="card p-5 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="w-full sm:w-20 h-32 sm:h-20 rounded-xl bg-surface-100 overflow-hidden flex-shrink-0">
                  {fb.Product?.imageUrl ? (
                    <img
                      src={fb.Product.imageUrl}
                      alt={fb.Product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-surface-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-surface-900">{fb.Product?.name || 'Unknown Product'}</h3>
                      {fb.Product?.category && (
                        <span className="badge-primary mt-1 inline-block text-xs">{fb.Product.category}</span>
                      )}
                    </div>
                    <StarRating value={fb.rating} readonly size="sm" />
                  </div>

                  {fb.comment && (
                    <p className="text-sm text-surface-600 mt-2 leading-relaxed">"{fb.comment}"</p>
                  )}

                  <div className="flex items-center gap-1.5 mt-3 text-xs text-surface-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(fb.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
