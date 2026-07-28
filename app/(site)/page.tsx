import Link from 'next/link';
import AnimateIn from '@/app/_components/AnimateIn';
import SafeImage from '@/app/_components/SafeImage';
import { petsApi } from '@/lib/api/pets';
import { HOME_IMAGES, getPetImage } from '@/lib/constants/home-images';
import { PetSpecies, PetStatus, type IPet } from '@/lib/types/pet';
import { getCurrentUser } from '@/lib/auth/session';

type FeaturedPet = {
  _id: string;
  name: string;
  age: string;
  breed: string;
  species: PetSpecies;
  description: string;
  status: PetStatus;
  image: string;
};

const stats = [
  { value: '500+', label: 'Happy Adoptions', icon: '🏠' },
  { value: '120+', label: 'Active Volunteers', icon: '🤝' },
  { value: '50+', label: 'Partner Shelters', icon: '🏥' },
  { value: '8+', label: 'Years of Care', icon: '⭐' },
];

const steps = [
  {
    number: '1',
    title: 'Browse Pets',
    desc: 'Explore our database of adorable pets waiting for their forever homes.',
    icon: '🔍',
  },
  {
    number: '2',
    title: 'Meet & Greet',
    desc: 'Schedule a visit to meet your potential new family member in person.',
    icon: '💛',
  },
  {
    number: '3',
    title: 'Adoption Process',
    desc: 'Complete our simple, caring adoption process with full support.',
    icon: '📋',
  },
  {
    number: '4',
    title: 'Welcome Home',
    desc: 'Bring your companion home and enjoy lifelong support from PetEy.',
    icon: '🏡',
  },
];

const testimonials = [
  {
    quote:
      'Adopting through PetEy was the best decision we ever made. The team made everything smooth and supportive.',
    name: 'Bhim Bahadur Rana',
    role: 'Adopted a Golden Retriever',
    image: HOME_IMAGES.testimonials[0],
  },
  {
    quote:
      'Our cat has brought so much joy to our family. The matching process was thoughtful and caring.',
    name: 'Samridhi Shrestha',
    role: 'Adopted a Persian Cat',
    image: HOME_IMAGES.testimonials[1],
  },
  {
    quote:
      'The staff truly cares about matching pets with the right families. Our Buddy is living his best life!',
    name: 'Sujan Shrestha',
    role: 'Adopted a German Shepherd',
    image: HOME_IMAGES.testimonials[2],
  },
];

const fallbackPets: FeaturedPet[] = [
  {
    _id: '1',
    name: 'Luna',
    age: '2 years',
    breed: 'Golden Retriever',
    species: PetSpecies.DOG,
    description: 'Friendly and energetic, loves playing fetch and swimming.',
    status: PetStatus.AVAILABLE,
    image: HOME_IMAGES.featured[0],
  },
  {
    _id: '2',
    name: 'Milo',
    age: '1 year',
    breed: 'Persian Cat',
    species: PetSpecies.CAT,
    description: 'Gentle and affectionate, perfect for a calm household.',
    status: PetStatus.AVAILABLE,
    image: HOME_IMAGES.featured[1],
  },
  {
    _id: '3',
    name: 'Rocky',
    age: '3 years',
    breed: 'German Shepherd',
    species: PetSpecies.DOG,
    description: 'Loyal and protective, great with kids and families.',
    status: PetStatus.AVAILABLE,
    image: HOME_IMAGES.featured[2],
  },
  {
    _id: '4',
    name: 'Cleo',
    age: '6 months',
    breed: 'Siamese Cat',
    species: PetSpecies.CAT,
    description: 'Playful kitten who loves cuddles and chasing toys.',
    status: PetStatus.AVAILABLE,
    image: HOME_IMAGES.featured[3],
  },
];

async function getFeaturedPets(): Promise<FeaturedPet[]> {
  try {
    const response = await petsApi.getAll(PetStatus.AVAILABLE);
    if (response.success && response.data && response.data.pets && response.data.pets.length > 0) {
      return response.data.pets.slice(0, 4).map((pet: IPet, index: number) => ({
        _id: pet._id,
        name: pet.name,
        age: pet.age,
        breed: pet.breed,
        species: pet.species,
        description: pet.description,
        status: pet.status,
        image: getPetImage(pet.species, index),
      }));
    }
  } catch {
    // Fall back to curated static pets when API is unavailable
  }
  return fallbackPets;
}

export default async function HomePage() {
  const pets = await getFeaturedPets();
  const user = await getCurrentUser();

  return (
    <>
      {/* HERO */}
      <section className="hero-section hero-section--animated">
        <div className="hero-bg-blob hero-bg-blob--1" aria-hidden />
        <div className="hero-bg-blob hero-bg-blob--2" aria-hidden />

        <div className="container hero-inner">
          <AnimateIn className="hero-text" immediate>
            <span className="hero-eyebrow">Pet Adoption Platform</span>
            <h1 className="hero-heading">
              Find Your
              <br />
              <span className="hero-accent">Perfect Companion</span>
            </h1>
            <p className="hero-desc">
              Connect with loving pets looking for their forever homes. Every adoption
              creates a beautiful story of love, companionship, and happiness.
            </p>
            <div className="hero-cta">
              <Link href={user ? "/adopt" : "/register"} className="btn-primary hero-btn-pulse">
                {user ? "Browse Pets" : "Start Adopting"}
              </Link>
              {!user && <Link href="/login" className="btn-outline">Sign In →</Link>}
            </div>
          </AnimateIn>

          <AnimateIn direction="scale" delay={150} className="hero-visual" immediate>
            <div className="hero-image-stack">
              <div className="hero-image-main float-slow">
                <SafeImage
                  src={HOME_IMAGES.hero}
                  alt="Happy golden retriever ready for adoption"
                  width={320}
                  height={320}
                  priority
                  sizes="(max-width: 768px) 220px, 320px"
                  className="hero-img"
                />
              </div>
              <div className="hero-image-accent float-slow-reverse">
                <SafeImage
                  src={HOME_IMAGES.heroAccent}
                  alt="Person hugging their adopted pet"
                  width={120}
                  height={120}
                  sizes="120px"
                  className="hero-img"
                />
              </div>
              <div className="hero-badge-float">
                <span>🐾</span>
                <div>
                  <strong>500+</strong>
                  <small>Adoptions</small>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>

        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <AnimateIn key={s.label} delay={i * 80}>
                <div className="stat-card stat-card--hover">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PETS */}
      <section className="section-white">
        <div className="container">
          <AnimateIn>
            <h2 className="section-title">Meet Our Featured Pets</h2>
            <p className="section-subtitle">
              These adorable companions are ready to bring joy and love to your family.
              Each one has been carefully cared for and is waiting for their perfect match.
            </p>
          </AnimateIn>

          <div className="pets-grid">
            {pets.map((pet, i) => (
              <AnimateIn key={pet._id} delay={i * 100}>
                <article className="pet-card pet-card--animated">
                  <div className="pet-image-wrap">
                    <SafeImage
                      src={pet.image}
                      alt={`${pet.name} - ${pet.breed}`}
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="pet-image"
                    />
                    <div className="pet-image-overlay" />
                    <span className="pet-age-badge">{pet.age}</span>
                    <span className="pet-species-badge">{pet.species}</span>
                  </div>
                  <div className="pet-info">
                    <span className="pet-name">{pet.name}</span>
                    <div className="pet-breed">{pet.breed}</div>
                    <p className="pet-desc">{pet.description}</p>
                    <Link href={`/pets/${pet._id}`} className="btn-primary pet-meet-btn">
                      Meet {pet.name}
                    </Link>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={200}>
            <div className="view-all-wrap">
              <Link href="/adopt" className="view-all-link">Browse All Pets →</Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-tinted">
        <div className="container">
          <AnimateIn>
            <h2 className="section-title">How Pet Adoption Works</h2>
            <p className="section-subtitle">
              Our simple and caring adoption process ensures the perfect match between pets
              and families. We&apos;re here to support you every step of the way.
            </p>
          </AnimateIn>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <AnimateIn key={step.title} delay={i * 100}>
                <div className="step-card step-card--animated">
                  <div className="step-number">{step.number}</div>
                  <div className="step-icon-box">{step.icon}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-white">
        <div className="container">
          <AnimateIn>
            <h2 className="section-title">Happy Adoption Stories</h2>
            <p className="section-subtitle">
              Real families sharing their experience with PetEy.
            </p>
          </AnimateIn>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 120}>
                <div className="testimonial-card testimonial-card--animated">
                  <div className="stars">★★★★★</div>
                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testimonial-author">
                    <SafeImage
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      sizes="48px"
                      className="testimonial-avatar-img"
                    />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section cta-section--animated">
        <SafeImage
          src={HOME_IMAGES.cta}
          alt=""
          fill
          sizes="100vw"
          className="cta-bg-image"
          aria-hidden
        />
        <div className="cta-overlay" aria-hidden />
        <div className="container cta-inner">
          <AnimateIn direction="scale">
            <h2 className="cta-heading">Ready to Find Your Perfect Companion?</h2>
            <p className="cta-desc">
              Join thousands of happy families who found their perfect pets through PetEy.
              Start your adoption journey today.
            </p>
            <div className="cta-buttons">
              <Link href={user ? "/adopt" : "/register"} className="cta-btn-white">
                {user ? "Browse Pets" : "Create Free Account"}
              </Link>
              {!user && <Link href="/login" className="btn-primary">Sign In</Link>}
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
