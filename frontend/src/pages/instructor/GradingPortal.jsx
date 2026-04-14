import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Users, Award, Search, Filter, Save, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function GradingPortal() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradeInputs, setGradeInputs] = useState({});
  const [saving, setSaving] = useState({});
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/submissions/').then(r => {
      setSubmissions(r.data);
      const inputs = {};
      r.data.forEach(s => { inputs[`${s.assignment_id}-${s.user_id}`] = s.marks?.toString() || ''; });
      setGradeInputs(inputs);
    }).catch(() => toast('Failed to load submissions','error')).finally(() => setLoading(false));
  }, []);

  const handleGrade = async (assignmentId, userId) => {
    const key = `${assignmentId}-${userId}`;
    const marks = parseInt(gradeInputs[key]);
    if (isNaN(marks) || marks < 0 || marks > 100) { toast('Enter a valid grade between 0 and 100', 'warning'); return; }
    setSaving(p => ({ ...p, [key]: true }));
    try {
      const res = await api.put(`/submissions/${assignmentId}/${userId}`, { marks });
      setSubmissions(prev => prev.map(s => s.assignment_id === assignmentId && s.user_id === userId ? { ...s, marks: res.data.marks } : s));
      toast(`Saved! Grade ${marks}/100 for User #${userId}`, 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Grading failed', 'error');
    } finally {
      setSaving(p => ({ ...p, [key]: false }));
    }
  };

  if (loading) return <PageLoader message="Loading submissions..." />;

  const filtered = submissions.filter(s => {
    const matchFilter = filter === 'all' || (filter === 'ungraded' && s.marks == null) || (filter === 'graded' && s.marks != null);
    const matchSearch = search === '' || `${s.assignment_id} ${s.user_id}`.includes(search);
    return matchFilter && matchSearch;
  });

  const ungraded = submissions.filter(s => s.marks == null).length;
  const graded = submissions.filter(s => s.marks != null).length;
  const avg = graded > 0 ? Math.round(submissions.filter(s => s.marks != null).reduce((a, s) => a + s.marks, 0) / graded) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Grading Portal</h1>
        <p className="text-[#9090b8] text-sm mt-1">Review and grade student submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: submissions.length, color: 'badge-blue' },
          { label: 'Ungraded', val: ungraded, color: 'badge-gold' },
          { label: 'Graded', val: graded, color: 'badge-emerald' },
          { label: 'Avg Score', val: avg != null ? `${avg}/100` : '—', color: 'badge-violet' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center border border-white/[0.05]">
            <div className="text-xl font-display font-bold text-white">{val}</div>
            <span className={`badge ${color} mt-1`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9090b8]" />
          <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search by assignment or user ID..." className="input-field pl-9 py-2 text-sm" />
        </div>
        <div className="flex gap-2">
          {['all','ungraded','graded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${filter===f ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/25' : 'btn-ghost'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <CheckCircle size={56} className="text-emerald-400/30 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            {submissions.length === 0 ? 'No submissions yet' : 'No results'}
          </h2>
          <p className="text-[#9090b8]">{submissions.length === 0 ? 'Students haven\'t submitted any assignments yet.' : 'Try adjusting your filters.'}</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.06]">
          {/* Header */}
          <div className="px-5 py-3.5 flex items-center gap-4 text-xs font-semibold text-[#9090b8] uppercase tracking-wider"
            style={{borderBottom:'1px solid rgba(255,255,255,0.05)',background:'rgba(255,255,255,0.02)'}}>
            <span className="w-28">Assignment</span>
            <span className="w-24">Student</span>
            <span className="flex-1 hidden md:block">Submitted</span>
            <span className="w-16 text-center">Current</span>
            <span className="w-40">Grade (0–100)</span>
            <span className="w-20 text-center">Save</span>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {filtered.map((sub, i) => {
              const key = `${sub.assignment_id}-${sub.user_id}`;
              const isGraded = sub.marks != null;
              const inputVal = gradeInputs[key] ?? '';
              const changed = inputVal !== (sub.marks?.toString() ?? '');

              return (
                <div key={key} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors animate-fade-up opacity-0"
                  style={{animationDelay:`${Math.min(i,15)*20}ms`,animationFillMode:'forwards'}}>
                  {/* Assignment */}
                  <div className="w-28">
                    <span className="badge badge-violet">Asgn #{sub.assignment_id}</span>
                  </div>
                  {/* Student */}
                  <div className="w-24 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {sub.user_id}
                    </div>
                    <span className="text-sm text-white">#{sub.user_id}</span>
                  </div>
                  {/* Date */}
                  <div className="flex-1 hidden md:block">
                    {sub.submission_date ? (
                      <span className="text-xs text-[#9090b8] flex items-center gap-1.5">
                        <Clock size={11} />{new Date(sub.submission_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </span>
                    ) : <span className="text-xs text-[#9090b8]">—</span>}
                  </div>
                  {/* Current grade */}
                  <div className="w-16 text-center">
                    {isGraded
                      ? <span className={`badge ${sub.marks >= 80 ? 'badge-emerald' : sub.marks >= 50 ? 'badge-gold' : 'badge-rose'}`}>{sub.marks}</span>
                      : <span className="text-xs text-[#9090b8]">—</span>}
                  </div>
                  {/* Input */}
                  <div className="w-40">
                    <div className="flex items-center gap-2">
                      <input
                        type="number" min="0" max="100"
                        value={inputVal}
                        onChange={e => setGradeInputs(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="0–100"
                        className={`w-full px-3 py-2 rounded-xl text-sm text-center font-mono transition-all outline-none border ${
                          changed ? 'border-amber-400/40 bg-amber-400/5 text-amber-300' : 'input-field'
                        }`}
                      />
                    </div>
                  </div>
                  {/* Save button */}
                  <div className="w-20 flex justify-center">
                    <button
                      onClick={() => handleGrade(sub.assignment_id, sub.user_id)}
                      disabled={saving[key] || !changed || inputVal === ''}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        changed && inputVal !== '' ? 'btn-emerald' : 'btn-ghost'
                      }`}
                    >
                      {saving[key] ? <LoadingSpinner size="sm" /> : <><Save size={12} />Save</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
