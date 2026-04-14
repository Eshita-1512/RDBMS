import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ClipboardCheck, Users, PlusCircle, LogOut, GraduationCap, Bell, ChevronRight, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/instructor', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/instructor/create-course', icon: PlusCircle, label: 'Create Course' },
  { to: '/instructor/grading', icon: ClipboardCheck, label: 'Grading Portal' },
  { to: '/instructor/students', icon: Users, label: 'Students' },
];

export default function InstructorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 fixed left-0 top-16 bottom-0 flex flex-col z-40 hidden lg:flex"
        style={{background:'rgba(6,6,26,0.95)',backdropFilter:'blur(20px)',borderRight:'1px solid rgba(16,185,129,0.1)'}}>
        {/* Instructor badge */}
        <div className="p-5 border-b border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'I'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
              <div className="text-xs text-emerald-400 font-mono">Instructor</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[#9090b8]/50 px-2 mb-3 font-semibold">Teaching</p>
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active-emerald' : ''}`}>
              <Icon size={16} />{label}
              <ChevronRight size={12} className="ml-auto opacity-30" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-500/10">
          <button onClick={handleLogout} className="sidebar-link w-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-400/10">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-h-full">
        <div className="sticky top-16 z-30 px-6 py-3 flex items-center justify-between"
          style={{background:'rgba(6,6,26,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(16,185,129,0.08)'}}>
          <div className="flex items-center gap-2 text-sm text-[#9090b8]">
            <GraduationCap size={14} className="text-emerald-400" />
            <span>Instructor Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center"><Bell size={15} /></button>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  );
}
