import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id:      number
  message: string
  type:    ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

// ── Context ────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ── Individual toast component ─────────────────────────────────────────────

interface ToastProps {
  item:     ToastItem
  onRemove: (id: number) => void
  duration?: number
}

function ToastBubble({ item, onRemove, duration = 3500 }: ToastProps) {
  const [visible, setVisible] = useState(false)

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(item.id), 300)
    }, duration)
    return () => clearTimeout(t)
  }, [duration, item.id, onRemove])

  const styles: Record<ToastType, string> = {
    success: 'bg-emerald-500 text-white',
    error:   'bg-red-400     text-white',
    info:    'bg-sky-600     text-white',
  }

  const icons: Record<ToastType, string> = {
    success: '✓',
    error:   '✕',
    info:    'i',
  }

  return (
    <div
      className={[
        'flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium',
        'transition-all duration-300',
        styles[item.type],
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
      ].join(' ')}
    >
      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
        {icons[item.type]}
      </span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="opacity-70 hover:opacity-100 ml-1 flex-shrink-0 leading-none"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  )
}

// ── Provider ───────────────────────────────────────────────────────────────

let _nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++_nextId
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — bottom-right, stacks upward */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(item => (
          <div key={item.id} className="pointer-events-auto">
            <ToastBubble item={item} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}