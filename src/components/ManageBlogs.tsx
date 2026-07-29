import { useEffect, useState } from 'react';
import { supabase, type Blog } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Loader2, BookOpen, Plus, Pencil, Trash2, X } from 'lucide-react';

export function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) { console.error(error.message); } else { setBlogs((data || []) as Blog[]); }
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) { alert(error.message); } else { setBlogs((prev) => prev.filter((b) => b.id !== id)); }
  }

  if (loading) { return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>; }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{blogs.length} blog posts</p>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2"><Plus className="w-5 h-5" /> New post</button>
      </div>
      {blogs.length === 0 ? (
        <div className="text-center py-20"><div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4"><BookOpen className="w-8 h-8" /></div><p className="text-gray-500">No blog posts yet. Write your first post!</p></div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">{blog.image_url ? <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><BookOpen className="w-7 h-7" /></div>}</div>
              <div className="flex-1 min-w-0"><p className="font-semibold text-gray-900 truncate">{blog.title}</p><p className="text-sm text-gray-500 truncate">{blog.excerpt}</p><p className="text-xs text-gray-400 mt-1">{new Date(blog.created_at).toLocaleDateString()}</p></div>
              <div className="flex gap-2"><button onClick={() => { setEditing(blog); setShowForm(true); }} className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition flex items-center gap-1.5"><Pencil className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete(blog.id)} className="border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium py-2 px-3 rounded-lg transition"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          ))}
        </div>
      )}
      {showForm && <BlogForm blog={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); async function reload() { const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false }); setBlogs((data || []) as Blog[]); } reload(); }} />}
    </div>
  );
}

function BlogForm({ blog, onClose, onSaved }: { blog: Blog | null; onClose: () => void; onSaved: () => void }) {
  const { profile } = useAuth();
  const [form, setForm] = useState({ title: blog?.title || '', excerpt: blog?.excerpt || '', content: blog?.content || '', image_url: blog?.image_url || '', author: blog?.author || profile?.full_name || profile?.email || 'Admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');
    if (!form.title || !form.content) { setError('Title and content are required'); setLoading(false); return; }
    let result;
    if (blog) { result = await supabase.from('blogs').update(form).eq('id', blog.id); } else { result = await supabase.from('blogs').insert(form); }
    if (result.error) { setError(result.error.message); } else { onSaved(); }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white"><h2 className="text-lg font-semibold text-gray-900">{blog ? 'Edit post' : 'New blog post'}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button></div>
        <div className="p-5 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" placeholder="How to care for your new puppy" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label><input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition" placeholder="A short summary shown in the blog list..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Cover image URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition" placeholder="https://..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 outline-none transition resize-none" placeholder="Write your blog post here..." /></div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
          <button onClick={handleSubmit} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">{loading && <Loader2 className="w-5 h-5 animate-spin" />}{blog ? 'Save changes' : 'Publish'}</button>
        </div>
      </div>
    </div>
  );
}
