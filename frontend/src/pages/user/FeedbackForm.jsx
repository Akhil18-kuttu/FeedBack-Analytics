import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/ui/StarRating';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Spinner';
import { ArrowLeft, Package, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedbackForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${productId}`);
        const data = res.data.data;
        if (data.userHasSubmitted) {
          toast.error('You have already submitted feedback for this product');
          navigate('/dashboard');
          return;
        }
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await API.post('/feedbacks', {
        productId: parseInt(productId),
        rating,
        comment
      });
      toast.success('Feedback submitted successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Product Info */}
      <div className="card mb-6">
        <div className="flex gap-4 p-6">
          <div className="w-20 h-20 rounded-xl bg-surface-100 overflow-hidden flex-shrink-0">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-surface-300" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">{product.name}</h2>
            {product.category && (
              <span className="badge-primary mt-1 inline-block">{product.category}</span>
            )}
            <p className="text-sm text-surface-500 mt-2">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-6">Share Your Feedback</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">
              How would you rate this product?
            </label>
            <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-xl">
              <StarRating value={rating} onChange={setRating} size="xl" showLabel />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Your Review <span className="text-surface-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              rows={5}
              className="input resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting} className="flex-1">
              <Send className="w-4 h-4" /> Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
