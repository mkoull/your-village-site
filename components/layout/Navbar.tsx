"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const Logo = () => (
  <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" width="26" height="26">
    <circle cx="32" cy="10" r="5.5" fill="currentColor" opacity="0.85" />
    <circle cx="51" cy="21" r="5.5" fill="currentColor" opacity="0.75" />
    <circle cx="51" cy="43" r="5.5" fill="currentColor" opacity="0.65" />
    <circle cx="32" cy="54" r="5.5" fill="currentColor" opacity="0.80" />
    <circle cx="13" cy="43" r="5.5" fill="currentColor" opacity="0.70" />
    <circle cx="13" cy="21" r="5.5" fill="currentColor" opacity="0.78" />
    <circle cx="32" cy="32" r="7" fill="var(--color-background)" />
  </svg>
);

const serviceLinks = [
  { label: "Food Support", href: "/services/food" },
  { label: "Postpartum Carers", href: "/services/postpartum-carers" },
  { label: "Counselling", href: "/services/counselling" },
  { label: "Cleaning", href: "/services/cleaning" },
  { label: "Sleep Consultants", href: "/services/sleep" },
  { label: "Lactation Consultants", href: "/services/lactation" },
  { label: "Life Support Services", href: "/services/life-admin" },
  { label: "Community Groups", href: "/services/community" },
];

const mainLinks = [
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close services dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showBg = scrolled || !isHome;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showBg
          ? "bg-background/90 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-colors text-text-primary"
        >
          <Logo />
          <span className="font-heading text-lg font-medium tracking-tight">
            Your Village
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {/* Services with dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-sage flex items-center gap-1",
                pathname.startsWith("/services") ? "text-sage" : "text-text-body"
              )}
              aria-expanded={servicesOpen}
            >
              Services
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={cn(
                  "transition-transform duration-200",
                  servicesOpen && "rotate-180"
                )}
              >
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-elevated rounded-[var(--radius-md)] border border-border shadow-lg py-2 animate-fade-in">
                <Link
                  href="/services"
                  className="block px-4 py-2.5 text-sm font-medium text-sage hover:bg-surface transition-colors"
                >
                  All Services
                </Link>
                <div className="border-t border-border-subtle my-1" />
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-text-body hover:text-sage hover:bg-surface transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Other links */}
          {mainLinks.slice(1).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-[15px] font-medium transition-colors hover:text-sage",
                  pathname === link.href ? "text-sage" : "text-text-body"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full bg-sage text-white hover:bg-sage-dark transition-all duration-200 hover:-translate-y-[1px] shadow-sm hover:shadow-md"
          >
            Talk to us
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-text-body"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-xl border-t border-border max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="px-6 py-8 flex flex-col gap-2">
            {/* Services section */}
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1 mt-2">
              Services
            </p>
            {serviceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] text-text-body hover:text-sage py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border my-4" />

            {/* Main links */}
            {mainLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-lg font-medium py-2 transition-colors",
                  pathname === link.href ? "text-sage" : "text-text-body"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/get-started"
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-7 py-3 text-base font-medium rounded-full bg-sage text-white hover:bg-sage-dark transition-all"
            >
              Talk to us
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
