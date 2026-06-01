interface Props {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export default function LoadingSpinner({ size = 'md', fullPage = false }: Props) {
  const dims = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }[size]
  const border = { sm: 'border-2', md: 'border-4', lg: 'border-4' }[size]

  const spinner = (
    <div className={`${dims} ${border} rounded-full border-sky-200 border-t-yellow-400 animate-spin`} />
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-sky-50">
        {spinner}
        <p className="text-sky-400 text-sm animate-pulse">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  )
}