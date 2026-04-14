import { Clock, Users, Star, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const levelColors = {
  beginner: 'badge-emerald',
  intermediate: 'badge-gold',
  advanced: 'badge-rose',
};
const categoryColors = ['badge-violet', 'badge-blue', 'badge-emerald', 'badge-gold'];

export default function CourseCard({ course, index = 0, showEnroll, onEnroll, enrolled }) {
  const level = course.level?.toLowerCase() || 'beginner';
  const catColor = categoryColors[index % categoryColors.length];

  return (
    <div className="card group cursor-pointer overflow-hidden flex flex-col h-full">
      {/* Gradient header */}
      <div className={`h-36 relative overflow-hidden flex items-center justify-center`}
        style={{ background: `linear-gradient(135deg, ${['#1a1a4e','#0d2d1a','#2d1a0d','#1a0d2d'][index%4]} 0%, #06061a 100%)` }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, ${['#fbbf24','#34d399','#f87171','#a78bfa'][index%4]} 0%, transparent 60%)`
        }}/>
        <BookOpen size={40} className="text-white/20 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" />
        <div className="absolute top-3 left-3">
          <span className={`badge ${levelColors[level] || 'badge-blue'}`}>
            {course.level || 'Beginner'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg glass text-xs text-amber-300">
            <Star size={10} fill="currentColor" /> {(4.2 + (index * 0.1)).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {course.category_id && (
          <span className={`badge ${catColor} mb-2`}>Category {course.category_id}</span>
        )}
        <h3 className="font-display font-semibold text-white text-base leading-snug mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">
          {course.course_title}
        </h3>
        <p className="text-sm text-[#9090b8] leading-relaxed mb-4 flex-1 line-clamp-2">
          {course.description || 'Explore this comprehensive course and build real-world skills.'}
        </p>

        <div className="flex items-center gap-4 text-xs text-[#9090b8] mb-4 pt-3 border-t border-white/[0.05]">
          {course.duration && (
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-400/60" /> {course.duration}h</span>
          )}
          <span className="flex items-center gap-1.5"><Users size={12} className="text-emerald-400/60" /> {120 + index * 37} students</span>
          <span className="flex items-center gap-1.5"><Award size={12} className="text-violet-400/60" /> Certificate</span>
        </div>

        {showEnroll && (
          enrolled
            ? <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
                <TrendingUp size={14} /> Enrolled
              </div>
            : <button onClick={() => onEnroll(course.course_id)}
                className="btn-gold w-full py-2.5 rounded-xl text-sm font-semibold">
                <span>Enroll Now</span>
              </button>
        )}
      </div>
    </div>
  );
}
