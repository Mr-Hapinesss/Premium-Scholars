import { Mentee } from '../../types/mentorship.types'

interface Props {
  mentee: Mentee
}

export default function MenteeCard({ mentee }: Props) {
  const initials = mentee.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const waLink = mentee.whatsapp
    ? `https://wa.me/${mentee.whatsapp.replace(/^\+/, '')}`
    : null

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-5 flex items-center gap-4 hover:shadow-md transition-all group">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sky-800 truncate">{mentee.name}</div>
        <div className="text-sky-500 text-sm truncate">{mentee.email}</div>
        {mentee.university && (
          <div className="text-sky-400 text-xs mt-0.5 flex items-center gap-1 truncate">
            <span>🏛</span>
            {mentee.university}
          </div>
        )}

        {/* WhatsApp */}
        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            <span className="text-base leading-none">💬</span>
            {mentee.whatsapp}
            <span className="text-emerald-400 text-[10px]">↗</span>
          </a>
        ) : (
          <div className="text-sky-300 text-xs mt-1.5">
            No WhatsApp number set
          </div>
        )}
      </div>

      {/* Date */}
      <div className="text-right flex-shrink-0">
        <div className="text-sky-300 text-xs">Joined</div>
        <div className="text-sky-400 text-xs font-medium">
          {new Date(mentee.createdAt).toLocaleDateString('en-KE', {
            day:   'numeric',
            month: 'short',
            year:  'numeric',
          })}
        </div>
      </div>
    </div>
  )
}