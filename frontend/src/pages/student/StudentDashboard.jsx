import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, ClipboardList, TrendingUp, Clock, ArrowRight, Zap, Target } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/LoadingSpinner';

// Custom tooltip for area chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass rounded-lg px-3 py-2 border border-white/10 text-xs">
        <p className="text-amber-400 font-semibold">{label}</p>
        <p className="text-white">{payload[0].value}% progress</p>
      </div>
    );
  }
  return null;
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [enrRes, asgRes, subRes, certRes, coursesRes] = await Promise.all([
          api.get('/enrollments/me'),
          api.get('/assignments/'),
          api.get('/submissions/me'),
          api.get('/certificates/me'),
          api.get('/courses/?limit=100'),
        ]);
        setEnrollments(enrRes.data);
        setAssignments(asgRes.data);
        setSubmissions(subRes.data);
        setCerts(certRes.data);
        const cMap = {};
        coursesRes.data.forEach(c => { cMap[c.course_id] = c; });
        setCourses(cMap);
      } catch (e) {
        console.error(e);
        // Mock data
        const mockEnrollments = [
          { course_id: 1, progress: 75 },
          { course_id: 3, progress: 30 },
          { course_id: 4, progress: 100 },
        ];
        setEnrollments(mockEnrollments);
        setAssignments([
          { assignment_id: 1, title: 'Python Basics Quiz', course_id: 1, due_date: '2024-12-01' },
          { assignment_id: 2, title: 'Algorithm Implementation', course_id: 3, due_date: '2024-12-15' },
        ]);
        setSubmissions([
          { assignment_id: 1, submission_date: '2024-11-25', marks: 85 },
        ]);
        setCerts([
          { certificate_id: 1, course_id: 4, issued_date: '2024-11-20' },
        ]);
        const mockCourses = {
          1: { course_id: 1, course_title: 'Introduction to Python' },
          3: { course_id: 3, course_title: 'Data Structures & Algorithms' },
          4: { course_id: 4, course_title: 'Web Development with React' },
        };
        setCourses(mockCourses);
      }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Loading dashboard..." />;

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const pendingAssignments = assignments.filter(a => !submissions.find(s => s.assignment_id === a.assignment_id)).length;

  const stats = [
    { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', link: '/student/courses' },
    { label: 'Avg. Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', link: '/student/courses' },
    { label: 'Pending Assignments', value: pendingAssignments, icon: ClipboardList, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20', link: '/student/assignments' },
    { label: 'Certificates', value: certs.length, icon: Award, color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20', link: '/student/certificates' },
  ];

  // Chart data — progress per enrolled course
  const progressChartData = enrollments.slice(0, 6).map((enr, i) => ({
    name: courses[enr.course_id]?.course_title?.split(' ').slice(0, 2).join(' ') || `Course ${i + 1}`,
    progress: enr.progress || 0,
  }));

  // Radial gauge for overall progress
  const radialData = [{ name: 'Progress', value: avgProgress, fill: '#fbbf24' }];

  const recentEnrollments = enrollments.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="relative glass rounded-3xl p-7 overflow-hidden border border-amber-400/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-64 h-64 bg-amber-500 -top-16 -right-16 opacity-10" />
          <div className="orb w-48 h-48 bg-violet-600 bottom-0 left-0 opacity-10" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Welcome back!</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-[#9090b8] text-sm">
              {enrollments.length === 0
                ? "You haven't enrolled in any courses yet. Let's get started!"
                : `You're making great progress! Keep going. ${pendingAssignments > 0 ? `${pendingAssignments} assignment${pendingAssignments > 1 ? 's' : ''} pending.` : ''}`}
            </p>
          </div>
          <Link to="/courses" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 flex-shrink-0">
            <span>{enrollments.length === 0 ? 'Browse Courses' : 'Explore More'}</span>
            <ArrowRight size={14} className="relative z-10" />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, link }) => (
          <Link key={label} to={link} className={`stat-card border ${bg} hover:scale-[1.03] transition-all duration-200`}>
            <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="text-2xl font-display font-bold text-white">{value}</div>
            <div className="text-xs text-[#9090b8] mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Progress Area Chart */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/[0.06]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-semibold text-white text-lg">Course Progress</h2>
                <p className="text-xs text-[#9090b8] mt-0.5">Completion % per enrolled course</p>
              </div>
              <span className="badge badge-gold">{enrollments.length} enrolled</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#9090b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9090b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="progress" stroke="#fbbf24" strokeWidth={2} fill="url(#progGrad)" dot={{ fill: '#fbbf24', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fbbf24' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Overall progress radial gauge */}
          <div className="glass rounded-2xl p-6 border border-white/[0.06] flex flex-col items-center justify-center">
            <h2 className="font-display font-semibold text-white text-lg mb-1 self-start">Overall</h2>
            <p className="text-xs text-[#9090b8] mb-4 self-start">Average completion rate</p>
            <div className="relative">
              <ResponsiveContainer width={160} height={160}>
                <RadialBarChart
                  innerRadius="70%" outerRadius="90%"
                  data={radialData} startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: 'rgba(255,255,255,0.04)' }} dataKey="value" angleAxisId={0} cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-display font-bold text-amber-400">{avgProgress}%</div>
                <div className="text-xs text-[#9090b8]">complete</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-[#9090b8]">{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent courses */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Continue Learning</h2>
            <Link to="/student/courses" className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentEnrollments.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen size={36} className="text-[#9090b8] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[#9090b8]">No courses yet. <Link to="/courses" className="text-amber-400 hover:underline">Browse courses</Link></p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnrollments.map(enr => {
                const course = courses[enr.course_id];
                const prog = enr.progress || 0;
                return (
                  <Link key={enr.course_id} to="/student/courses"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-amber-300 transition-colors">
                        {course?.course_title || `Course #${enr.course_id}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="progress-track flex-1 h-1.5">
                          <div className="progress-fill" style={{ width: `${prog}%`, height: '100%' }} />
                        </div>
                        <span className="text-xs text-[#9090b8] w-8 text-right">{prog}%</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-[#9090b8] group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming assignments */}
        <div className="glass rounded-2xl p-6 border border-white/[0.06]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Due Assignments</h2>
            <Link to="/student/assignments" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {assignments.length === 0 ? (
            <div className="text-center py-10">
              <ClipboardList size={36} className="text-[#9090b8] mx-auto mb-3 opacity-50" />
              <p className="text-sm text-[#9090b8]">No assignments available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 4).map(a => {
                const submitted = submissions.find(s => s.assignment_id === a.assignment_id);
                return (
                  <div key={a.assignment_id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${submitted ? 'bg-emerald-400' : 'bg-violet-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{a.title}</p>
                      {a.due_date && (
                        <p className="text-xs text-[#9090b8] mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> Due {new Date(a.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {submitted
                      ? <span className="badge badge-emerald text-[10px]">Done</span>
                      : <span className="badge badge-violet text-[10px]">Due</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
