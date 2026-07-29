import { PawPrint, Heart, Search, Shield, ArrowRight, BookOpen } from 'lucide-react';

export function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center"><PawPrint className="w-5 h-5" /></div>
            <span className="text-xl font-bold text-gray-900">PetEy</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('/login')} className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 transition">Sign in</button>
            <button onClick={() => onNavigate('/signup')} className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2 rounded-lg transition">Get started</button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6"><Heart className="w-4 h-4" />Find your new best friend</div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">Give a pet a<br /><span className="text-teal-600">loving home</span></h1>
            <p className="text-lg text-gray-500 mt-6 max-w-md">Browse pets available for adoption, read our latest pet care blogs, and submit adoption requests — all in one place.</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => onNavigate('/signup')} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg shadow-teal-600/20">Start adopting <ArrowRight className="w-5 h-5" /></button>
              <button onClick={() => onNavigate('/login')} className="border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition">Sign in</button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10">
              <img src="https://images.pexels.com/photos/46024/pexels-photo-46024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Cat and dog together" className="w-full h-[420px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Heart className="w-6 h-6 text-amber-600" /></div>
              <div><p className="text-2xl font-bold text-gray-900">100+</p><p className="text-sm text-gray-500">Pets adopted</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14"><h2 className="text-3xl font-bold text-gray-900">How it works</h2><p className="text-gray-500 mt-3">Three simple steps to find your perfect companion</p></div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={Search} title="Browse pets" desc="Explore available pets with photos, breed info, and descriptions. Paginate through listings easily." color="teal" />
            <FeatureCard icon={Heart} title="Request adoption" desc="Submit an adoption request for any pet you love. Track your request status in real time." color="amber" />
            <FeatureCard icon={BookOpen} title="Read blogs" desc="Stay informed with our pet care blog featuring tips, guides, and heartwarming stories." color="rose" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-12 text-center text-white">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold">Ready to find your companion?</h2>
          <p className="text-teal-100 mt-3">Create an account and start browsing pets available for adoption today.</p>
          <button onClick={() => onNavigate('/signup')} className="mt-8 bg-white text-teal-700 font-semibold px-8 py-3 rounded-xl hover:bg-teal-50 transition inline-flex items-center gap-2">Get started <ArrowRight className="w-5 h-5" /></button>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center"><PawPrint className="w-4 h-4" /></div><span className="font-semibold text-gray-900">PetEy</span></div>
          <p className="text-sm text-gray-400">Pet management platform</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: typeof Heart; title: string; desc: string; color: 'teal' | 'amber' | 'rose' }) {
  const colors = { teal: 'bg-teal-100 text-teal-600', amber: 'bg-amber-100 text-amber-600', rose: 'bg-rose-100 text-rose-600' };
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-5"><Icon className="w-7 h-7" /></div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}
