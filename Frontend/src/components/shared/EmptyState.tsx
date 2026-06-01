interface Props {
  icon?: string
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon = '🔍', title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-6">
      <div className="w-20 h-20 rounded-3xl bg-sky-100 flex items-center justify-center text-4xl mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="font-display text-2xl text-sky-800 mb-2 font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-sky-400 text-sm max-w-xs leading-relaxed mt-1">{subtitle}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-7 px-7 py-3 bg-sky-600 text-white rounded-2xl text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}