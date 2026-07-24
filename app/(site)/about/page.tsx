import Link from 'next/link';
import AnimateIn from '@/app/_components/AnimateIn';
import SafeImage from '@/app/_components/SafeImage';
import { HOME_IMAGES } from '@/lib/constants/home-images';

const values = [
  {
    icon: '💛',
    title: 'Compassion First',
    desc: 'Every pet deserves a loving home. We prioritize their wellbeing in every decision.',
  },
  {
    icon: '🤝',
    title: 'Thoughtful Matching',
    desc: 'We connect families with pets based on lifestyle, personality, and long-term fit.',
  },
  {
    icon: '🔬',
    title: 'AI-Powered Insights',
    desc: 'Smart recommendations help you find companions that truly match your home and routine.',
  },
  {
    icon: '🏡',
    title: 'Lifelong Support',
    desc: 'Adoption is just the beginning — we support families throughout their journey.',
  },
];

const milestones = [
  { value: '500+', label: 'Successful adoptions' },
  { value: '50+', label: 'Partner shelters' },
  { value: '8+', label: 'Years of service' },
  { value: '120+', label: 'Active volunteers' },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <AnimateIn immediate>
            <span className="hero-eyebrow">Our story</span>
            <h1 className="page-hero-title">Connecting Hearts, One Paw at a Time</h1>
            <p className="page-hero-desc">
              PetEy was founded with a simple belief: every pet deserves a forever home,
              and every family deserves the joy of a loving companion.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white">
        <div className="container about-mission">
          <AnimateIn>
            <div className="about-mission-text">
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 16 }}>
                Our Mission
              </h2>
              <p>
                We bridge the gap between shelters, rescue organizations, and families
                looking to adopt. By combining compassionate care with modern technology —
                including AI-powered matching — we make adoption simpler, smarter, and more
                rewarding for everyone involved.
              </p>
              <p>
                Whether you&apos;re a first-time adopter or adding another member to your
                family, PetEy guides you through every step with transparency and support.
              </p>
              <Link href="/adopt" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
                Browse available pets
              </Link>
            </div>
          </AnimateIn>
          <AnimateIn direction="scale" delay={100}>
            <div className="about-mission-image">
              <SafeImage
                src={HOME_IMAGES.heroAccent}
                alt="Person bonding with their adopted pet"
                width={480}
                height={400}
                sizes="(max-width: 768px) 100vw, 480px"
                className="rounded-2xl object-cover w-full"
              />
            </div>
          </AnimateIn>
        </div>
      </section>

      <section className="section-tinted">
        <div className="container">
          <AnimateIn>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">
              Our values shape every adoption, every match, and every family we serve.
            </p>
          </AnimateIn>
          <div className="values-grid">
            {values.map((v, i) => (
              <AnimateIn key={v.title} delay={i * 80}>
                <div className="value-card">
                  <div className="value-icon">{v.icon}</div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-white">
        <div className="container">
          <AnimateIn>
            <h2 className="section-title">Our Impact</h2>
          </AnimateIn>
          <div className="stats-grid">
            {milestones.map((m, i) => (
              <AnimateIn key={m.label} delay={i * 60}>
                <div className="stat-card stat-card--hover">
                  <div className="stat-value">{m.value}</div>
                  <div className="stat-label">{m.label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section cta-section--animated">
        <div className="cta-overlay" aria-hidden />
        <div className="container cta-inner">
          <AnimateIn direction="scale">
            <h2 className="cta-heading">Ready to make a difference?</h2>
            <p className="cta-desc">
              Join our community of adopters, volunteers, and partners working to give
              every pet the home they deserve.
            </p>
            <div className="cta-buttons">
              <Link href="/register" className="cta-btn-white">Get started</Link>
              <Link href="/contact" className="btn-primary">Contact us</Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
