import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'

const reviews = [
  { name: 'Aisha M.', university: 'UoN', text: 'Premium Scholars changed my first year completely. I felt so supported!' },
  { name: 'Brian K.', university: 'JKUAT', text: 'The beauty shop is incredible quality at student prices.' },
  { name: 'Cynthia O.', university: 'Strathmore', text: 'My mentor helped me navigate registration, units, everything.' },
  { name: 'David N.', university: 'KU', text: 'Got all my first year requirements delivered to campus. 10/10.' },
  { name: 'Eunice W.', university: 'MU', text: 'The mentorship program is genuinely life-changing.' },
  { name: 'Felix A.', university: 'USIU', text: 'I love how everything is under one roof for scholars.' },
]

const faqs = [
  { q: 'What is Premium Scholars?', a: 'A holistic student support program combining mentorship, beauty, and first-year requirements for university students.' },
  { q: 'Do I need an account to browse?', a: 'No! You can browse beauty and requirements freely. An account is needed to place orders or join mentorship.' },
  { q: 'How do I become a mentor?', a: 'You need a verified mentor code from our admin team during sign up.' },
  { q: 'Can I use one account across sections?', a: 'Yes — your mentorship credentials work for the requirements shop too.' },
  { q: 'How often is news updated?', a: 'Our news board is updated daily or weekly depending on events.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Duplicate reviews for seamless loop
  const allReviews = [...reviews, ...reviews]

  return (
    <div className="min-h-screen bg-sky-50 font-body">
      <Navbar />

      {/* ── HERO ── */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(186,230,253,0.85) 0%, rgba(254,243,199,0.75) 100%), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gold-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-block bg-white/30 backdrop-blur-sm border border-gold-200 rounded-full px-4 py-1 text-gold-600 text-sm font-semibold mb-6 tracking-widest uppercase">
            ✦ Where Scholars Thrive ✦
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-bold text-sky-900 leading-none mb-6">
            Premium<br />
            <span className="text-transparent bg-clip-text bg-gold-shimmer bg-[length:200%] animate-shimmer">
              Scholars
            </span>
          </h1>
          <p className="text-sky-700 text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Beauty. Mentorship. Essentials. Everything a university scholar needs, beautifully united.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/beauty')}
              className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-semibold text-lg hover:bg-sky-700 transition-all hover:scale-105 shadow-lg shadow-sky-200">
              Shop Beauty
            </button>
            <button onClick={() => navigate('/mentorship')}
              className="px-8 py-4 bg-gold-400 text-sky-900 rounded-2xl font-semibold text-lg hover:bg-gold-500 transition-all hover:scale-105 shadow-lg shadow-gold-100">
              Join Mentorship
            </button>
            <button onClick={() => navigate('/requirements')}
              className="px-8 py-4 bg-white/70 backdrop-blur-sm text-sky-800 rounded-2xl font-semibold text-lg border border-sky-200 hover:bg-white transition-all hover:scale-105">
              First Year Requirements
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sky-500 text-xs">
          <span>Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-sky-400 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-4">About Us</div>
            <h2 className="font-display text-5xl text-sky-900 mb-6 leading-tight">Built for the Scholar in You</h2>
            <p className="text-sky-700 text-lg leading-relaxed mb-4">
              Premium Scholars was founded on a simple belief: university students deserve more than just lectures. They deserve community, mentorship, affordable beauty, and the tools to start strong.
            </p>
            <p className="text-sky-600 leading-relaxed">
              From curated beauty products to verified mentors who've walked your path, we cover every dimension of campus life — with style.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Mentors', value: '120+', color: 'bg-sky-100 border-sky-200' },
              { label: 'Beauty Products', value: '300+', color: 'bg-gold-50 border-gold-200' },
              { label: 'Universities', value: '18', color: 'bg-blush border-rose/20' },
              { label: 'Orders Fulfilled', value: '2,400+', color: 'bg-sky-50 border-sky-200' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} border rounded-2xl p-6 text-center`}>
                <div className="font-display text-4xl font-bold text-sky-800 mb-1">{stat.value}</div>
                <div className="text-sky-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTIONS PREVIEW ── */}
      <section className="py-16 bg-gradient-to-b from-sky-100 to-sky-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl text-center text-sky-900 mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { path: '/beauty', emoji: '💄', title: 'Beauty Shop', desc: 'Curated beauty products at scholar-friendly prices. Skincare, makeup, haircare and more.', color: 'from-blush to-rose/10', accent: 'text-rose' },
              { path: '/mentorship', emoji: '🎓', title: 'Mentorship', desc: 'Connect with verified senior students who guide you through university life.', color: 'from-sky-100 to-sky-50', accent: 'text-sky-600' },
              { path: '/requirements', emoji: '📦', title: 'Requirements', desc: 'Every item on your first-year list, available for order and delivered to campus.', color: 'from-gold-50 to-ivory', accent: 'text-gold-600' },
            ].map(card => (
              <button key={card.path} onClick={() => navigate(card.path)}
                className={`bg-gradient-to-br ${card.color} rounded-3xl p-8 text-left border border-white hover:shadow-xl transition-all hover:-translate-y-1 group`}>
                <div className="text-5xl mb-4">{card.emoji}</div>
                <h3 className={`font-display text-2xl font-bold ${card.accent} mb-3`}>{card.title}</h3>
                <p className="text-sky-700 text-sm leading-relaxed mb-4">{card.desc}</p>
                <span className={`text-xs font-semibold ${card.accent} group-hover:translate-x-1 inline-block transition-transform`}>
                  Explore → 
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEW CAROUSEL ── */}
      <section className="py-24 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
          <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-3">Testimonials</div>
          <h2 className="font-display text-4xl text-sky-900">What Scholars Say</h2>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          {/* Scrolling track */}
          <div className="flex gap-6 animate-scroll-left" style={{ width: 'max-content' }}>
            {allReviews.map((r, i) => (
              <div key={i}
                className="w-72 bg-sky-50 border border-sky-100 rounded-2xl p-6 flex-shrink-0">
                <div className="text-gold-400 text-xl mb-3">★★★★★</div>
                <p className="text-sky-700 text-sm leading-relaxed mb-4 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sky-800 text-sm">{r.name}</div>
                    <div className="text-sky-400 text-xs">{r.university}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-3">FAQ</div>
          <h2 className="font-display text-4xl text-sky-900">Frequently Asked</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-sky-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-sky-50 transition-colors">
                <span className="font-semibold text-sky-800">{faq.q}</span>
                <span className={`text-sky-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sky-600 text-sm leading-relaxed border-t border-sky-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}