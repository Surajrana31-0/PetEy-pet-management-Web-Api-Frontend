import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import AnimateIn from '@/app/_components/AnimateIn';

export default async function PublicBlogPage() {
  const articles = [
    {
      _id: '1',
      title: '10 Essential Tips for First-Time Dog Parents',
      snippet: 'Preparing your home for a new canine companion requires thoughtful planning, vaccination schedules, and proper nutrition...',
      author: 'PetEy Editorial Team',
      date: 'July 24, 2026',
    },
    {
      _id: '2',
      title: 'Understanding Feline Temperament & Behavior Signals',
      snippet: 'Cats communicate through subtle tail wags, ear postures, and vocal purrs. Learn how to decode your cat’s mood...',
      author: 'Dr. Rajesh Verma',
      date: 'July 20, 2026',
    },
    {
      _id: '3',
      title: 'The Psychological Benefits of Adopting a Rescue Pet',
      snippet: 'Scientific studies show that welcoming a rescue pet significantly lowers stress levels, encourages outdoor activity, and boosts daily happiness...',
      author: 'Samridhi Shrestha',
      date: 'July 15, 2026',
    },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <AnimateIn immediate>
            <span className="hero-eyebrow">Pet Care Guides & News</span>
            <h1 className="page-hero-title">PetEy Blog & Adoption Resources</h1>
            <p className="page-hero-desc">
              Expert pet health articles, adoption advice, and stories from our community of pet parents.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white">
        <div className="container">
          <div className="blog-grid">
            {articles.map((art, i) => (
              <AnimateIn key={art._id} delay={i * 100}>
                <article className="blog-card">
                  <div className="blog-card-content">
                    <span className="blog-card-author">{art.author}</span>
                    <h3 className="blog-card-title">{art.title}</h3>
                    <p className="blog-card-snippet">{art.snippet}</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-date">
                        <Calendar className="w-4 h-4" />
                        {art.date}
                      </span>
                      <Link href={`/blog/${art._id}`} className="blog-card-link">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
