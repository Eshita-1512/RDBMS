import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, User, LayoutDashboard, BookOpen, Menu, X, Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const dashboardPath = user?.role_id === 2 ? '/instructor' : '/student';
  const isActive = (path) => location.pathname.startsWith(path);
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled || !isLanding
        ? 'glass border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300 group-hover:scale-110">
            <GraduationCap size={17} className="text-[#06061a]" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[1.15rem] text-white tracking-tight">
            Skill<span className="text-gradient-gold">Bridge</span>
          </span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/courses" className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${isActive('/courses') ? 'text-amber-400 bg-amber-400/10' : 'text-[#9090b8] hover:text-white hover:bg-white/[0.05]'}`}>
            <BookOpen size={14} /> Explore Courses
          </Link>
          {user && (
            <Link to={dashboardPath} className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${isActive(dashboardPath) ? (user.role_id === 2 ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10') : 'text-[#9090b8] hover:text-white hover:bg-white/[0.05]'}`}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center" title="Notifications">
                <Bell size={15} />
              </button>
              <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass border ${user.role_id === 2 ? 'border-emerald-500/20' : 'border-amber-400/20'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.role_id === 2 ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white' : 'bg-gradient-to-br from-amber-400 to-amber-600 text-[#06061a]'}`}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-white truncate max-w-[100px]">{user.name}</div>
                  <div className={`text-[10px] font-mono ${user.role_id === 2 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {user.role_id === 2 ? 'Instructor' : 'Student'}
                  </div>
                </div>
              </div>
              <button onClick={handleLogout} title="Logout" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#9090b8] hover:text-rose-400 hover:bg-rose-400/10 transition-all duration-200">
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-lg text-sm btn-ghost font-medium">Sign In</Link>
              <Link to="/register" className="px-4 py-2 rounded-xl text-sm btn-gold font-semibold">
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden btn-ghost p-2 rounded-lg" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/[0.06] px-5 py-4 space-y-2 animate-fade-in">
          <Link to="/courses" className="sidebar-link" onClick={() => setMenuOpen(false)}>
            <BookOpen size={16} /> Explore Courses
          </Link>
          {user && (
            <Link to={dashboardPath} className="sidebar-link" onClick={() => setMenuOpen(false)}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={handleLogout} className="sidebar-link w-full text-rose-400">
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" className="btn-ghost text-sm py-2.5 px-4 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn-gold text-sm py-2.5 px-4 rounded-lg text-center" onClick={() => setMenuOpen(false)}><span>Get Started</span></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
