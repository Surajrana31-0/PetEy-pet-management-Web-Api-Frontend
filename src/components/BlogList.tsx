import { useEffect, useState } from 'react';
import { supabase, type Blog } from '@/lib/supabase';
import { Loader2, ArrowRight, Calendar, User, BookOpen, X } from 'lucide-react';

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Blog | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (error) { console.error(error.message); } else { setBlogs((data || []) as Blog[]); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) { return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-600 animate-spin" /></div>; }
  if (blogs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-4"><BookOpen className="w-8 h-8" /></div>
        <p className="text-gray-500">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  const [featured, ...rest] = blogs;

  return (
    <div>
      <button onClick={() => setSelected(featured)} className="w-full text-left mb-8 group">
        <div className="relative rounded-3xl overflow-hidden h-80 bg-gray-900">
          {featured.image_url ? <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition" /> : <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="inline-flex items-center gap-2 bg-teal-500/90 px-3 py-1 rounded-full text-xs font-medium mb-3">Featured</div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">{featured.title}</h2>
            <p className="text-white/80 max-w-2xl line-clamp-2">{featured.excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
              {featured.author && <span className="flex items-center gap-1"><User className="w-4 h-4" /> {featured.author}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(featured.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </button>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((blog) => (
          <button key={blog.id} onClick={() => setSelected(blog)} className="text-left bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group">
            <div className="h-44 overflow-hidden bg-gray-100">
              {blog.image_url ? <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /> : <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center"><BookOpen className="w-10 h-10 text-teal-300" /></div>}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                {blog.author && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {blog.author}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(blog.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blog.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm group-hover:gap-2 transition-all">Read more <ArrowRight className="w-4 h-4" /></span>
            </div>
          </button>
        ))}
      </div>

      {selected && <BlogModal blog={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function BlogModal({ blog, onClose }: { blog: Blog; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-64 bg-gray-200">
          {blog.image_url ? <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800" />}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            {blog.author && <span className="flex items-center gap-1"><User className="w-4 h-4" /> {blog.author}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(blog.created_at).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          {blog.excerpt && <p className="text-gray-500 font-medium mb-4">{blog.excerpt}</p>}
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">{blog.content}</div>
        </div>
      </div>
    </div>
  );
}
