import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Star, Users, BookOpen, Award, CheckCircle, TrendingUp, Globe, Zap, Shield, ChevronRight, Code, Palette, BarChart3, Brain } from 'lucide-react';
import api from '../../api';
import CourseCard from '../../components/CourseCard';

const stats = [
  { label: 'Active Students', value: '12,400+', icon: Users, color: 'text-amber-400' },
  { label: 'Expert Courses', value: '340+', icon: BookOpen, color: 'text-emerald-400' },
  { label: 'Certifications Issued', value: '8,900+', icon: Award, color: 'text-violet-400' },
  { label: 'Course Completion Rate', value: '94%', icon: TrendingUp, color: 'text-rose-400' },
];

const features = [
  { icon: Zap, title: 'AI-Powered Learning Paths', desc: 'Our platform analyzes your progress and adapts course recommendations in real time — your personal academic guide.', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  { icon: Shield, title: 'Verified Certificates', desc: 'Every certificate is blockchain-timestamped and shareable directly to LinkedIn. Employers can verify instantly.', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  { icon: Globe, title: 'Live Cohort Sessions', desc: 'Join weekly live sessions with instructors and peers. Collaborative learning beats solo study every time.', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
  { icon: Brain, title: 'Smart Assignment Review', desc: 'Instructors use AI-assisted grading tools so feedback reaches you within hours, not weeks.', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
];

const categories = [
  { name: 'Development', icon: Code, count: 87, color: 'from-blue-600 to-violet-600' },
  { name: 'Design', icon: Palette, count: 54, color: 'from-rose-500 to-pink-600' },
  { name: 'Business', icon: BarChart3, count: 63, color: 'from-amber-500 to-orange-600' },
  { name: 'AI & Data', icon: Brain, count: 48, color: 'from-emerald-500 to-teal-600' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer @ Google', text: 'SkillBridge helped me land my dream job. The structured curriculum and live feedback were game-changers.', avatar: 'PS', rating: 5, color: 'from-violet-500 to-blue-500' },
  { name: 'Rahul Mehta', role: 'UX Designer @ Razorpay', text: 'I enrolled in the design track and within 3 months had a portfolio good enough to get hired. Worth every second.', avatar: 'RM', rating: 5, color: 'from-rose-500 to-pink-500' },
  { name: 'Ananya Iyer', role: 'Data Analyst @ Flipkart', text: 'The AI & Data courses are incredibly up-to-date. My instructor responded to every assignment within 24 hours.', avatar: 'AI', rating: 5, color: 'from-amber-500 to-orange-500' },
];

export default function Landing() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState({});
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cRes, catRes] = await Promise.all([
          api.get('/courses/?limit=6'),
          api.get('/categories/?limit=100'),
        ]);
        setCourses(cRes.data);
        const catMap = {};
        catRes.data.forEach(c => { catMap[c.category_id] = c.category_name; });
        setCategories(catMap);
      } catch {}
    };
    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
      });
    }, { threshold: 0.1 });
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => { sectionRefs.current[id] = el; };

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-[600px] h-[600px] bg-violet-600 -top-32 -left-48 animate-pulse-slow" />
          <div className="orb w-[500px] h-[500px] bg-amber-500 -bottom-20 -right-32 animate-pulse-slow" style={{animationDelay:'2s'}} />
          <div className="orb w-[300px] h-[300px] bg-emerald-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" style={{animationDelay:'1s'}} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}/>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-8 text-amber-300 text-sm font-medium animate-fade-up">
            <Zap size={14} className="text-amber-400" />
            India's most modern learning platform · Est. 2024
            <span className="ml-1 badge badge-gold">NEW</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.05] mb-6 animate-fade-up delay-100" style={{opacity:0}}>
            Find Your<br />
            <span className="text-gradient-gold italic">Next Skill.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#9090b8] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200" style={{opacity:0}}>
            Premium courses built by industry experts. Learn at your pace, earn verified certificates, and unlock the career you've been working towards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300" style={{opacity:0}}>
            <Link to="/register" className="btn-gold px-8 py-4 rounded-2xl text-base font-semibold flex items-center gap-2 group">
              <span>Start Learning Free</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link to="/courses" className="btn-ghost px-8 py-4 rounded-2xl text-base font-semibold flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                <Play size={14} className="text-amber-400 ml-0.5" />
              </div>
              Browse Courses
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up delay-400" style={{opacity:0}}>
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <Icon size={20} className={`${color} mx-auto mb-2`} />
                <div className="text-xl md:text-2xl font-display font-bold text-white">{value}</div>
                <div className="text-xs text-[#9090b8] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#9090b8] text-xs animate-bounce">
          <span>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="cats" ref={setRef('cats')} className="py-24 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.cats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <span className="badge badge-violet mb-4">Explore by Category</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              Every Field. <span className="text-gradient-cool">One Platform.</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.map(({ name, icon: Icon, count, color }, i) => (
              <Link to="/courses" key={name} className="glass glass-hover rounded-2xl p-6 text-center group cursor-pointer border border-white/[0.06]"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="font-display font-semibold text-white text-base mb-1">{name}</h3>
                <p className="text-sm text-[#9090b8]">{count} courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section id="featured" ref={setRef('featured')} className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb w-[400px] h-[400px] bg-violet-600 top-0 right-0 opacity-[0.07]" />
        </div>
        <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-700 ${visibleSections.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge badge-gold mb-4">Featured</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                Trending <span className="text-gradient-gold">Courses</span>
              </h2>
            </div>
            <Link to="/courses" className="hidden md:flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors group">
              View all <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course, i) => (
                <div key={course.course_id} className="animate-fade-up opacity-0" style={{animationDelay:`${i*80}ms`,animationFillMode:'forwards'}}>
                  <CourseCard course={course} index={i} categoryName={categories[course.category_id]} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card h-64 animate-shimmer" />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/courses" className="btn-ghost px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2">
              Explore All Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES / USPs ── */}
      <section id="features" ref={setRef('features')} className="py-24 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <span className="badge badge-emerald mb-4">Why SkillBridge</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Built Different. <span className="text-gradient-emerald">By Design.</span>
            </h2>
            <p className="text-[#9090b8] max-w-xl mx-auto">Features that no other Indian ed-tech platform has put together under one roof.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} className={`glass glass-hover rounded-2xl p-7 border ${bg} flex gap-5`} style={{transitionDelay:`${i*80}ms`}}>
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 border`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                  <p className="text-sm text-[#9090b8] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" ref={setRef('testimonials')} className="py-24 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-14">
            <span className="badge badge-rose mb-4">Student Stories</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              Real People. <span className="italic text-gradient-cool">Real Results.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, avatar, rating, color }, i) => (
              <div key={name} className="card p-6 flex flex-col gap-4" style={{transitionDelay:`${i*80}ms`}}>
                <div className="flex gap-1">
                  {[...Array(rating)].map((_, j) => <Star key={j} size={14} className="text-amber-400" fill="currentColor" />)}
                </div>
                <p className="text-sm text-[#9090b8] leading-relaxed flex-1 italic">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-[#9090b8]">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section id="cta" ref={setRef('cta')} className="py-24 px-6">
        <div className={`max-w-4xl mx-auto transition-all duration-700 ${visibleSections.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative glass-gold rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="orb w-64 h-64 bg-amber-400 -top-16 -left-16 opacity-10" />
              <div className="orb w-64 h-64 bg-amber-400 -bottom-16 -right-16 opacity-10" />
            </div>
            <span className="badge badge-gold mb-6">Limited Offer</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 relative z-10">
              Ready to <span className="text-gradient-gold">level up?</span>
            </h2>
            <p className="text-[#9090b8] text-lg max-w-xl mx-auto mb-8 relative z-10">
              Join 12,000+ students already building the skills that matter. First month is free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/register" className="btn-gold px-8 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 group">
                <span>Create Free Account</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <div className="flex items-center gap-2 text-sm text-[#9090b8]">
                <CheckCircle size={16} className="text-emerald-400" /> No credit card needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <BookOpen size={14} className="text-[#06061a]" />
            </div>
            <span className="font-display font-bold text-white">Skill<span className="text-gradient-gold">Bridge</span></span>
          </div>
          <p className="text-sm text-[#9090b8] text-center">
            © 2024 SkillBridge · DBMS Lab Project · Built with ❤️ for education
          </p>
          <div className="flex items-center gap-4 text-sm text-[#9090b8]">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
