import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Hash, AlignLeft, Calendar, FileText, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ course_id: '', title: '', description: '', due_date: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => { api.get('/courses/?limit=100').then(r => setCourses(r.data)).catch(() => {}); }, []);

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.course_id) e.course_id = 'Select a course';
    if (!form.title.trim()) e.title = 'Assignment title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/assignments/', {
        course_id: parseInt(form.course_id),
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      });
      toast('Assignment created!', 'success');
      navigate('/instructor/grading');
    } catch (err) {
      toast(err.response?.data?.detail || 'Failed to create assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link to="/instructor/grading" className="inline-flex items-center gap-2 text-sm text-[#9090b8] hover:text-white transition-colors mb-4">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-3xl font-display font-bold text-white">Create Assignment</h1>
        <p className="text-[#9090b8] text-sm mt-1">Post a new assignment for your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 border border-white/[0.06] space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Course *</label>
          <div className="relative">
            <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <select value={form.course_id} onChange={e => set('course_id', e.target.value)}
              className={`input-field pl-10 ${errors.course_id ? 'error' : ''}`} style={{appearance:'none'}}>
              <option value="">Select a course...</option>
              {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_title}</option>)}
            </select>
          </div>
          {errors.course_id && <p className="text-xs text-rose-400 mt-1.5"><AlertCircle size={11} className="inline mr-1"/>{errors.course_id}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Title *</label>
          <div className="relative">
            <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Week 3 Practice Problems" className={`input-field pl-10 ${errors.title ? 'error' : ''}`} />
          </div>
          {errors.title && <p className="text-xs text-rose-400 mt-1.5">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe what students need to submit..." rows={4} className="input-field resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Due Date</label>
          <div className="relative">
            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
            <input type="datetime-local" value={form.due_date} onChange={e => set('due_date', e.target.value)}
              className="input-field pl-10" style={{colorScheme:'dark'}} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link to="/instructor/grading" className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold text-center">Cancel</Link>
          <button type="submit" disabled={loading}
            className="btn-emerald flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <LoadingSpinner size="sm" /> : <><Save size={15} />Create Assignment</>}
          </button>
        </div>
      </form>
    </div>
  );
}
