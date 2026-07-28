import Link from 'next/link';

export default function DashboardFooter() {
  return (
    <footer className="dash-footer">
      <div className="dash-footer-inner">
        <div className="dash-footer-brand">
          <span className="dash-footer-logo">🐾 PetEy</span>
          <span className="dash-footer-copy">© 2024 PetEy. All rights reserved.</span>
        </div>
        <div className="dash-footer-links">
          <Link href="/" className="dash-footer-link">Home</Link>
          <Link href="/about" className="dash-footer-link">About</Link>
          <Link href="/contact" className="dash-footer-link">Contact</Link>
          <Link href="/blog" className="dash-footer-link">Blog</Link>
        </div>
      </div>
    </footer>
  );
}
