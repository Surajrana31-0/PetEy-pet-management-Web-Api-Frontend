import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Home, LogOut, Menu, PawPrint, Search, User as UserIcon, X, Shield, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/pets', label: 'Browse Pets', icon: Search },
    { to: '/ai-chat', label: 'AI Assistant', icon: MessageCircle },
    { to: '/ai-matching', label: 'AI Matching', icon: Sparkles },
  ];

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-lg">
      <nav className="container-app section-padding flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <PawPrint className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            PetEy
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {profile?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-teal-50 text-teal-700' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                )
              }
            >
              <Shield className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/favorites" className="btn-ghost" title="Favorites">
                <Heart className="h-5 w-5" />
              </Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-stone-100">
                {profile?.profile_image ? (
                  <img src={profile.profile_image} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    <UserIcon className="h-4 w-4" />
                  </div>
                )}
                <span className="text-sm font-medium text-stone-700">{profile?.full_name?.split(' ')[0] ?? 'Profile'}</span>
              </Link>
              <button onClick={handleSignOut} className="btn-ghost text-stone-500" title="Sign out">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium',
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-stone-700 hover:bg-stone-100'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
            {profile?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium',
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-stone-700 hover:bg-stone-100'
                  )
                }
              >
                <Shield className="h-5 w-5" />
                Admin Dashboard
              </NavLink>
            )}
            <div className="my-2 border-t border-stone-200" />
            {user ? (
              <>
                <Link to="/favorites" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100">
                  <Heart className="h-5 w-5" />
                  Favorites
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100">
                  <UserIcon className="h-5 w-5" />
                  My Profile
                </Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100">
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
