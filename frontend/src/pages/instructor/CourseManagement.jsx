import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Edit3, Trash2, Clock, Tag, Eye, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

const levelColors = { beginner: 'badge-emerald', intermediate: 'badge-gold', advanced: 'badge-rose' };

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await api.get('/courses/?limit=100');
        setCourses(r.data);
      } catch (e) {
        console.error(e);
        // Mock data
        setCourses([
          { course_id: 1, course_title: 'Introduction to Python', description: 'Learn Python basics', level: 'beginner', duration: 10, created_at: '2024-01-01' },
          { course_id: 2, course_title: 'Advanced JavaScript', description: 'Master JS', level: 'advanced', duration: 15, created_at: '2024-02-01' },
          { course_id: 3, course_title: 'Data Structures & Algorithms', description: 'Essential algorithms', level: 'intermediate', duration: 20, created_at: '2024-03-01' },
        ]);
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.course_id !== id));
      toast('Course deleted successfully', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  const filtered = courses.filter(c => c.course_title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageLoader message="Loading courses..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Course Management</h1>
          <p className="text-[#9090b8] text-sm mt-1">{courses.length} total course{courses.length !== 1?'s':''}</p>
        </div>
        <Link to="/instructor/create-course" className="btn-emerald px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <PlusCircle size={15} /> Create New Course
        </Link>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <Eye size={15} className="text-[#9090b8]" />
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search your courses..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#9090b8]/50" />
        {search && <button onClick={()=>setSearch('')} className="text-xs text-[#9090b8] hover:text-white">Clear</button>}
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <BookOpen size={56} className="text-emerald-400/30 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            {courses.length === 0 ? 'No courses created yet' : 'No results'}
          </h2>
          <p className="text-[#9090b8] mb-8">{courses.length === 0 ? 'Create your first course to start teaching.' : 'Try a different search term.'}</p>
          {courses.length === 0 && (
            <Link to="/instructor/create-course" className="btn-emerald px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              <PlusCircle size={16} /> Create First Course
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Table for md+ */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden border border-white/[0.06]">
            <table className="w-full">
              <thead>
                <tr style={{borderBottom:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.02)'}}>
                  {['#','Course Title','Level','Duration','Category','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#9090b8] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((course, i) => (
                  <tr key={course.course_id} className="hover:bg-white/[0.03] transition-colors group animate-fade-up opacity-0"
                    style={{animationDelay:`${Math.min(i,10)*30}ms`,animationFillMode:'forwards'}}>
                    <td className="px-5 py-4 text-xs text-[#9090b8] font-mono">{course.course_id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600/30 to-teal-600/30 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={13} className="text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors line-clamp-1">{course.course_title}</p>
                          {course.description && <p className="text-xs text-[#9090b8] line-clamp-1 max-w-xs">{course.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${levelColors[course.level?.toLowerCase()] || 'badge-blue'}`}>{course.level || 'N/A'}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#9090b8]">
                      {course.duration ? <span className="flex items-center gap-1"><Clock size={12}/>{course.duration}h</span> : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#9090b8]">
                      {course.category_id ? <span className="badge badge-blue">Cat {course.category_id}</span> : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/instructor/edit-course/${course.course_id}`}
                          className="p-2 rounded-lg hover:bg-emerald-400/10 text-[#9090b8] hover:text-emerald-400 transition-all" title="Edit">
                          <Edit3 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(course.course_id)}
                          className="p-2 rounded-lg hover:bg-rose-400/10 text-[#9090b8] hover:text-rose-400 transition-all" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map((course, i) => (
              <div key={course.course_id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${levelColors[course.level?.toLowerCase()]||'badge-blue'}`}>{course.level||'N/A'}</span>
                      <span className="text-xs text-[#9090b8] font-mono">#{course.course_id}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{course.course_title}</h3>
                    {course.duration && <p className="text-xs text-[#9090b8] mt-1 flex items-center gap-1"><Clock size={10}/>{course.duration}h</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link to={`/instructor/edit-course/${course.course_id}`} className="p-2 rounded-lg hover:bg-emerald-400/10 text-[#9090b8] hover:text-emerald-400 transition-all"><Edit3 size={14}/></Link>
                    <button onClick={() => handleDelete(course.course_id)} className="p-2 rounded-lg hover:bg-rose-400/10 text-[#9090b8] hover:text-rose-400 transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
