import Link from "next/link";

export default function HomePage() {
  const stats = [
    { value: "50+",  label: "Happy Adoptions" },
    { value: "120+", label: "Active Volunteers" },
    { value: "50+",  label: "Partner Shelters" },
    { value: "5+",   label: "Years Experience" },
  ];

  const pets = [
    { id: "oho",  name: "OHO",  age: "2 year",   breed: "Golden Retriever • Dog", desc: "Friendly and energetic, loves playing fetch and swimming.",  emoji: "🐕" },
    { id: "coco", name: "COCO", age: "1 year",   breed: "Persian • Cat",          desc: "Gentle and affectionate, perfect for a calm household.",      emoji: "🐈" },
    { id: "max",  name: "MAX",  age: "2 year",   breed: "German Shepherd • Dog",  desc: "Loyal and protective, great with kids and families.",          emoji: "🐕" },
    { id: "susi", name: "SUSI", age: "4 months", breed: "Siamese • Cat",          desc: "Playful kitten, loves cuddles and chasing.",                   emoji: "🐈" },
  ];

  const steps = [
    {
      number: "1", title: "Browse Pets",
      desc: "Explore our database of adorable pets waiting for their forever homes.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    },
    {
      number: "2", title: "Meet & Greet",
      desc: "Schedule a visit to meet your potential new family member.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    },
    {
      number: "3", title: "Adoption Process",
      desc: "Complete our simple adoption process and take your pet home.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      number: "4", title: "Welcome Home",
      desc: "Enjoy life with your new companion and ongoing support from us.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    },
  ];

  const testimonials = [
    { quote: "Adopting OHO was the best decision we ever made. The team at PawHaven made the process so smooth and supportive.", name: "Bhim Bahadur Rana",   role: "Happy Pet Parent", emoji: "👤" },
    { quote: "COCO has brought so much joy to our family. The adoption process was thorough but caring. Highly recommend!",      name: "Samridhi Shrestha", role: "Happy Pet Parent", emoji: "👤" },
    { quote: "The staff truly cares about matching pets with the right families. Our Buddy is living his best life with us!",    name: "Sujan Shrestha",    role: "Happy Pet Parent", emoji: "👤" },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-text fade-up">
            <h1 className="hero-heading">
              Find Your<br />
              <span className="hero-accent">Perfect<br />Companion</span>
            </h1>
            <p className="hero-desc">
              Connect with loving pets looking for their forever homes.
              Every adoption creates a beautiful story of love,
              companionship, and happiness.
            </p>
            <div className="hero-cta">
              <Link href="/browse" className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Find Pets
              </Link>
              <Link href="/about" className="btn-outline">Learn More →</Link>
            </div>
          </div>

          <div className="hero-image-wrap fade-up delay-2">
            <div className="hero-image-placeholder">🐕</div>
          </div>
        </div>

        {/* Stats */}
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={s.label} className={`stat-card fade-up delay-${i + 1}`}>
                <div className="stat-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PETS ── */}
      <section className="section-white">
        <div className="container">
          <h2 className="section-title">Meet Our Featured Pets</h2>
          <p className="section-subtitle">
            These adorable companions are ready to bring joy and love to your family.
            Each one has been carefully cared for and is waiting for their perfect match.
          </p>

          <div className="pets-grid">
            {pets.map((pet, i) => (
              <div key={pet.id} className={`pet-card fade-up delay-${i + 1}`}>
                <div className="pet-image-wrap">
                  <div className="pet-image-placeholder">{pet.emoji}</div>
                  <button className="pet-fav-btn" aria-label="Save to favourites">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                  <span className="pet-age-badge">{pet.age}</span>
                </div>
                <div className="pet-info">
                  <span className="pet-name">{pet.name}</span>
                  <div className="pet-breed">{pet.breed}</div>
                  <p className="pet-desc">{pet.desc}</p>
                  <Link href={`/browse/${pet.id}`} className="btn-primary pet-meet-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Meet {pet.name.charAt(0) + pet.name.slice(1).toLowerCase()}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-wrap">
            <Link href="/browse" className="view-all-link">View All Available Pets →</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section-tinted">
        <div className="container">
          <h2 className="section-title">How Pet Adoption Works</h2>
          <p className="section-subtitle">
            Our simple and caring adoption process ensures the perfect match between pets and
            families. We&apos;re here to support you every step of the way.
          </p>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={step.title} className={`step-card fade-up delay-${i + 1}`}>
                <div className="step-number">{step.number}</div>
                <div className="step-icon-box">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-white">
        <div className="container">
          <h2 className="section-title">Happy Adoption Stories</h2>
          <p className="section-subtitle">
            Read what our happy families have to say about their adoption experience.
          </p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testimonial-card fade-up delay-${i + 1}`}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <svg key={si} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d1d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.emoji}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="cta-heading">Ready to Find Your Perfect Companion?</h2>
          <p className="cta-desc">
            Join thousands of happy families who have found their perfect pets through PawHaven.
            Start your adoption journey today and experience the unconditional love of a furry friend.
          </p>
          <div className="cta-buttons">
            <Link href="/browse" className="cta-btn-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Browse Available Pets
            </Link>
            <Link href="/register" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Join Our Community
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}