import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import SearchBar from '../../components/ui/SearchBar';
import StarRating from '../../components/ui/StarRating';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { MessageSquare, Package, Star, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (query = '') => {
    try {
      const res = await API.get(`/products${query ? `?q=${query}` : ''}`);
      setProducts(res.data.data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback((query) => {
    fetchProducts(query);
  }, [fetchProducts]);

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900">Products</h1>
        <p className="text-surface-500 mt-1">Browse products and share your feedback</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search products by name or category..."
          className="flex-1"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          message="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <div
              key={product.id}
              className="card-hover group animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
            >
              {/* Image */}
              <div className="relative h-44 bg-surface-100 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-surface-300" />
                  </div>
                )}
                {product.category && (
                  <span className="absolute top-3 left-3 badge-primary text-xs">
                    {product.category}
                  </span>
                )}
                {product.userHasSubmitted && (
                  <span className="absolute top-3 right-3 badge-success text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Reviewed
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-surface-900 mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-surface-500 line-clamp-2 mb-3 min-h-[2rem]">
                  {product.description || 'No description available'}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {product.avgRating ? (
                      <>
                        <StarRating value={Math.round(parseFloat(product.avgRating))} readonly size="sm" />
                        <span className="text-xs text-surface-500 font-medium">{product.avgRating}</span>
                      </>
                    ) : (
                      <span className="text-xs text-surface-400">No ratings yet</span>
                    )}
                  </div>
                  <span className="text-xs text-surface-400 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {product.feedbackCount}
                  </span>
                </div>

                {/* Action */}
                <Button
                  variant={product.userHasSubmitted ? 'secondary' : 'primary'}
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/feedback/${product.id}`)}
                  disabled={product.userHasSubmitted}
                >
                  {product.userHasSubmitted ? 'Already Reviewed' : 'Submit Feedback'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
