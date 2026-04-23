import { useState, useEffect, useCallback } from 'react';
import API from '../../services/api';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { PageLoader } from '../../components/ui/Spinner';
import { Pencil, Trash2, Users, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  const fetchUsers = useCallback(async (q = '') => {
    try {
      const res = await API.get(`/admin/users${q ? `?q=${q}` : ''}`);
      setUsers(res.data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = useCallback((q) => fetchUsers(q), [fetchUsers]);

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/admin/users/${editUser.id}`, form);
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/users/${deleteTarget.id}`);
      toast.success('User deleted');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Users</h1>
        <p className="text-surface-500 text-sm">{users.length} registered users</p>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search by name or email..." className="mb-6" />

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users" message="Users will appear here once they register." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Feedbacks</th>
                <th>Registered</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary-700">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-surface-900">{u.name}</p>
                        <p className="text-xs text-surface-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={u.role === 'admin' ? 'warning' : 'primary'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="font-medium">{u.feedbackCount || 0}</td>
                  <td className="text-xs text-surface-400 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-all"
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

      {/* Edit User Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" icon={Mail} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">Role</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Update User</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All their feedbacks will also be removed.`}
      />
    </div>
  );
}
