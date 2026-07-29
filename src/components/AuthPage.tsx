import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { PawPrint, Loader2, Mail, Lock, User } from 'lucide-react';

type Mode = 'login' | 'signup';

export function AuthPage({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white mb-4 shadow-lg shadow-teal-600/20">
            <PawPrint className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'signup' ? 'Join PetEy' : 'Welcome back'}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === 'signup' ? 'Create an account to adopt pets' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-5">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" placeholder="John Doe" required />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" placeholder="you@example.com" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition" placeholder="••••••••" required minLength={6} />
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === 'signup' ? (
              <>Already have an account? <a href="#/login" className="text-teal-600 font-medium hover:underline">Sign in</a></>
            ) : (
              <>Don't have an account? <a href="#/signup" className="text-teal-600 font-medium hover:underline">Sign up</a></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
