export default function AboutSection() {
  const stats = [
    { label: 'Active Mentors',   value: '120+', bg: 'bg-sky-100   border-sky-200'  },
    { label: 'Beauty Products',  value: '300+', bg: 'bg-gold-50   border-gold-200' },
    { label: 'Partner Universities', value: '18', bg: 'bg-blush   border-rose/20'  },
    { label: 'Orders Fulfilled', value: '2,400+', bg: 'bg-sky-50  border-sky-200'  },
  ]

  const pillars = [
    { icon: '💄', title: 'Beauty',      desc: 'Curated products at student-friendly prices.' },
    { icon: '🎓', title: 'Mentorship',  desc: 'Verified seniors who guide first-years through campus life.' },
    { icon: '📦', title: 'Essentials',  desc: 'Every item on your first-year list, delivered on campus.' },
  ]

  return (
    <section id="about" className="py-24 px-6 font-body">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Text side */}
          <div>
            <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-4">About Us</div>
            <h2 className="font-display text-5xl text-sky-900 mb-6 leading-tight">
              Built for the<br />Scholar in You
            </h2>
            <p className="text-sky-700 text-lg leading-relaxed mb-5">
              Premium Scholars was founded on a simple belief: university students deserve more than just lectures. They deserve community, mentorship, affordable beauty, and the tools to start strong.
            </p>
            <p className="text-sky-600 leading-relaxed mb-5">
              From curated beauty products to verified mentors who've walked your exact path, we cover every dimension of campus life — with style.
            </p>
            <p className="text-sky-500 text-sm leading-relaxed">
              Whether you're a wide-eyed first-year with a list of requirements you don't know how to source, a student who wants to look and feel great without breaking the bank, or a senior student who wants to give back — Premium Scholars is home.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => (
              <div key={s.label} className={`${s.bg} border rounded-2xl p-7 text-center hover:shadow-md transition-shadow`}>
                <div className="font-display text-4xl font-bold text-sky-800 mb-2">{s.value}</div>
                <div className="text-sky-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map(p => (
            <div key={p.title} className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-7 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{p.icon}</div>
              <h3 className="font-display text-2xl text-sky-800 mb-2">{p.title}</h3>
              <p className="text-sky-500 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}