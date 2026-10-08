import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import VillageMark from "@/components/ui/VillageMark";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "The Village mobile app",
  description:
    "A calmer place to bring your support together. Meet the Village phone app in development, and start your village on the website today.",
};

const features = [
  [
    "Find your kind of help",
    "Explore practical support, specialists and community. Save what feels useful without losing your place.",
  ],
  [
    "Bring your people together",
    "Make room for the support already in your life, alongside the services you want to explore.",
  ],
  [
    "Take one small step",
    "Keep a simple plan. Edit it as life changes, record your progress and choose a gentle reminder when you need one.",
  ],
] as const;

export default function MobileAppPage() {
  return (
    <article className="mobile-intro">
      <Container>
        <div className="mobile-intro-hero">
          <div className="mobile-intro-copy">
            <p className="mobile-release-label">
              <span aria-hidden="true" />
              Phone app · In development
            </p>
            <h1>
              A little support.
              <br />
              <em>Close at hand.</em>
            </h1>
            <p className="mobile-intro-lead">
              The help you’re exploring. The people in your corner. One small
              next step. A calmer place to bring it all together.
            </p>
            <p className="mobile-intro-status">
              We’re preparing the first Village app for iPhone and Android. It
              isn’t available to download yet. You can start finding and saving
              support on the website today.
            </p>
            <div className="mobile-intro-actions">
              <Button href="/get-started">
                Start my village <span aria-hidden="true">→</span>
              </Button>
              <Link href="#inside-the-app" className="mobile-text-link">
                See what’s inside
              </Link>
            </div>
            <p className="mobile-intro-note">
              Free to explore. No account needed.
            </p>
          </div>
          <figure className="mobile-product-figure">
            <div
              className="mobile-product-frame"
              role="img"
              aria-label="Example app view: a private village with Meals, Care and Connection saved, and a next step to explore meal delivery."
            >
              <div className="mobile-product-top">
                <VillageMark className="mobile-product-mark" />
                <span>your village</span>
              </div>
              <p className="mobile-product-eyebrow">A LITTLE MORE SUPPORTED</p>
              <p className="mobile-product-title">
                A little less
                <br />
                on your plate.
              </p>
              <div className="mobile-product-next">
                <span>YOUR NEXT LITTLE STEP</span>
                <p>Explore meal delivery</p>
                <span className="mobile-product-next-foot">
                  One useful thing. At your pace.{" "}
                  <span aria-hidden="true">↗</span>
                </span>
              </div>
              <div className="mobile-product-circle">
                <VillageMark className="mobile-product-centre" />
                <p>You</p>
                <span>at the heart of it</span>
              </div>
              <div className="mobile-product-support">
                {["food", "postpartum-carers", "community"].map((slug) => {
                  const service = services.find((item) => item.slug === slug)!;
                  return (
                    <div key={slug}>
                      <span
                        className="mobile-product-icon"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: service.icon }}
                      />
                      <span>{service.shortTitle}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mobile-product-nav">
                <span>My village</span>
                <span>Explore</span>
                <span>My plan</span>
              </div>
            </div>
            <figcaption>
              Example app view · the experience is still being refined
            </figcaption>
          </figure>
        </div>
        <section
          id="inside-the-app"
          className="mobile-feature-section"
          aria-labelledby="mobile-features-heading"
        >
          <p className="mobile-product-eyebrow">ROOM FOR REAL LIFE</p>
          <h2 id="mobile-features-heading">Your support. Your pace.</h2>
          <div className="mobile-feature-grid">
            {features.map(([title, body], index) => (
              <div className="mobile-feature" key={title}>
                <span className="mobile-feature-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="mobile-privacy-card"
          aria-labelledby="mobile-privacy-heading"
        >
          <VillageMark className="mobile-privacy-mark" />
          <div>
            <p className="mobile-product-eyebrow">A SPACE OF YOUR OWN</p>
            <h2 id="mobile-privacy-heading">Your village stays with you.</h2>
            <p>
              The first phone version keeps your plan on your device. No
              account, automatic sharing or cloud sync. You choose what to
              share, and can clear your village at any time.
            </p>
            <p className="mobile-intro-note">
              Your website and phone villages are separate. Services handle
              their own enquiries, bookings and payments.
            </p>
            <div className="mobile-intro-actions">
              <Link href="/mobile-app/privacy" className="mobile-text-link">
                App privacy <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/mobile-app/support" className="mobile-text-link">
                App help <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </article>
  );
}
