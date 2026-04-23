import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Users, MessageSquare, LogOut,
  BarChart3, Menu, X, ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-100">
        <Link to="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-surface-900">
              Feed<span className="text-primary-600">Back</span>
            </span>
            <p className="text-[10px] text-surface-400 font-medium -mt-0.5">ADMIN PANEL</p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(link => {
          const Icon = link.icon;
          const active = isActive(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-700">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-800 truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-surface-200 fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-white flex flex-col shadow-2xl animate-slide-down">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-surface-100"
            >
              <X className="w-5 h-5 text-surface-500" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-surface-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-surface-100">
            <Menu className="w-5 h-5 text-surface-600" />
          </button>
          <span className="text-base font-bold text-surface-900">
            Feed<span className="text-primary-600">Back</span>
          </span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
