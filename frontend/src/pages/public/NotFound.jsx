import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-violet-600 top-0 left-0 opacity-10" />
        <div className="orb w-96 h-96 bg-amber-500 bottom-0 right-0 opacity-10" />
      </div>
      <div className="text-center relative z-10 animate-fade-up">
        <div className="text-[10rem] font-display font-bold text-gradient-gold leading-none mb-4">404</div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Page not found</h1>
        <p className="text-[#9090b8] mb-8 max-w-sm mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <ArrowLeft size={15} /> Go Back
          </button>
          <Link to="/" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span className="relative z-10 flex items-center gap-2"><Home size={15} />Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
