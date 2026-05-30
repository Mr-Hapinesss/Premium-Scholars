interface Props {
  icon?: string
  title: string
  subtitle?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon = '🔍', title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="font-display text-2xl text-sky-700 mb-2">{title}</h3>
      {subtitle && <p className="text-sky-400 text-sm max-w-xs">{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-semibold hover:bg-sky-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}