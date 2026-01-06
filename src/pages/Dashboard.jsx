import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { 
  LogOut, 
  Plus, 
  LayoutDashboard, 
  Save, 
  Trash2, 
  Globe, 
  Lock, 
  Github, 
  Layers,
  Pencil, // Icon baru untuk Edit
  X       // Icon baru untuk Batal
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [projects, setProjects] = useState([])
  
  // State untuk melacak ID project yang sedang diedit (null = mode tambah baru)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: '', description: '', tech_stack: '', repo_url: '', demo_url: ''
  })

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
      fetchProjects()
    }
    init()
  }, [navigate])

  const fetchProjects = async () => {
    setFetchLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setProjects(data)
    setFetchLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // --- LOGIKA UTAMA: HANDLE SUBMIT (Bisa Simpan Baru atau Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
        ...form,
        demo_url: form.demo_url.trim() === '' ? null : form.demo_url
    }

    let error;

    if (editingId) {
      // MODE EDIT: Update data berdasarkan ID
      const { error: updateError } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingId)
      error = updateError
    } else {
      // MODE TAMBAH: Insert data baru
      const { error: insertError } = await supabase
        .from('projects')
        .insert([payload])
      error = insertError
    }
    
    if (error) {
      alert(error.message)
    } else {
      resetForm() // Bersihkan form
      fetchProjects() // Refresh tabel
    }
    setLoading(false)
  }

  // Fungsi saat tombol Edit (Pensil) ditekan
  const handleEdit = (project) => {
    setEditingId(project.id) // Set mode edit
    setForm({
      title: project.title,
      description: project.description || '',
      tech_stack: project.tech_stack || '',
      repo_url: project.repo_url || '',
      demo_url: project.demo_url || ''
    })
    // Scroll ke atas (agar user sadar form sudah terisi) di tampilan mobile
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Fungsi membatalkan edit
  const resetForm = () => {
    setEditingId(null)
    setForm({ title: '', description: '', tech_stack: '', repo_url: '', demo_url: '' })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus project ini?")) {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (!error) fetchProjects()
      else alert(error.message)
    }
  }

  const stats = {
    total: projects.length,
    online: projects.filter(p => p.demo_url).length,
    offline: projects.filter(p => !p.demo_url).length
  }

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder:text-zinc-600"

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans">
      
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
             <LayoutDashboard className="text-blue-500" /> 
             <span>CMS Dashboard</span>
          </div>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 text-sm flex items-center gap-2 transition px-3 py-2 rounded-md hover:bg-zinc-900">
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total Projects</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Layers size={24}/></div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Online / Live</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1">{stats.online}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><Globe size={24}/></div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Offline / Local</p>
              <h3 className="text-3xl font-bold text-amber-400 mt-1">{stats.offline}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500"><Lock size={24}/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Form Input (Bisa Mode Edit) */}
          <div className="lg:col-span-1">
            <div className={`bg-zinc-900 border ${editingId ? 'border-amber-500/50' : 'border-zinc-800'} rounded-xl p-6 sticky top-24 transition-colors duration-300`}>
              
              {/* Header Form Berubah jika sedang Edit */}
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-semibold flex items-center gap-2 ${editingId ? 'text-amber-400' : 'text-white'}`}>
                  {editingId ? <Pencil size={18} /> : <Plus size={18} className="text-blue-500" />} 
                  {editingId ? 'Edit Project' : 'Tambah Project'}
                </h2>
                
                {/* Tombol Batal Edit */}
                {editingId && (
                  <button onClick={resetForm} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded">
                    <X size={12} /> Batal
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Judul Project</label>
                  <input name="title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} placeholder="Nama Aplikasi..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Deskripsi</label>
                  <textarea name="description" required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass} placeholder="Deskripsi singkat..." />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Tech Stack</label>
                  <input name="tech_stack" value={form.tech_stack} onChange={e => setForm({...form, tech_stack: e.target.value})} className={inputClass} placeholder="React, Tailwind..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="block text-xs font-medium text-zinc-500 mb-1.5">GitHub URL</label>
                     <input name="repo_url" value={form.repo_url} onChange={e => setForm({...form, repo_url: e.target.value})} className={inputClass} placeholder="https://..." />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-zinc-500 mb-1.5">Demo URL</label>
                     <input name="demo_url" value={form.demo_url} onChange={e => setForm({...form, demo_url: e.target.value})} className={inputClass} placeholder="Kosong = Offline" />
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full mt-4 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 ${
                    editingId 
                      ? 'bg-amber-600 hover:bg-amber-500' 
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  <Save size={16} /> {loading ? 'Menyimpan...' : (editingId ? 'Update Project' : 'Publish Project')}
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: Daftar Project */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Project List</h2>
                <span className="text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                  {projects.length} Items
                </span>
              </div>

              {fetchLoading ? (
                <div className="p-8 text-center text-zinc-500">Loading data...</div>
              ) : projects.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 italic">Belum ada data project.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/50 text-xs text-zinc-500 border-b border-zinc-800 uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Project Name</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {projects.map((item) => (
                        <tr key={item.id} className={`transition group ${editingId === item.id ? 'bg-amber-500/10 border-l-2 border-amber-500' : 'hover:bg-zinc-800/50'}`}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-white">{item.title}</p>
                            <p className="text-xs text-zinc-500 truncate max-w-[200px]">{item.tech_stack}</p>
                          </td>
                          <td className="px-6 py-4">
                            {item.demo_url ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span> Offline
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                             {/* Tombol EDIT */}
                             <button 
                               onClick={() => handleEdit(item)}
                               className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition"
                               title="Edit Project"
                             >
                               <Pencil size={16}/>
                             </button>

                             {/* Tombol HAPUS */}
                             <button 
                               onClick={() => handleDelete(item.id)}
                               className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                               title="Hapus Project"
                             >
                               <Trash2 size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}