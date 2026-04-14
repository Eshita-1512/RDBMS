import { useEffect, useState } from 'react';
import { Users, Search, Award, ClipboardCheck, BookOpen } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

export default function StudentsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    api.get('/submissions/').then(r => setSubmissions(r.data)).catch(() => toast('Failed to load data','error')).finally(() => setLoading(false));
  }, []);

  // Group by user
  const studentMap = {};
  submissions.forEach(s => {
    if (!studentMap[s.user_id]) studentMap[s.user_id] = { user_id: s.user_id, submissions: [], graded: 0, totalMarks: 0 };
    studentMap[s.user_id].submissions.push(s);
    if (s.marks != null) { studentMap[s.user_id].graded++; studentMap[s.user_id].totalMarks += s.marks; }
  });
  const students = Object.values(studentMap).filter(s => search === '' || `${s.user_id}`.includes(search));

  if (loading) return <PageLoader message="Loading students..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Students</h1>
        <p className="text-[#9090b8] text-sm mt-1">{students.length} active student{students.length !== 1?'s':''} based on submissions</p>
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <Search size={14} className="text-[#9090b8]" />
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by student ID..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#9090b8]/50" />
      </div>

      {students.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <Users size={56} className="text-emerald-400/30 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No students yet</h2>
          <p className="text-[#9090b8]">Students will appear here once they submit assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((s, i) => {
            const avg = s.graded > 0 ? Math.round(s.totalMarks / s.graded) : null;
            return (
              <div key={s.user_id} className="card p-5 animate-fade-up opacity-0"
                style={{animationDelay:`${i*40}ms`,animationFillMode:'forwards'}}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-base">
                    {s.user_id}
                  </div>
                  <div>
                    <div className="font-semibold text-white">Student #{s.user_id}</div>
                    <div className="text-xs text-[#9090b8]">{s.submissions.length} submission{s.submissions.length !== 1?'s':''}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05]">
                  <div className="text-center">
                    <div className="text-lg font-display font-bold text-white">{s.submissions.length}</div>
                    <div className="text-[10px] text-[#9090b8]">Submitted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-display font-bold text-emerald-400">{s.graded}</div>
                    <div className="text-[10px] text-[#9090b8]">Graded</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-display font-bold ${avg != null ? (avg >= 70 ? 'text-emerald-400' : avg >= 50 ? 'text-amber-400' : 'text-rose-400') : 'text-[#9090b8]'}`}>
                      {avg != null ? avg : '—'}
                    </div>
                    <div className="text-[10px] text-[#9090b8]">Avg Score</div>
                  </div>
                </div>
                {avg != null && (
                  <div className="mt-3">
                    <div className="progress-track h-1.5">
                      <div className="progress-fill" style={{width:`${avg}%`,height:'100%',background: avg>=70 ? 'linear-gradient(90deg,#10b981,#34d399)' : avg>=50 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#e11d48,#f43f5e)'}} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
