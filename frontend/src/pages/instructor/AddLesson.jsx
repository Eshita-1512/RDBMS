import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Clock, AlignLeft, Hash } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddLesson() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ course_id: '', lesson_title: '', lesson_content: '', lesson_duration: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get('/courses/?limit=100').then(r => setCourses(r.data)).catch(() => {});
  }, []);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.course_id) e.course_id = 'Select a course';
    if (!form.lesson_title.trim()) e.lesson_title = 'Lesson title is required';
    if (form.lesson_duration && (isNaN(form.lesson_duration) || parseInt(form.lesson_duration) < 1)) e.lesson_duration = 'Must be a positive number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/lessons/', {
        course_id: parseInt(form.course_id),
        lesson_title: form.lesson_title.trim(),
        lesson_content: form.lesson_content.trim() || null,
        lesson_duration: form.lesson_duration ? parseInt(form.lesson_duration) : null,
      });
      toast('Lesson added successfully!', 'success');
      navigate('/instructor/courses');
    } catch (err) {
      toast(err.response?.data?.detail || 'Failed to add lesson', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/instructor/courses" className="inline-flex items-center gap-2 text-sm text-[#9090b8] hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <h1 className="text-3xl font-display font-bold text-white">Add Lesson</h1>
        <p className="text-[#9090b8] text-sm mt-1">Add a new lesson to one of your courses.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/[0.06] space-y-5">
        {/* Course selector */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Course *</label>
          <div className="relative">
            <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <select value={form.course_id} onChange={e => set('course_id', e.target.value)}
              className={`input-field pl-10 ${errors.course_id ? 'error' : ''}`}
              style={{appearance:'none'}}>
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_title}</option>)}
            </select>
          </div>
          {errors.course_id && <p className="text-xs text-rose-400 mt-1.5">{errors.course_id}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Lesson Title *</label>
          <div className="relative">
            <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="text" value={form.lesson_title} onChange={e => set('lesson_title', e.target.value)}
              placeholder="e.g. Introduction to Variables" className={`input-field pl-10 ${errors.lesson_title ? 'error' : ''}`} />
          </div>
          {errors.lesson_title && <p className="text-xs text-rose-400 mt-1.5">{errors.lesson_title}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Lesson Content</label>
          <textarea value={form.lesson_content} onChange={e => set('lesson_content', e.target.value)}
            placeholder="Lesson notes, key concepts, or video description..." rows={5}
            className="input-field resize-none" />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Duration (minutes)</label>
          <div className="relative">
            <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="number" min="1" value={form.lesson_duration} onChange={e => set('lesson_duration', e.target.value)}
              placeholder="e.g. 15" className={`input-field pl-10 ${errors.lesson_duration ? 'error' : ''}`} />
          </div>
          {errors.lesson_duration && <p className="text-xs text-rose-400 mt-1.5">{errors.lesson_duration}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Link to="/instructor/courses" className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold text-center">Cancel</Link>
          <button type="submit" disabled={loading}
            className="btn-emerald flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm" /> : <><Save size={15} />Add Lesson</>}
          </button>
        </div>
      </form>
    </div>
  );
}
