import { useState } from 'react'

const faqs = [
  { q: 'What is Premium Scholars?',         a: 'A holistic student support program combining mentorship, beauty products, and first-year university requirements — all in one platform built specifically for Kenyan university students.' },
  { q: 'Do I need an account to browse?',   a: 'No. You can freely browse both the beauty shop and the requirements section. You only need an account to place an order or to access the mentorship portal.' },
  { q: 'How do I become a mentor?',         a: 'Register under the Mentorship section and choose the "Mentor" role. You will need a verification code provided by our admin team. Reach out via email to request one.' },
  { q: 'Can I use one account across sections?', a: 'Yes. Your mentorship account credentials (email + password) work for placing orders in the requirements section too.' },
  { q: 'How are mentors assigned?',         a: 'Our admin team reviews applications and manually assigns mentees to mentors based on university, faculty, and availability. You will see your mentor appear in your dashboard once assigned.' },
  { q: 'How often is news updated?',        a: 'Our news board is maintained by admin and is updated daily or weekly depending on campus events, program announcements, and community highlights.' },
  { q: 'What are the delivery options for requirements?', a: 'We currently deliver to campuses within our partner universities. Delivery timelines and addresses are confirmed at checkout after you place your order.' },
  { q: 'Is my payment information safe?',   a: 'Yes. We do not store card details directly. All payments are processed through trusted payment gateways with industry-standard encryption.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 font-body bg-sky-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-gold-500 font-semibold tracking-widest uppercase text-sm mb-3">FAQ</div>
          <h2 className="font-display text-5xl text-sky-900">Frequently Asked</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white border rounded-2xl overflow-hidden transition-all ${open === i ? 'border-sky-300 shadow-sm' : 'border-sky-100'}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-sky-50/50 transition-colors"
              >
                <span className="font-semibold text-sky-800 pr-4">{faq.q}</span>
                <span className={`text-sky-400 text-lg flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48' : 'max-h-0'}`}>
                <p className="px-6 pb-5 pt-1 text-sky-600 text-sm leading-relaxed border-t border-sky-50">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}