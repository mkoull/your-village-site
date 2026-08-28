import Link from "next/link";
import Container from "@/components/ui/Container";
import { services } from "@/content/services";

const Logo = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" width="26" height="26">
    <circle cx="32" cy="10" r="5.5" fill="currentColor" opacity="0.85" />
    <circle cx="51" cy="21" r="5.5" fill="currentColor" opacity="0.75" />
    <circle cx="51" cy="43" r="5.5" fill="currentColor" opacity="0.65" />
    <circle cx="32" cy="54" r="5.5" fill="currentColor" opacity="0.80" />
    <circle cx="13" cy="43" r="5.5" fill="currentColor" opacity="0.70" />
    <circle cx="13" cy="21" r="5.5" fill="currentColor" opacity="0.78" />
    <circle cx="32" cy="32" r="7" fill="var(--color-dark)" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark text-text-inverse">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo />
              <span className="font-heading text-lg font-medium">Your Village</span>
            </div>
            <p className="text-sm text-text-inverse/60 leading-relaxed max-w-xs">
              Postpartum support, thoughtfully curated.
              <br />
              Inner Melbourne, Australia.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-inverse/70 mb-4 font-body">
              Services
            </p>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-text-inverse/60 hover:text-text-inverse transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-inverse/70 mb-4 font-body">
              Company
            </p>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Pricing", href: "/pricing" },
                { label: "All Services", href: "/services" },
                { label: "Safety & Vetting", href: "/safety" },
                { label: "Privacy", href: "/privacy" },
                { label: "Contact", href: "/contact" },
                { label: "Join Waitlist", href: "/waitlist" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-inverse/60 hover:text-text-inverse transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get started */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-text-inverse/70 mb-4 font-body">
              Get Started
            </p>
            <p className="text-sm text-text-inverse/60 leading-relaxed mb-4">
              Start with a conversation. No pressure, no commitment.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-sage-deep text-white hover:bg-sage-dark transition-all"
            >
              Talk to us
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-inverse/60">
            &copy; {new Date().getFullYear()} Your Village. Melbourne, Australia.
          </p>
          <p className="text-xs text-text-inverse/60">
            Supporting families in inner Melbourne.
          </p>
        </div>
      </Container>
    </footer>
  );
}
