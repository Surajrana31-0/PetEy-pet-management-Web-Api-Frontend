import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🐾</span>
              <span className="footer-logo-text">PET-EY</span>
            </div>
            <p className="footer-brand-desc">
              Connecting loving families with adorable pets. We believe every
              pet deserves a loving home and every family deserves the joy of
              a furry companion.
            </p>
            <div className="footer-socials">
              <Link href="#" className="footer-social-btn" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>
              <Link href="#" className="footer-social-btn" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </Link>
              <Link href="#" className="footer-social-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              {["Home", "Adopt a Pet", "About Us", "Contact", "Volunteer"].map((l) => (
                <li key={l}>
                  <Link href="#" className="footer-link">• {l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-col-title">Services</h4>
            <ul className="footer-links">
              {["Pet Care Tips", "Training Resources", "Veterinary Partners", "Foster Program", "Donate"].map((s) => (
                <li key={s}>
                  <Link href="#" className="footer-link">• {s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-row">
                <span className="footer-contact-icon">📍</span>
                <span className="footer-contact-text">
                  123 New Baneshower, Animal City, AC 12345
                </span>
              </div>
              <div className="footer-contact-row">
                <span className="footer-contact-icon">📞</span>
                <span className="footer-contact-text">+1 (977) 123-4567</span>
              </div>
              <div className="footer-contact-row">
                <span className="footer-contact-icon">✉️</span>
                <span className="footer-contact-text">info@pet_Ey.xs4.com</span>
              </div>
              <div className="emergency-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <div>
                  <div className="emergency-title">Emergency Pet Rescue:</div>
                  <div className="emergency-sub">Available 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 Pet-Ey. All rights reserved. Made with • for pets and their families.
          </p>
          <div className="footer-legal">
            <Link href="#" className="footer-legal-link">Privacy Policy</Link>
            <Link href="#" className="footer-legal-link">Terms of Service</Link>
            <Link href="#" className="footer-legal-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
