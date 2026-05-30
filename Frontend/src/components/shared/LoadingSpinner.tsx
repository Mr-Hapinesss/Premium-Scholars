interface Props {
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export default function LoadingSpinner({ size = 'md', fullPage = false }: Props) {
  const dims = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' }[size]

  const spinner = (
    <div className={`${dims} rounded-full border-4 border-sky-200 border-t-gold-400 animate-spin`} />
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  )
}