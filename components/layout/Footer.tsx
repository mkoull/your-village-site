import VillageMark from "@/components/ui/VillageMark";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { services } from "@/content/services";

export default function Footer() {
  return (
    <footer className="bg-dark text-text-inverse pb-28">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <VillageMark className="w-[26px] h-[26px]" />
              <span className="font-heading text-lg font-medium">
                Your Village
              </span>
            </div>
            <p className="text-sm text-text-inverse/60 leading-relaxed max-w-xs">
              Support for you and your family.
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
              Find the support that fits your life.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-sage-deep text-white hover:bg-sage-dark transition-all"
            >
              Build my village
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-inverse/60">
            &copy; {new Date().getFullYear()} Your Village. Melbourne,
            Australia.
          </p>
          <p className="text-xs text-text-inverse/60">
            Supporting families in inner Melbourne.
          </p>
        </div>
      </Container>
    </footer>
  );
}
