import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 text-sm transition">
          <ArrowLeft size={16} /> Kembali ke Portofolio
        </Link>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-zinc-500 text-sm mb-6">Masuk untuk mengelola project.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="email" placeholder="Email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-zinc-600"
              />
            </div>
            <div>
              <input 
                type="password" placeholder="Password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-zinc-600"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition disabled:opacity-50 flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}