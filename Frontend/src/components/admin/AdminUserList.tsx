import { useToast } from '../shared/Toast'
import { adminService } from '../../services/admin.service'
import { href } from 'react-router-dom'

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'mentor' | 'mentee'
  whatsapp?: string
  university?: string
  createdAt: string
}

interface Props {
  users: User[]
  onDeleted: (id: string) => void
}

const roleBadge: Record<string, string> = {
  admin:  'bg-gold-100  text-gold-600',
  mentor: 'bg-sky-100   text-sky-600',
  mentee: 'bg-gray-100  text-gray-500',
}

export default function AdminUserList({ users, onDeleted }: Props) {
  const { toast } = useToast()

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
    try {
      await adminService.deleteUser(user._id)
      onDeleted(user._id)
      toast(`${user.name} deleted`, 'success')
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to delete user', 'error')
    }
  }

  if (!users.length) {
    return <p className="text-sky-400 text-sm text-center py-8">No users found.</p>
  }

  return (
    <>
    <div className="space-y-2">
      {users.map(u => (
        <div key={u._id} className="bg-white rounded-2xl border border-sky-100 px-5 py-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0
            ${u.role === 'admin' ? 'bg-gold-400' : u.role === 'mentor' ? 'bg-sky-500' : 'bg-sky-300'}`}>
            {u.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sky-800 text-sm truncate">{u.name}</div>
            <div className="text-sky-400 text-xs truncate">{u.email}</div>            
            {u.university && <div className="text-sky-300 text-xs truncate">{u.university}</div>}
            <div>
              {u.whatsapp && (
                 <a 
                   href={`https://wa.me/${u.whatsapp.replace(/^\+/, '')}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 mt-1 text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                 > 
                   <span className="text-base">💬</span>
                   {u.whatsapp}
                   <span className="text-emerald-400">↗</span>
                 </a>
              )}
              {!u.whatsapp && (
                 <span className="text-sky-300 text-xs mt-1 block">No WhatsApp set</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${roleBadge[u.role]}`}>
              {u.role}
            </span>
            <span className="text-sky-300 text-xs hidden md:block">
              {new Date(u.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={() => handleDelete(u)}
              className="text-xs text-rose hover:text-rose/70 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  )}