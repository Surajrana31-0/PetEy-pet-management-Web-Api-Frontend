import Link from 'next/link';
import AnimateIn from '@/app/_components/AnimateIn';

const contactMethods = [
  {
    icon: '📍',
    title: 'Visit us',
    detail: '123 New Baneshower, Animal City, AC 12345',
  },
  {
    icon: '📞',
    title: 'Call us',
    detail: '+1 (977) 123-4567',
  },
  {
    icon: '✉️',
    title: 'Email us',
    detail: 'info@petey.com',
  },
  {
    icon: '🕐',
    title: 'Hours',
    detail: 'Mon–Sat 9am–6pm · Emergency rescue 24/7',
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <AnimateIn immediate>
            <span className="hero-eyebrow">Get in touch</span>
            <h1 className="page-hero-title">We&apos;d Love to Hear From You</h1>
            <p className="page-hero-desc">
              Questions about adoption, volunteering, or partnerships? Our team is here to help.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white">
        <div className="container">
          <div className="contact-grid">
            {contactMethods.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 80}>
                <div className="contact-card">
                  <span className="contact-icon" aria-hidden>{item.icon}</span>
                  <h3 className="contact-title">{item.title}</h3>
                  <p className="contact-detail">{item.detail}</p>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={200}>
            <div className="contact-emergency">
              <div className="emergency-badge">
                <span aria-hidden>🚨</span>
                <div>
                  <div className="emergency-title">Emergency Pet Rescue</div>
                  <div className="emergency-sub">Available 24/7 — call our hotline immediately</div>
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={300}>
            <div className="contact-cta">
              <p>Looking to adopt? Start by browsing our available pets.</p>
              <Link href="/adopt" className="btn-primary">Browse pets</Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
