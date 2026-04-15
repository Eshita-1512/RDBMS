import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import CourseCard from '../../components/CourseCard';
import { PageLoader } from '../../components/LoadingSpinner';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [coursesRes] = await Promise.all([api.get('/courses/?limit=100')]);
        setCourses(coursesRes.data);
        if (user) {
          const enrRes = await api.get('/enrollments/me');
          setEnrolledIds(new Set(enrRes.data.map(e => e.course_id)));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  const handleEnroll = async (courseId) => {
    if (!user) { toast('Please sign in to enroll', 'warning'); return; }
    try {
      await api.post('/enrollments/', { user_id: user.user_id, course_id: courseId });
      setEnrolledIds(prev => new Set([...prev, courseId]));
      toast('Successfully enrolled! Check your dashboard.', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Enrollment failed', 'error');
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.course_title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === 'All' || c.level?.toLowerCase() === level.toLowerCase();
    return matchSearch && matchLevel;
  });

  if (loading) return <PageLoader message="Loading courses..." />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <span className="badge badge-violet mb-4">Course Catalog</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explore <span className="text-gradient-gold">All Courses</span>
          </h1>
          <p className="text-[#9090b8] max-w-xl mx-auto">
            {courses.length} courses across multiple disciplines. Find yours.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="glass rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3 animate-fade-up delay-100">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics..." className="input-field pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#9090b8]" />
            <div className="flex gap-2">
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${level === l ? 'bg-amber-400/15 text-amber-400 border border-amber-400/25' : 'btn-ghost text-xs'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="text-[#9090b8] mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl text-white mb-2">No courses found</h3>
            <p className="text-[#9090b8] text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#9090b8] mb-6">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course, i) => (
                <div key={course.course_id} className="animate-fade-up opacity-0" style={{animationDelay:`${Math.min(i,8)*50}ms`,animationFillMode:'forwards'}}>
                  <CourseCard
                    course={course} index={i}
                    showEnroll={true}
                    enrolled={enrolledIds.has(course.course_id)}
                    onEnroll={handleEnroll}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
