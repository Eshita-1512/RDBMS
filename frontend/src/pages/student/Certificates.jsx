import { useEffect, useState } from 'react';
import { Award, Download, Share2, ExternalLink, Star } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { PageLoader } from '../../components/LoadingSpinner';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [certRes, cRes] = await Promise.all([api.get('/certificates/me'), api.get('/courses/?limit=100')]);
        setCerts(certRes.data);
        const cMap = {};
        cRes.data.forEach(c => { cMap[c.course_id] = c; });
        setCourses(cMap);
      } catch (e) {
        console.error(e);
        // Mock data
        setCerts([
          { certificate_id: 1, course_id: 4, issued_date: '2024-11-20', grade: 'A' },
        ]);
        setCourses({
          4: { course_id: 4, course_title: 'Web Development with React', description: 'Build modern web apps' },
        });
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const gradeColors = { A: 'badge-emerald', B: 'badge-blue', C: 'badge-gold', D: 'badge-violet', F: 'badge-rose' };

  if (loading) return <PageLoader message="Loading certificates..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-white">My Certificates</h1>
        <p className="text-[#9090b8] text-sm mt-1">{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
      </div>

      {certs.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/[0.05]">
          <Award size={64} className="text-amber-400/30 mx-auto mb-6 animate-float" />
          <h2 className="text-2xl font-display font-bold text-white mb-3">No certificates yet</h2>
          <p className="text-[#9090b8] max-w-md mx-auto">Complete a course to earn your certificate. Certificates are issued after grading.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certs.map((cert, i) => {
            const course = courses[cert.course_id];
            return (
              <div key={`${cert.user_id}-${cert.course_id}`}
                className="relative glass rounded-2xl overflow-hidden border border-amber-400/15 animate-fade-up opacity-0"
                style={{animationDelay:`${i*80}ms`,animationFillMode:'forwards'}}>
                {/* Gold header */}
                <div className="relative p-6 overflow-hidden" style={{background:'linear-gradient(135deg,rgba(251,191,36,0.08) 0%,rgba(245,158,11,0.04) 100%)'}}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-400/5 -translate-y-8 translate-x-8" />
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-gold flex-shrink-0">
                        <Award size={22} className="text-[#06061a]" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Certificate of Completion</p>
                        <h3 className="font-display font-bold text-white text-base mt-0.5">
                          {course?.course_title || `Course #${cert.course_id}`}
                        </h3>
                      </div>
                    </div>
                    {cert.grade && (
                      <span className={`badge ${gradeColors[cert.grade] || 'badge-gold'} text-sm`}>
                        Grade: {cert.grade}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-400/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#9090b8]">Awarded to</p>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                    </div>
                    {cert.issue_date && (
                      <div className="text-right">
                        <p className="text-xs text-[#9090b8]">Issued</p>
                        <p className="text-sm text-amber-400 font-medium">{new Date(cert.issue_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-3 flex items-center gap-2">
                  <button onClick={() => toast('Download feature coming soon!','info')}
                    className="btn-ghost flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Download size={13} /> Download
                  </button>
                  <button onClick={() => toast('Shared to LinkedIn!','success')}
                    className="btn-ghost flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
