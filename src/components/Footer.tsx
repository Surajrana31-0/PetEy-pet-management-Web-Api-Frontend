import { Link } from 'react-router-dom';
import { PawPrint, Github, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container-app section-padding py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Poppins, sans-serif' }}>PetEy</span>
            </div>
            <p className="mt-4 text-sm text-stone-600 leading-relaxed">Connecting loving homes with pets in need. Every adoption makes a difference.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/pets" className="text-stone-600 hover:text-teal-600 transition-colors">Browse Pets</Link></li>
              <li><Link to="/pets?species=DOG" className="text-stone-600 hover:text-teal-600 transition-colors">Dogs</Link></li>
              <li><Link to="/pets?species=CAT" className="text-stone-600 hover:text-teal-600 transition-colors">Cats</Link></li>
              <li><Link to="/ai-chat" className="text-stone-600 hover:text-teal-600 transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Account</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link to="/login" className="text-stone-600 hover:text-teal-600 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-stone-600 hover:text-teal-600 transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="text-stone-600 hover:text-teal-600 transition-colors">My Profile</Link></li>
              <li><Link to="/favorites" className="text-stone-600 hover:text-teal-600 transition-colors">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Connect</h3>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-600"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-600"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-600"><Github className="h-5 w-5" /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-600"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-center">
          <p className="text-sm text-stone-500">© {new Date().getFullYear()} PetEy. Made with care for pets and their humans.</p>
        </div>
      </div>
    </footer>
  );
}
