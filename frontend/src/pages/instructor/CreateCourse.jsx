import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Save, AlertCircle, Clock, Tag, AlignLeft, Layers } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCourse() {
  const { courseId } = useParams(); // present when editing
  const isEdit = Boolean(courseId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [form, setForm] = useState({
    course_title: '', description: '', duration: '',
    category_id: '', level: 'Beginner',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(isEdit);
  const [categories, setCategories] = useState([]);

  // Fetch categories for the dropdown
  useEffect(() => {
    api.get('/categories/?limit=100').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/${courseId}`)
      .then(r => {
        const c = r.data;
        setForm({
          course_title: c.course_title || '',
          description: c.description || '',
          duration: c.duration?.toString() || '',
          category_id: c.category_id?.toString() || '',
          level: c.level || 'Beginner',
        });
      })
      .catch(() => toast('Failed to load course', 'error'))
      .finally(() => setFetchingCourse(false));
  }, [courseId]);

  const validate = () => {
    const e = {};
    if (!form.course_title.trim()) e.course_title = 'Course title is required';
    else if (form.course_title.trim().length < 5) e.course_title = 'Title must be at least 5 characters';
    if (form.duration && (isNaN(form.duration) || parseInt(form.duration) < 1)) e.duration = 'Duration must be a positive number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setErrors(p => ({ ...p, [field]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      course_title: form.course_title.trim(),
      description: form.description.trim() || null,
      duration: form.duration ? parseInt(form.duration) : null,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      instructor_id: user?.user_id || null,
      level: form.level,
    };
    try {
      if (isEdit) {
        await api.put(`/courses/${courseId}`, payload);
        toast('Course updated successfully!', 'success');
      } else {
        await api.post('/courses/', payload);
        toast('Course created successfully!', 'success');
      }
      navigate('/instructor/courses');
    } catch (err) {
      toast(err.response?.data?.detail || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingCourse) return <div className="flex items-center justify-center py-20"><LoadingSpinner size="lg" message="Loading course..." /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/instructor/courses" className="inline-flex items-center gap-2 text-sm text-[#9090b8] hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back to Courses
        </Link>
        <h1 className="text-3xl font-display font-bold text-white">
          {isEdit ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-[#9090b8] text-sm mt-1">
          {isEdit ? 'Update your course details below.' : 'Fill in the details to publish a new course.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/[0.06] space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Course Title *</label>
          <div className="relative">
            <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="text" value={form.course_title} onChange={e => set('course_title', e.target.value)}
              placeholder="e.g. Complete Python Bootcamp" className={`input-field pl-10 ${errors.course_title ? 'error' : ''}`} />
          </div>
          {errors.course_title && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.course_title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Description</label>
          <div className="relative">
            <AlignLeft size={15} className="absolute left-3.5 top-3.5 text-[#9090b8]" />
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe what students will learn..." rows={4}
              className="input-field pl-10 resize-none" style={{ paddingTop: '12px' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Duration (hours)</label>
            <div className="relative">
              <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
              <input type="number" min="1" value={form.duration} onChange={e => set('duration', e.target.value)}
                placeholder="e.g. 20" className={`input-field pl-10 ${errors.duration ? 'error' : ''}`} />
            </div>
            {errors.duration && <p className="text-xs text-rose-400 mt-1.5">{errors.duration}</p>}
          </div>

          {/* Category dropdown — real names! */}
          <div>
            <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
                className="input-field pl-10" style={{ appearance: 'none' }}>
                <option value="">Select category...</option>
                {categories.map(c => (
                  <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Difficulty Level</label>
          <div className="flex gap-3">
            {levels.map(l => (
              <button key={l} type="button" onClick={() => set('level', l)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border ${form.level === l
                  ? 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30'
                  : 'btn-ghost border-transparent'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex gap-3">
          <Link to="/instructor/courses" className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold text-center">Cancel</Link>
          <button type="submit" disabled={loading}
            className="btn-emerald flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm" /> : <><Save size={15} />{isEdit ? 'Update Course' : 'Create Course'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
