import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Send, AlertCircle, ClipboardList, Calendar } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [asgRes, subRes] = await Promise.all([api.get('/assignments/'), api.get('/submissions/me')]);
        setAssignments(asgRes.data);
        const subMap = {};
        subRes.data.forEach(s => { subMap[s.assignment_id] = s; });
        setSubmissions(subMap);
      } catch (e) { toast('Failed to load assignments', 'error'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (assignmentId) => {
    setSubmitting(p => ({ ...p, [assignmentId]: true }));
    try {
      const res = await api.post('/submissions/', { assignment_id: assignmentId, user_id: user.user_id });
      setSubmissions(p => ({ ...p, [assignmentId]: res.data }));
      toast('Assignment submitted successfully!', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || 'Submission failed', 'error');
    } finally {
      setSubmitting(p => ({ ...p, [assignmentId]: false }));
    }
  };

  if (loading) return <PageLoader message="Loading assignments..." />;

  const submitted = assignments.filter(a => submissions[a.assignment_id]);
  const pending = assignments.filter(a => !submissions[a.assignment_id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Assignments</h1>
        <p className="text-[#9090b8] text-sm mt-1">{pending.length} pending · {submitted.length} submitted</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', val: assignments.length, color: 'badge-blue' },
          { label: 'Pending', val: pending.length, color: 'badge-gold' },
          { label: 'Submitted', val: submitted.length, color: 'badge-emerald' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass rounded-xl p-4 text-center border border-white/[0.05]">
            <div className="text-2xl font-display font-bold text-white">{val}</div>
            <span className={`badge ${color} mt-1`}>{label}</span>
          </div>
        ))}
      </div>

      {assignments.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <ClipboardList size={56} className="text-violet-400/40 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No assignments yet</h2>
          <p className="text-[#9090b8]">Your instructor hasn't posted any assignments yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending */}
          {pending.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-white text-lg mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" /> Pending Submission
              </h2>
              <div className="space-y-3">
                {pending.map((a, i) => (
                  <div key={a.assignment_id} className="card p-5 border-l-2 border-l-amber-400/40 animate-fade-up opacity-0"
                    style={{animationDelay:`${i*50}ms`,animationFillMode:'forwards'}}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge badge-gold">Pending</span>
                          <span className="text-xs text-[#9090b8] font-mono">#{a.assignment_id}</span>
                        </div>
                        <h3 className="font-display font-semibold text-white text-base">{a.title}</h3>
                        {a.description && <p className="text-sm text-[#9090b8] mt-1 line-clamp-2">{a.description}</p>}
                        {a.due_date && (
                          <p className="text-xs text-amber-400/70 mt-2 flex items-center gap-1.5">
                            <Calendar size={11} /> Due: {new Date(a.due_date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleSubmit(a.assignment_id)}
                        disabled={submitting[a.assignment_id]}
                        className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 flex-shrink-0 disabled:opacity-60"
                      >
                        {submitting[a.assignment_id]
                          ? <LoadingSpinner size="sm" />
                          : <><Send size={14} className="relative z-10" /><span>Submit</span></>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submitted */}
          {submitted.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-white text-lg mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> Submitted
              </h2>
              <div className="space-y-3">
                {submitted.map((a, i) => {
                  const sub = submissions[a.assignment_id];
                  return (
                    <div key={a.assignment_id} className="card p-5 border-l-2 border-l-emerald-400/40 opacity-80">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-emerald">Submitted</span>
                            {sub?.marks != null
                              ? <span className="badge badge-gold">Grade: {sub.marks}/100</span>
                              : <span className="badge badge-blue">Awaiting Grade</span>
                            }
                          </div>
                          <h3 className="font-display font-semibold text-white text-base">{a.title}</h3>
                          {sub?.submission_date && (
                            <p className="text-xs text-[#9090b8] mt-1 flex items-center gap-1">
                              <CheckCircle size={10} /> Submitted {new Date(sub.submission_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        {sub?.marks != null && (
                          <div className="flex-shrink-0 text-center glass-emerald rounded-xl px-5 py-3">
                            <div className="text-2xl font-display font-bold text-emerald-400">{sub.marks}</div>
                            <div className="text-xs text-[#9090b8]">/ 100</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
