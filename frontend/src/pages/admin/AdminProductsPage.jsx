import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import { Plus, Pencil, Trash2, BarChart2, Package, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', description: '', imageUrl: '' });
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (query = '') => {
    try {
      const res = await API.get(`/admin/products${query ? `?q=${query}` : ''}`);
      setProducts(res.data.data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = useCallback((q) => fetchProducts(q), [fetchProducts]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: '', description: '', imageUrl: '' });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category || '',
      description: product.description || '',
      imageUrl: product.imageUrl || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/admin/products/${editing.id}`, form);
        toast.success('Product updated');
      } else {
        await API.post('/admin/products', form);
        toast.success('Product created');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/products/${deleteTarget.id}`);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Products</h1>
          <p className="text-surface-500 text-sm">{products.length} products total</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search products..."
        className="mb-6"
      />

      {products.length === 0 ? (
        <EmptyState icon={Package} title="No products" message="Add your first product to get started." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Feedbacks</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-100 overflow-hidden flex-shrink-0">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-surface-300" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">{p.name}</p>
                        <p className="text-xs text-surface-400 truncate max-w-[200px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.category ? <Badge variant="primary">{p.category}</Badge> : <span className="text-surface-300">—</span>}
                  </td>
                  <td>
                    <span className="font-medium">{p.feedbackCount || 0}</span>
                  </td>
                  <td className="text-xs text-surface-400 whitespace-nowrap">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/products/${p.id}/analysis`)}
                        className="p-2 rounded-lg hover:bg-primary-50 text-surface-400 hover:text-primary-600 transition-all"
                        title="View Analysis"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Product Name"
            placeholder="e.g. MacBook Pro"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Category"
            placeholder="e.g. Electronics"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Description</label>
            <textarea
              placeholder="Product description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input resize-none"
            />
          </div>
          <Input
            label="Image URL"
            icon={Image}
            placeholder="https://..."
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">
              {editing ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated feedbacks will also be removed. This cannot be undone.`}
      />
    </div>
  );
}
