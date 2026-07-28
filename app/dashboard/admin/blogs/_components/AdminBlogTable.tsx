'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'react-toastify';
import { createBlog, updateBlogStatus, deleteBlog } from '@/lib/api/admin/blog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Trash2, Power, Edit } from 'lucide-react';

export function AdminBlogTable({ initialBlogs }: { initialBlogs: any[] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleToggleStatus = (blogId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    startTransition(async () => {
      try {
        await updateBlogStatus(blogId, nextStatus as any);
        toast.success(`Blog status updated to ${nextStatus}.`);
        setBlogs((prev) =>
          prev.map((b) => (b._id === blogId ? { ...b, status: nextStatus, published: nextStatus === 'PUBLISHED' } : b))
        );
      } catch (err: any) {
        toast.error(err.message || 'Failed to update blog status');
      }
    });
  };

  const handleDelete = (blogId: string, blogTitle: string) => {
    if (!confirm(`Delete blog post "${blogTitle}"?`)) return;

    startTransition(async () => {
      try {
        await deleteBlog(blogId);
        toast.success('Blog post deleted.');
        setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete blog');
      }
    });
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and Content are required.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await createBlog({ title, content, status: 'PUBLISHED' });
        toast.success('Blog post published!');
        if (res.data) {
          setBlogs((prev) => [res.data, ...prev]);
        }
        setIsModalOpen(false);
        setTitle('');
        setContent('');
      } catch (err: any) {
        toast.error(err.message || 'Failed to create blog');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Articles & News</h3>
        <Button
          size="sm"
          variant="brand"
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Blog Post
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Article Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {blogs.map((b) => (
              <tr key={b._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                  {b.title}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  {b.authorId?.fullName || b.author || 'Admin Staff'}
                </td>
                <td className="p-4">
                  <Badge variant={b.status === 'PUBLISHED' || b.published ? 'success' : 'warning'}>
                    {b.status || (b.published ? 'PUBLISHED' : 'DRAFT')}
                  </Badge>
                </td>
                <td className="p-4 text-slate-400">
                  {new Date(b.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(b._id, b.status || (b.published ? 'PUBLISHED' : 'DRAFT'))}
                    className="text-xs text-slate-700 dark:text-slate-300"
                    title="Toggle Publish Status"
                  >
                    <Power className={`w-3.5 h-3.5 ${(b.status === 'PUBLISHED' || b.published) ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(b._id, b.title)}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 p-2"
                    title="Delete Blog"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Blog Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBlog} className="space-y-4 py-2">
              <div>
                <Label htmlFor="title" required>Article Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. 10 Essential Tips for First-Time Pet Parents"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content" required>Article Content</Label>
                <Textarea
                  id="content"
                  rows={8}
                  placeholder="Write complete blog post content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <DialogFooter className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" variant="brand" isLoading={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Publish Article
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
