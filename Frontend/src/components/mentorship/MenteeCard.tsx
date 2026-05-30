interface Mentee {
  _id: string
  name: string
  email: string
  university: string
  createdAt: string
}

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

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-5 flex items-center gap-4 hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-gold-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sky-800 truncate">{mentee.name}</div>
        <div className="text-sky-500 text-sm truncate">{mentee.email}</div>
        <div className="text-sky-400 text-xs mt-0.5 flex items-center gap-1">
          <span>🏫</span>
          {mentee.university}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sky-300 text-xs">Joined</div>
        <div className="text-sky-500 text-xs font-medium">
          {new Date(mentee.createdAt).toLocaleDateString('en-KE', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </div>
      </div>
    </div>
  )
}