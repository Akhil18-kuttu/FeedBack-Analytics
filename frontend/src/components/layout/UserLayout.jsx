import { useContext } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, LogOut, BarChart3, User } from 'lucide-react';

export default function UserLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Products', icon: LayoutDashboard },
    { to: '/my-feedbacks', label: 'My Feedbacks', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-surface-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-900">
                Feed<span className="text-primary-600">Back</span>
              </span>
            </Link>

            {/* Nav Links */}
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-surface-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="sm:hidden border-t border-surface-100 px-4 py-2 flex gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-500 hover:bg-surface-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
