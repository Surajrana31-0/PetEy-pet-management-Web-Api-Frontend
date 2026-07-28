import React from 'react';
import Link from 'next/link';
import { requireAdminRole } from '@/lib/auth/guards';
import { getAllBlogs, getBlogStats } from '@/lib/api/admin/blog';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, AlertCircle, Plus } from 'lucide-react';
import { AdminBlogTable } from './_components/AdminBlogTable';

export default async function AdminBlogsPage() {
  const admin = await requireAdminRole();

  let blogs: any[] = [];
  let stats = { totalBlogs: 0, publishedBlogs: 0, draftBlogs: 0 };
  let error: string | null = null;

  try {
    const [blogsRes, statsRes] = await Promise.all([
      getAllBlogs(),
      getBlogStats(),
    ]);

    if (blogsRes.success && blogsRes.data) {
      blogs = Array.isArray(blogsRes.data) ? blogsRes.data : blogsRes.data.blogs || [];
    }
    if (statsRes.success && statsRes.data) {
      stats = statsRes.data;
    }
  } catch (err: any) {
    error = err.message || 'Failed to load blog post manager';
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Center
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Blog Post Publisher & Articles
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Write pet care guides, news updates, and publish stories to the public blog.
          </p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Total Blog Posts</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{blogs.length || stats.totalBlogs}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Published</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{blogs.filter((b) => b.status === 'PUBLISHED' || b.published).length}</h3>
        </Card>
        <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Drafts</p>
          <h3 className="text-2xl font-black text-amber-600 mt-1">{blogs.filter((b) => b.status === 'DRAFT' || !b.published).length}</h3>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <AdminBlogTable initialBlogs={blogs} />
    </div>
  );
}
