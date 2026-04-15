import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlayCircle, TrendingUp, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import api from '../../api';
import { PageLoader } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [enrRes, cRes] = await Promise.all([api.get('/enrollments/me'), api.get('/courses/?limit=100')]);
        setEnrollments(enrRes.data);
        const cMap = {};
        cRes.data.forEach(c => { cMap[c.course_id] = c; });
        setCourses(cMap);
      } catch (e) {
        console.error(e);
        // Mock data
        const mockEnrollments = [
          { course_id: 1, progress: 75, enrollment_date: '2024-01-15' },
          { course_id: 3, progress: 30, enrollment_date: '2024-02-01' },
        ];
        setEnrollments(mockEnrollments);
        const mockCourses = {
          1: { course_id: 1, course_title: 'Introduction to Python', description: 'Learn Python basics', duration: 10 },
          3: { course_id: 3, course_title: 'Data Structures & Algorithms', description: 'Essential algorithms', duration: 20 },
        };
        setCourses(mockCourses);
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <PageLoader message="Loading your courses..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Courses</h1>
          <p className="text-[#9090b8] text-sm mt-1">{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <Link to="/courses" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>Browse More</span><ArrowRight size={14} className="relative z-10" />
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <BookOpen size={56} className="text-amber-400/40 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No courses yet</h2>
          <p className="text-[#9090b8] mb-8 max-w-sm mx-auto">Start your learning journey by exploring our catalog</p>
          <Link to="/courses" className="btn-gold px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
            <span>Explore Courses</span><ArrowRight size={16} className="relative z-10" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {enrollments.map((enr, i) => {
            const course = courses[enr.course_id];
            const prog = enr.progress || 0;
            return (
              <div key={enr.course_id} className="card p-5 animate-fade-up opacity-0"
                style={{animationDelay:`${i*60}ms`,animationFillMode:'forwards'}}>
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-white text-base leading-snug mb-1 line-clamp-1">
                      {course?.course_title || `Course #${enr.course_id}`}
                    </h3>
                    <p className="text-xs text-[#9090b8] line-clamp-1 mb-3">
                      {course?.description || 'No description available'}
                    </p>
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="progress-track flex-1 h-2">
                        <div className="progress-fill" style={{width:`${prog}%`,height:'100%'}} />
                      </div>
                      <span className="text-xs font-semibold text-amber-400 w-10 text-right">{prog}%</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      {prog === 100
                        ? <span className="badge badge-emerald">Completed</span>
                        : prog > 0
                        ? <span className="badge badge-gold">In Progress</span>
                        : <span className="badge badge-blue">Not Started</span>
                      }
                      {course?.duration && (
                        <span className="text-xs text-[#9090b8] flex items-center gap-1"><Clock size={11} />{course.duration}h</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex gap-3">
                  <Link to={`/student/course/${enr.course_id}`}
                    className="btn-gold flex-1 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5">
                    <PlayCircle size={14} className="relative z-10" />
                    <span>{prog > 0 ? 'Continue' : 'Start Learning'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
