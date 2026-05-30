import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-body"
      style={{
        backgroundImage: `linear-gradient(135deg,rgba(186,230,253,0.88) 0%,rgba(254,243,199,0.78) 100%),url('/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-24 -left-12 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-24 -right-12 w-72 h-72 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-rose/20 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-1000" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-gold-200/60 rounded-full px-5 py-1.5 text-gold-700 text-xs font-semibold mb-8 tracking-widest uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          Where Scholars Thrive
        </div>

        <h1 className="font-display text-7xl md:text-9xl font-bold text-sky-900 leading-none mb-6 tracking-tight">
          Premium<br />
          <span className="text-transparent bg-clip-text bg-gold-shimmer bg-[length:200%] animate-shimmer">
            Scholars
          </span>
        </h1>

        <p className="text-sky-700 text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Beauty. Mentorship. Essentials.{' '}
          <span className="font-semibold text-sky-800">Everything a university scholar needs,</span>{' '}
          beautifully united.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/beauty')}
            className="group px-8 py-4 bg-sky-600 text-white rounded-2xl font-semibold text-lg hover:bg-sky-700 transition-all hover:scale-105 shadow-xl shadow-sky-200 flex items-center gap-2"
          >
            💄 Shop Beauty
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button
            onClick={() => navigate('/mentorship')}
            className="group px-8 py-4 bg-gold-400 text-sky-900 rounded-2xl font-semibold text-lg hover:bg-gold-500 transition-all hover:scale-105 shadow-xl shadow-gold-100 flex items-center gap-2"
          >
            🎓 Join Mentorship
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <button
            onClick={() => navigate('/requirements')}
            className="group px-8 py-4 bg-white/70 backdrop-blur-sm text-sky-800 rounded-2xl font-semibold text-lg border border-sky-200 hover:bg-white transition-all hover:scale-105 flex items-center gap-2"
          >
            📦 First Year Essentials
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sky-500/70 text-xs">
        <span className="tracking-widest uppercase text-[10px]">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-sky-400/60 to-transparent" />
      </div>
    </section>
  )
}