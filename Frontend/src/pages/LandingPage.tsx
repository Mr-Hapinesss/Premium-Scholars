import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'

const reviews = [
  { name: 'Aisha M.',   university: 'UoN',       text: 'Premium Scholars changed my first year completely. I felt so supported!' },
  { name: 'Brian K.',   university: 'JKUAT',     text: 'The beauty shop is incredible quality at student prices.' },
  { name: 'Cynthia O.', university: 'Strathmore',text: 'My mentor helped me navigate registration, units, everything.' },
  { name: 'David N.',   university: 'KU',         text: 'Got all my first year requirements delivered to campus. 10/10.' },
  { name: 'Eunice W.',  university: 'MU',         text: 'The mentorship program is genuinely life-changing.' },
  { name: 'Felix A.',   university: 'USIU',       text: 'I love how everything is under one roof for scholars.' },
]

const faqs = [
  { q: 'What is Premium Scholars?',          a: 'A holistic student support program combining mentorship, beauty, and first-year requirements for university students.' },
  { q: 'Do I need an account to browse?',    a: 'No! You can browse beauty and requirements freely. An account is needed to place orders or join mentorship.' },
  { q: 'How do I become a mentor?',          a: 'You need a verified mentor code from our admin team during sign up.' },
  { q: 'Can I use one account across sections?', a: 'Yes — your mentorship credentials work for the requirements shop too.' },
  { q: 'How often is news updated?',         a: 'Our news board is updated daily or weekly depending on events.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const allReviews = [...reviews, ...reviews]

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(186,230,253,0.9) 0%, rgba(254,243,199,0.8) 100%), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-32 left-16 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-32 right-16 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border border-yellow-200 rounded-full px-5 py-2 text-yellow-700 text-xs font-bold mb-8 tracking-[0.2em] uppercase shadow-sm">
            <span className="text-yellow-500">✦</span>
            Where Scholars Thrive
            <span className="text-yellow-500">✦</span>
          </div>

          <h1 className="font-display text-7xl md:text-9xl font-bold text-sky-900 leading-[0.9] mb-4 tracking-tight">
            Premium
          </h1>
          <h1 className="font-display text-7xl md:text-9xl font-bold leading-[0.9] mb-8 tracking-tight text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24 0%, #fde68a 45%, #f59e0b 100%)', backgroundSize: '200%' }}>
            Scholars
          </h1>

          <p className="text-sky-700 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
            Beauty. Mentorship. Essentials. Everything a university scholar needs, beautifully united.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => navigate('/beauty')}
              className="w-full sm:w-auto px-8 py-4 bg-sky-600 text-white rounded-2xl font-semibold text-base hover:bg-sky-700 transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-sky-300/40"
            >
              Shop Beauty
            </button>
            <button
              onClick={() => navigate('/mentorship')}
              className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-sky-900 rounded-2xl font-semibold text-base hover:bg-yellow-500 transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-yellow-200/60"
            >
              Join Mentorship
            </button>
            <button
              onClick={() => navigate('/requirements')}
              className="w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-sky-800 rounded-2xl font-semibold text-base border border-sky-200/80 hover:bg-white transition-all duration-200 hover:scale-[1.03] shadow-sm"
            >
              First Year Requirements
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sky-400 text-xs tracking-wider">
          <span className="uppercase tracking-[0.15em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-sky-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs mb-5">About Us</p>
            <h2 className="font-display text-5xl md:text-6xl text-sky-900 mb-7 leading-tight">
              Built for the<br />Scholar in You
            </h2>
            <p className="text-sky-600 text-lg leading-relaxed mb-5">
              Premium Scholars was founded on a simple belief: university students deserve more than just lectures. They deserve community, mentorship, affordable beauty, and the tools to start strong.
            </p>
            <p className="text-sky-500 leading-relaxed text-base">
              From curated beauty products to verified mentors who've walked your path, we cover every dimension of campus life — with style.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Mentors',   value: '120+',   bg: 'bg-sky-100',   border: 'border-sky-200',   text: 'text-sky-800' },
              { label: 'Beauty Products',  value: '300+',   bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
              { label: 'Universities',     value: '18',     bg: 'bg-rose-50',   border: 'border-rose-100',   text: 'text-rose-700' },
              { label: 'Orders Fulfilled', value: '2,400+', bg: 'bg-sky-50',    border: 'border-sky-200',   text: 'text-sky-800' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-3xl p-7 text-center`}>
                <div className={`font-display text-4xl font-bold ${stat.text} mb-2`}>{stat.value}</div>
                <div className="text-sky-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTIONS PREVIEW ── */}
      <section className="py-20 bg-gradient-to-b from-sky-100/60 to-sky-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">What We Offer</p>
            <h2 className="font-display text-5xl text-sky-900">Everything You Need</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                path: '/beauty', emoji: '💄', title: 'Beauty Shop',
                desc: 'Curated beauty products at scholar-friendly prices. Skincare, makeup, haircare and more.',
                bg: 'bg-gradient-to-br from-rose-50 to-pink-50/50',
                border: 'border-rose-100',
                accent: 'text-rose-500',
                tag: 'Shop now',
              },
              {
                path: '/mentorship', emoji: '🎓', title: 'Mentorship',
                desc: 'Connect with verified senior students who guide you through university life.',
                bg: 'bg-gradient-to-br from-sky-100 to-sky-50',
                border: 'border-sky-200',
                accent: 'text-sky-600',
                tag: 'Find a mentor',
              },
              {
                path: '/requirements', emoji: '📦', title: 'Requirements',
                desc: 'Every item on your first-year list, available for order and delivered to campus.',
                bg: 'bg-gradient-to-br from-yellow-50 to-amber-50/40',
                border: 'border-yellow-200',
                accent: 'text-yellow-600',
                tag: 'Browse list',
              },
            ].map(card => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className={`${card.bg} ${card.border} border rounded-3xl p-8 text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group w-full`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-6">
                  {card.emoji}
                </div>
                <h3 className={`font-display text-2xl font-bold ${card.accent} mb-3`}>{card.title}</h3>
                <p className="text-sky-600 text-sm leading-relaxed mb-6">{card.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${card.accent} group-hover:gap-2.5 transition-all duration-200`}>
                  {card.tag} <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEW CAROUSEL ── */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-6 mb-14 text-center">
          <p className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">Testimonials</p>
          <h2 className="font-display text-5xl text-sky-900">What Scholars Say</h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex gap-5 animate-scroll-left" style={{ width: 'max-content' }}>
            {allReviews.map((r, i) => (
              <div
                key={i}
                className="w-72 bg-sky-50 border border-sky-100 rounded-2xl p-6 flex-shrink-0 hover:border-sky-200 transition-colors"
              >
                <div className="text-yellow-400 text-base mb-4 tracking-wide">★★★★★</div>
                <p className="text-sky-700 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-sky-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-yellow-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sky-800 text-sm">{r.name}</div>
                    <div className="text-sky-400 text-xs mt-0.5">{r.university}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-6 bg-sky-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-yellow-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">FAQ</p>
            <h2 className="font-display text-5xl text-sky-900">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-sky-50/60 transition-colors"
                >
                  <span className="font-semibold text-sky-800 text-sm leading-snug">{faq.q}</span>
                  <span className={`text-sky-400 text-xs transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sky-600 text-sm leading-relaxed border-t border-sky-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}