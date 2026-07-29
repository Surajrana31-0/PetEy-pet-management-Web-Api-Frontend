import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthPage } from '@/components/AuthPage';
import { LandingPage } from '@/components/LandingPage';
import { DashboardLayout, type NavItem } from '@/components/DashboardLayout';
import { BrowsePets } from '@/components/BrowsePets';
import { MyAdoptions } from '@/components/MyAdoptions';
import { BlogList } from '@/components/BlogList';
import { ManagePets } from '@/components/ManagePets';
import { ManageAdoptions } from '@/components/ManageAdoptions';
import { ManageBlogs } from '@/components/ManageBlogs';
import { AdoptModal } from '@/components/AdoptModal';
import type { Pet } from '@/lib/supabase';
import { Search, Heart, BookOpen, PawPrint, FileText, Users, Loader2 } from 'lucide-react';

function getRoute(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

function navigate(path: string) {
  window.location.hash = path;
}

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [route, setRoute] = useState(getRoute());
  const [adoptPet, setAdoptPet] = useState<Pet | null>(null);

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (route === '/login') {
    return session ? <RedirectToDashboard /> : <AuthPage mode="login" />;
  }
  if (route === '/signup') {
    return session ? <RedirectToDashboard /> : <AuthPage mode="signup" />;
  }

  if (!session) {
    return <LandingPage onNavigate={navigate} />;
  }

  const isAdmin = profile?.role === 'admin';
  const baseNav: NavItem[] = [
    { label: 'Browse Pets', icon: Search, active: route === '/dashboard' || route === '/', onClick: () => navigate('/dashboard') },
    { label: 'My Adoptions', icon: Heart, active: route === '/adoptions', onClick: () => navigate('/adoptions') },
    { label: 'Blog', icon: BookOpen, active: route === '/blog', onClick: () => navigate('/blog') },
  ];

  const adminNav: NavItem[] = isAdmin ? [
    { label: 'Manage Pets', icon: PawPrint, active: route === '/admin/pets', onClick: () => navigate('/admin/pets') },
    { label: 'Manage Adoptions', icon: Users, active: route === '/admin/adoptions', onClick: () => navigate('/admin/adoptions') },
    { label: 'Manage Blogs', icon: FileText, active: route === '/admin/blogs', onClick: () => navigate('/admin/blogs') },
  ] : [];

  const navItems = [...baseNav, ...(isAdmin ? adminNav : [])];

  let title = 'Browse Pets';
  let content: React.ReactNode = null;

  if (route === '/dashboard' || route === '/' || route === '') {
    title = 'Browse Pets';
    content = <BrowsePets onAdopt={setAdoptPet} />;
  } else if (route === '/adoptions') {
    title = 'My Adoptions';
    content = <MyAdoptions />;
  } else if (route === '/blog') {
    title = 'Pet Care Blog';
    content = <BlogList />;
  } else if (route === '/admin/pets' && isAdmin) {
    title = 'Manage Pets';
    content = <ManagePets />;
  } else if (route === '/admin/adoptions' && isAdmin) {
    title = 'Manage Adoptions';
    content = <ManageAdoptions />;
  } else if (route === '/admin/blogs' && isAdmin) {
    title = 'Manage Blogs';
    content = <ManageBlogs />;
  } else {
    title = 'Browse Pets';
    content = <BrowsePets onAdopt={setAdoptPet} />;
  }

  return (
    <>
      <DashboardLayout navItems={navItems} title={title}>
        {content}
      </DashboardLayout>
      {adoptPet && <AdoptModal pet={adoptPet} onClose={() => setAdoptPet(null)} />}
    </>
  );
}

function RedirectToDashboard() {
  useEffect(() => { navigate('/dashboard'); }, []);
  return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 text-teal-600 animate-spin" /></div>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
