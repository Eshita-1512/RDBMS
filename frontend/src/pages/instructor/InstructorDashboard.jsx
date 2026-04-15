import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ClipboardCheck, TrendingUp, ArrowRight, PlusCircle, Zap, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

const GRADE_COLORS = ['#34d399', '#fbbf24', '#f87171', '#a78bfa', '#60a5fa'];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-white/10 text-xs">
        <p className="text-emerald-400 font-semibold">{label}</p>
        <p className="text-white">{payload[0].value} submissions</p>
      </div>
    );
  }
  return null;
};

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          api.get('/courses/?limit=100'),
          api.get('/submissions/'),
        ]);
        setCourses(cRes.data);
        setSubmissions(sRes.data);
      } catch (e) {
        console.error(e);
        // Mock data
        setCourses([
          { course_id: 1, course_title: 'Introduction to Python', level: 'beginner' },
          { course_id: 2, course_title: 'Advanced JavaScript', level: 'advanced' },
          { course_id: 3, course_title: 'Data Structures & Algorithms', level: 'intermediate' },
        ]);
        setSubmissions([
          { submission_id: 1, assignment_id: 1, marks: 85 },
          { submission_id: 2, assignment_id: 2, marks: null },
          { submission_id: 3, assignment_id: 3, marks: 92 },
        ]);
      }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Loading instructor dashboard..." />;

  const ungraded = submissions.filter(s => s.marks == null).length;
  const graded = submissions.filter(s => s.marks != null).length;
  const avgScore = graded > 0 ? Math.round(submissions.filter(s => s.marks != null).reduce((a, s) => a + s.marks, 0) / graded) : null;

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/instructor/courses' },
    { label: 'Submissions', value: submissions.length, icon: ClipboardCheck, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/instructor/grading' },
    { label: 'Awaiting Grade', value: ungraded, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/instructor/grading' },
    { label: 'Avg Score', value: avgScore != null ? `${avgScore}%` : '—', icon: Star, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/instructor/grading' },
  ];

  // Bar chart — submissions per assignment
  const assignmentMap = {};
  submissions.forEach(s => {
    const key = `#${s.assignment_id}`;
    assignmentMap[key] = (assignmentMap[key] || 0) + 1;
  });
  const barData = Object.entries(assignmentMap).slice(0, 8).map(([name, count]) => ({ name, count }));

  // Pie chart — grade distribution
  const gradeBuckets = { 'A (90-100)': 0, 'B (75-89)': 0, 'C (60-74)': 0, 'D (50-59)': 0, 'F (<50)': 0 };
  submissions.filter(s => s.marks != null).forEach(s => {
    if (s.marks >= 90) gradeBuckets['A (90-100)']++;
    else if (s.marks >= 75) gradeBuckets['B (75-89)']++;
    else if (s.marks >= 60) gradeBuckets['C (60-74)']++;
    else if (s.marks >= 50) gradeBuckets['D (50-59)']++;
    else gradeBuckets['F (<50)']++;
  });
  const pieData = Object.entries(gradeBuckets).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="relative rounded-3xl p-7 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(6,6,26,0.9) 100%)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-64 h-64 bg-emerald-500 -top-16 -right-16 opacity-10" />
          <div className="orb w-48 h-48 bg-teal-600 bottom-0 left-0 opacity-10" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Instructor Portal</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">Welcome, {user?.name?.split(' ')[0]} 🎓</h1>
            <p className="text-[#9090b8] text-sm">
              {ungraded > 0 ? `You have ${ungraded} submission${ungraded > 1 ? 's' : ''} awaiting grades.` : 'All submissions are graded. Great work!'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/instructor/create-course" className="btn-emerald px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <PlusCircle size={15} /> New Course
            </Link>
            <Link to="/instructor/grading" className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <ClipboardCheck size={15} /> Grade Now
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className={`stat-card border ${bg} hover:scale-[1.03] transition-all duration-200`}>
            <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center mb-3`}><Icon size={18} className={color} /></div>
            <div className="text-2xl font-display font-bold text-white">{value}</div>
            <div className="text-xs text-[#9090b8] mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Charts */}
      {submissions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions per assignment bar chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/[0.06]">
            <div className="mb-5">
              <h2 className="font-display font-semibold text-white text-lg">Submissions by Assignment</h2>
              <p className="text-xs text-[#9090b8] mt-0.5">Number of student submissions per assignment</p>
            </div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#9090b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#9090b8] text-sm">No submission data yet</div>
            )}
          </div>

          {/* Grade distribution pie chart */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06]">
            <div className="mb-5">
              <h2 className="font-display font-semibold text-white text-lg">Grade Distribution</h2>
              <p className="text-xs text-[#9090b8] mt-0.5">Breakdown of graded submissions</p>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="48%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={GRADE_COLORS[i % GRADE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#9090b8' }} />
                  <Tooltip contentStyle={{ background: 'rgba(6,6,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#9090b8] text-sm">No graded submissions yet</div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses preview */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">My Courses</h2>
            <Link to="/instructor/courses" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen size={36} className="text-[#9090b8] mx-auto mb-3 opacity-40" />
              <p className="text-sm text-[#9090b8] mb-4">No courses created yet</p>
              <Link to="/instructor/create-course" className="btn-emerald px-5 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                <PlusCircle size={14} /> Create First Course
              </Link>
            </div>
          ) : courses.slice(0, 4).map((course, i) => (
            <div key={course.course_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group mb-1">
              <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg,${['#0d4d2d', '#0d2d4d', '#4d0d2d', '#2d4d0d'][i % 4]} 0%,#06061a 100%)` }}>
                <BookOpen size={14} className="text-emerald-400/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-emerald-300 transition-colors">{course.course_title}</p>
                <p className="text-xs text-[#9090b8]">{course.level || 'All levels'}</p>
              </div>
              <span className="badge badge-emerald">{course.duration || '–'}h</span>
            </div>
          ))}
        </div>

        {/* Recent submissions */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Recent Submissions</h2>
            <Link to="/instructor/grading" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">Grade <ArrowRight size={12} /></Link>
          </div>
          {submissions.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardCheck size={36} className="text-[#9090b8] mx-auto mb-3 opacity-40" />
              <p className="text-sm text-[#9090b8]">No submissions yet</p>
            </div>
          ) : submissions.slice(0, 5).map(sub => (
            <div key={`${sub.assignment_id}-${sub.user_id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-all mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {sub.user_id}
                </div>
                <div>
                  <p className="text-sm text-white">Assignment #{sub.assignment_id}</p>
                  <p className="text-xs text-[#9090b8]">Student #{sub.user_id}</p>
                </div>
              </div>
              {sub.marks != null
                ? <span className={`badge ${sub.marks >= 75 ? 'badge-emerald' : sub.marks >= 50 ? 'badge-gold' : 'badge-rose'}`}>{sub.marks}/100</span>
                : <span className="badge badge-gold">Ungraded</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
