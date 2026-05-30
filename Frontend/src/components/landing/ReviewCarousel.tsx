const reviews = [
  { name: 'Aisha M.',    university: 'UoN',         rating: 5, text: 'Premium Scholars completely changed my first year. The mentorship program is genuinely life-changing.' },
  { name: 'Brian K.',    university: 'JKUAT',        rating: 5, text: 'The beauty shop has incredible products at prices that actually make sense for a student.' },
  { name: 'Cynthia O.',  university: 'Strathmore',   rating: 5, text: 'My mentor helped me navigate registration, unit choices, everything. Could not have survived without this.' },
  { name: 'David N.',    university: 'KU',           rating: 5, text: 'Got every single item on my first-year list delivered to campus. Zero stress.' },
  { name: 'Eunice W.',   university: 'MU',           rating: 5, text: 'The whole concept is brilliant. Beauty, mentorship and requirements in one place? Yes please.' },
  { name: 'Felix A.',    university: 'USIU',         rating: 5, text: 'I referred five of my friends. The experience has been consistently excellent across the board.' },
  { name: 'Grace T.',    university: 'TUK',          rating: 5, text: 'The skincare products I got from the beauty shop are the best I have ever used. Genuinely.' },
  { name: 'Hassan M.',   university: 'Daystar',      rating: 5, text: 'Being a mentor here is fulfilling. The platform makes it easy to track and support my mentees.' },
]

export default function ReviewCarousel() {
  const doubled = [...reviews, ...reviews]

  return (
    <section className="py-24 overflow-hidden bg-white font-body">
      <div className="max-w-6xl mx-auto px-6 mb-14 text-center">
        <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-3">Testimonials</div>
        <h2 className="font-display text-5xl text-sky-900">What Scholars Say</h2>
      </div>

      <div className="relative">
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* First row — scrolls left */}
        <div className="flex gap-5 mb-5 animate-scroll-left" style={{ width: 'max-content' }}>
          {doubled.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>

        {/* Second row — scrolls right (reverse) */}
        <div
          className="flex gap-5 animate-scroll-left"
          style={{ width: 'max-content', animationDirection: 'reverse', animationDuration: '40s' }}
        >
          {[...doubled].reverse().map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="w-72 bg-sky-50 border border-sky-100 rounded-2xl p-5 flex-shrink-0 hover:shadow-md transition-shadow">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i} className="text-gold-400 text-base">★</span>
        ))}
      </div>
      <p className="text-sky-700 text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {review.name[0]}
        </div>
        <div>
          <div className="font-semibold text-sky-800 text-sm">{review.name}</div>
          <div className="text-sky-400 text-xs">{review.university}</div>
        </div>
      </div>
    </div>
  )
}