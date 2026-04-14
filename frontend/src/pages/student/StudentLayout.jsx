import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlayCircle, ClipboardList, Award, LogOut, GraduationCap, User, ChevronRight, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/student/certificates', icon: Award, label: 'Certificates' },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0 glass border-r border-white/[0.05] flex flex-col z-40 hidden lg:flex">
        {/* User card */}
        <div className="p-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#06061a] font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="text-xs text-amber-400 font-mono">Student</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#9090b8]/60 px-2 mb-3 font-semibold">Learning</p>
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={16} />
              {label}
              <ChevronRight size={12} className="ml-auto opacity-30" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/[0.05]">
          <button onClick={handleLogout} className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/10">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-full">
        {/* Top bar */}
        <div className="sticky top-16 z-30 glass border-b border-white/[0.05] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#9090b8]">
            <GraduationCap size={14} className="text-amber-400" />
            <span>Student Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center">
              <Bell size={15} />
            </button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#06061a] font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
