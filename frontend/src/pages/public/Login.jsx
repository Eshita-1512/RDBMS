import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, GraduationCap, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast('Welcome back! Redirecting...', 'success');
      setTimeout(() => navigate(user.role_id === 2 ? '/instructor' : '/student'), 500);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-900/20 to-amber-900/20 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-96 h-96 bg-violet-600 -top-20 -left-20 opacity-10" />
          <div className="orb w-96 h-96 bg-amber-500 -bottom-20 -right-20 opacity-10" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}/>
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              <GraduationCap size={32} className="text-[#06061a]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">Skill<span className="text-gradient-gold">Bridge</span></h1>
              <p className="text-amber-400 text-sm font-medium">Learning Platform</p>
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">Bridge Your Skills</h2>
          <p className="text-[#9090b8] text-lg leading-relaxed mb-8">
            Connect knowledge gaps and accelerate your career with our comprehensive learning platform. Join thousands of learners worldwide.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="glass rounded-xl p-4 border border-white/[0.05]">
              <div className="text-2xl font-display font-bold text-amber-400 mb-1">500+</div>
              <div className="text-sm text-[#9090b8]">Courses</div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/[0.05]">
              <div className="text-2xl font-display font-bold text-emerald-400 mb-1">10K+</div>
              <div className="text-sm text-[#9090b8]">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="relative z-10 w-full max-w-md animate-fade-up">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all">
                <GraduationCap size={20} className="text-[#06061a]" />
              </div>
              <span className="font-display font-bold text-xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
            </Link>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome back</h1>
              <p className="text-[#9090b8] text-sm">Sign in to continue your learning journey</p>
            </div>

            {errors.api && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 mb-5 animate-fade-up">
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
                <span className="text-sm text-rose-300">{errors.api}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email: ''})); }}
                    placeholder="Enter your email address"
                    className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password: ''})); }}
                    placeholder="Enter your password"
                    className={`input-field pl-10 pr-10 ${errors.password ? 'error' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9090b8] hover:text-white transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? <LoadingSpinner size="sm" /> : <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="relative z-10" />
                </>}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
              <p className="text-sm text-[#9090b8]">
                Don't have an account?{' '}
                <Link to="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Create one free</Link>
              </p>
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 glass rounded-xl text-center">
            <p className="text-xs text-[#9090b8]">
              💡 Tip: Register an account to start your journey, or use a pre-existing account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
