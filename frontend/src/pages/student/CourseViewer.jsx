import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Clock, CheckCircle, BookOpen, ChevronDown, ChevronUp, FileText, Lock } from 'lucide-react';
import api from '../../api';
import { PageLoader } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';

export default function CourseViewer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/lessons/`),
        ]);
        setCourse(courseRes.data);
        const filtered = lessonsRes.data.filter(l => l.course_id === parseInt(courseId));
        setLessons(filtered);
        if (filtered.length > 0) setActiveLesson(filtered[0]);
      } catch (e) {
        console.error(e);
        // Mock data
        setCourse({ course_id: parseInt(courseId), course_title: 'Introduction to Python', description: 'Learn Python basics' });
        const mockLessons = [
          { lesson_id: 1, course_id: parseInt(courseId), title: 'Getting Started with Python', content: 'Python is a high-level programming language...', duration: 15 },
          { lesson_id: 2, course_id: parseInt(courseId), title: 'Variables and Data Types', content: 'In Python, variables are created...', duration: 20 },
          { lesson_id: 3, course_id: parseInt(courseId), title: 'Control Structures', content: 'Control structures allow you to control the flow...', duration: 25 },
        ];
        setLessons(mockLessons);
        setActiveLesson(mockLessons[0]);
      }
      finally { setLoading(false); }
    };
    fetch();
  }, [courseId]);

  const markComplete = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    toast('Lesson marked as complete!', 'success');
  };

  if (loading) return <PageLoader message="Loading course content..." />;
  if (!course) return (
    <div className="text-center py-20">
      <p className="text-[#9090b8]">Course not found.</p>
      <Link to="/student/courses" className="text-amber-400 hover:underline mt-2 block">Back to courses</Link>
    </div>
  );

  const progress = lessons.length > 0 ? Math.round((completedLessons.size / lessons.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div>
        <Link to="/student/courses" className="inline-flex items-center gap-2 text-sm text-[#9090b8] hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back to My Courses
        </Link>
        <div className="glass rounded-2xl p-5 border border-white/[0.06] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <span className="badge badge-gold mb-2">{course.level || 'Beginner'}</span>
            <h1 className="text-2xl font-display font-bold text-white">{course.course_title}</h1>
            <p className="text-sm text-[#9090b8] mt-1">{course.description}</p>
          </div>
          <div className="flex-shrink-0 text-center">
            <div className="text-3xl font-display font-bold text-amber-400">{progress}%</div>
            <div className="text-xs text-[#9090b8]">Complete</div>
            <div className="progress-track w-32 h-2 mt-2">
              <div className="progress-fill" style={{width:`${progress}%`,height:'100%'}} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video / Content area */}
        <div className="lg:col-span-2 space-y-4">
          {activeLesson ? (
            <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
              {/* Video placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-[#0d0d30] to-[#06061a] flex items-center justify-center group cursor-pointer"
                onClick={() => markComplete(activeLesson.lesson_id)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400/30 transition-all duration-300">
                    <PlayCircle size={32} className="text-amber-400" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 text-xs text-white/50">
                  Click to simulate play & mark complete
                </div>
                {completedLessons.has(activeLesson.lesson_id) && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-emerald text-emerald-400 text-xs font-semibold">
                    <CheckCircle size={12} /> Completed
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display font-semibold text-white text-xl mb-2">{activeLesson.lesson_title}</h2>
                {activeLesson.lesson_duration && (
                  <p className="text-sm text-[#9090b8] flex items-center gap-1.5 mb-4"><Clock size={13} />{activeLesson.lesson_duration} mins</p>
                )}
                <p className="text-sm text-[#9090b8] leading-relaxed">
                  {activeLesson.lesson_content || 'No additional content available for this lesson.'}
                </p>
                <div className="flex gap-3 mt-5">
                  {!completedLessons.has(activeLesson.lesson_id) && (
                    <button onClick={() => markComplete(activeLesson.lesson_id)}
                      className="btn-emerald px-5 py-2 rounded-xl text-sm flex items-center gap-2">
                      <CheckCircle size={14} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center border border-white/[0.05]">
              <BookOpen size={48} className="text-[#9090b8] mx-auto mb-4 opacity-50" />
              <p className="text-[#9090b8]">No lessons available for this course yet.</p>
            </div>
          )}
        </div>

        {/* Lesson list */}
        <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="p-4 border-b border-white/[0.05]">
            <h3 className="font-display font-semibold text-white">Curriculum</h3>
            <p className="text-xs text-[#9090b8] mt-0.5">{lessons.length} lessons · {completedLessons.size} completed</p>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-[500px] overflow-y-auto scrollbar-thin">
            {lessons.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#9090b8]">No lessons yet</div>
            ) : lessons.map((lesson, i) => {
              const isActive = activeLesson?.lesson_id === lesson.lesson_id;
              const isDone = completedLessons.has(lesson.lesson_id);
              return (
                <button key={lesson.lesson_id} onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left flex items-center gap-3 p-4 transition-all ${isActive ? 'bg-amber-400/10' : 'hover:bg-white/[0.03]'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : isActive ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' : 'bg-white/5 text-[#9090b8] border border-white/10'}`}>
                    {isDone ? <CheckCircle size={13} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-amber-300' : 'text-white/80'}`}>
                      {lesson.lesson_title}
                    </p>
                    {lesson.lesson_duration && (
                      <p className="text-xs text-[#9090b8] mt-0.5 flex items-center gap-1">
                        <Clock size={10} />{lesson.lesson_duration}m
                      </p>
                    )}
                  </div>
                  {isActive && <PlayCircle size={14} className="text-amber-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
