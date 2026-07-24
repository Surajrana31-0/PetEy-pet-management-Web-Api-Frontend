import AnimateIn from '@/app/_components/AnimateIn';
import { AiMatcherPreview } from '@/components/pets/ai-matcher-preview';

export default function AiPreviewPage() {
  return (
    <>
      <section className="page-hero page-hero--ai">
        <div className="container">
          <AnimateIn immediate>
            <span className="hero-eyebrow">Powered by AI</span>
            <h1 className="page-hero-title">Find Your Perfect Pet Match</h1>
            <p className="page-hero-desc">
              Tell us about your lifestyle and preferences. Our AI analyzes compatibility
              to recommend pets that fit your home, routine, and personality.
            </p>
          </AnimateIn>
        </div>
      </section>

      <section className="section-white section-white--compact">
        <div className="container">
          <AiMatcherPreview />
        </div>
      </section>
    </>
  );
}
