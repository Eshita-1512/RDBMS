import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const strengthLevels = [
  { label: 'Weak', color: 'bg-rose-500', width: '25%' },
  { label: 'Fair', color: 'bg-amber-500', width: '50%' },
  { label: 'Good', color: 'bg-blue-500', width: '75%' },
  { label: 'Strong', color: 'bg-emerald-500', width: '100%' },
];

function getStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s - 1;
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const strength = form.password.length > 0 ? getStrength(form.password) : -1;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(true);
      toast('Account created! Redirecting to login...', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Try a different email.';
      setErrors({ api: msg });
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6" style={{animation:'bounceIn 0.6s ease forwards'}}>
            <CheckCircle size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">You're in!</h2>
          <p className="text-[#9090b8]">Account created successfully. Taking you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-emerald-600 -top-20 -right-20 opacity-10" />
        <div className="orb w-96 h-96 bg-violet-600 -bottom-20 -left-20 opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] transition-all">
              <GraduationCap size={20} className="text-[#06061a]" />
            </div>
            <span className="font-display font-bold text-xl text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Start for free</h1>
          <p className="text-[#9090b8] text-sm">Join 12,000+ learners already growing their skills</p>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/[0.07] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          {errors.api && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 mb-5 animate-fade-up">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span className="text-sm text-rose-300">{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                <input type="text" value={form.name}
                  onChange={e => { setForm(p => ({...p, name: e.target.value})); setErrors(p => ({...p, name: ''})); }}
                  placeholder="Alex Johnson" className={`input-field pl-10 ${errors.name ? 'error' : ''}`} />
              </div>
              {errors.name && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                <input type="email" value={form.email}
                  onChange={e => { setForm(p => ({...p, email: e.target.value})); setErrors(p => ({...p, email: ''})); }}
                  placeholder="you@example.com" className={`input-field pl-10 ${errors.email ? 'error' : ''}`} />
              </div>
              {errors.email && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => { setForm(p => ({...p, password: e.target.value})); setErrors(p => ({...p, password: ''})); }}
                  placeholder="Min. 6 characters" className={`input-field pl-10 pr-10 ${errors.password ? 'error' : ''}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9090b8] hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && strength >= 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#9090b8]">Strength</span>
                    <span className={`text-xs font-semibold ${['text-rose-400','text-amber-400','text-blue-400','text-emerald-400'][strength]}`}>
                      {strengthLevels[strength].label}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strengthLevels[strength].color}`}
                      style={{width: strengthLevels[strength].width}} />
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-semibold text-[#9090b8] uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9090b8]" />
                <input type="password" value={form.confirm}
                  onChange={e => { setForm(p => ({...p, confirm: e.target.value})); setErrors(p => ({...p, confirm: ''})); }}
                  placeholder="Repeat password" className={`input-field pl-10 ${errors.confirm ? 'error' : form.confirm && form.confirm === form.password ? 'border-emerald-500/40' : ''}`} />
                {form.confirm && form.confirm === form.password && (
                  <CheckCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
                )}
              </div>
              {errors.confirm && <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.confirm}</p>}
            </div>

            <div className="pt-1">
              <p className="text-xs text-[#9090b8] mb-4">You'll be registered as a <span className="text-amber-400 font-semibold">Student</span>. Instructors are added by admin.</p>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <LoadingSpinner size="sm" /> : <>
                  <span>Create My Account</span>
                  <ArrowRight size={16} className="relative z-10" />
                </>}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-sm text-[#9090b8]">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
