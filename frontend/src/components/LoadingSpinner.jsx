export default function LoadingSpinner({ size = 'md', message = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-white/10 border-t-amber-400 animate-spin`} />
        <div className={`absolute inset-1 rounded-full border border-amber-400/20 border-b-amber-400/60 animate-spin`} style={{animationDirection:'reverse',animationDuration:'0.8s'}} />
      </div>
      {message && <p className="text-sm text-[#9090b8] animate-pulse">{message}</p>}
    </div>
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}
