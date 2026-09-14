"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import VillageNavLink from "@/components/village/VillageNavLink";
import VillageBrand from "@/components/ui/VillageBrand";
import { services } from "@/content/services";

const serviceLinks = services.map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
}));

const mainLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Costs", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const previousPath = useRef(pathname);
  const navRef = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const servicesButton = useRef<HTMLButtonElement>(null);

  function closeMenus() {
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handleClick(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mobileOpen) {
          setMobileOpen(false);
          menuButton.current?.focus();
        }
        if (servicesOpen) {
          setServicesOpen(false);
          servicesButton.current?.focus();
        }
      }
      if (mobileOpen && event.key === "Tab") {
        const focusable = Array.from(
          navRef.current?.querySelectorAll<HTMLElement>("a[href], button") ||
            [],
        ).filter((el) => el.getClientRects().length > 0);
        const first = focusable[0],
          last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen, servicesOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main, footer, [data-village-dock]",
      ),
    );
    const previous = elements.map((el) => el.inert);
    elements.forEach((el) => {
      el.inert = true;
    });
    return () => {
      elements.forEach((el, i) => {
        el.inert = previous[i];
      });
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      setMobileOpen(false);
      setServicesOpen(false);
    };
    media.addEventListener("change", onResize);
    return () => media.removeEventListener("change", onResize);
  }, []);

  const isCurrent = (href: string) =>
    pathname === href ||
    (href === "/services" && pathname.startsWith("/services/"));

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className={cn(
        "site-header",
        (scrolled || pathname !== "/") && "is-scrolled",
        mobileOpen && "is-menu-open",
      )}
    >
      <div className="site-header-inner">
        <Link
          href="/"
          aria-label="Your Village home"
          onClick={closeMenus}
          className="site-header-brand"
        >
          <VillageBrand variant="header" />
        </Link>

        <ul className="site-header-links">
          <li
            className="site-header-services"
            ref={dropdownRef}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setServicesOpen(false);
            }}
          >
            <Link
              href="/services"
              onClick={closeMenus}
              aria-current={isCurrent("/services") ? "page" : undefined}
              className="site-header-link"
            >
              Services
            </Link>
            <button
              ref={servicesButton}
              aria-label="Show service categories"
              aria-controls="services-menu"
              onClick={() => setServicesOpen(!servicesOpen)}
              className="site-header-dropdown-toggle"
              aria-expanded={servicesOpen}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {servicesOpen && (
              <div id="services-menu" className="site-header-dropdown">
                <Link
                  href="/services"
                  onClick={closeMenus}
                  className="site-header-all-services"
                >
                  Explore all support <span aria-hidden="true">&rarr;</span>
                </Link>
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
          {mainLinks.slice(1).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenus}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className="site-header-link"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="site-header-desktop-action">
          <VillageNavLink />
        </div>
        <div className="site-header-mobile-action">
          <VillageNavLink mobile onClick={closeMenus} />
        </div>
        <button
          ref={menuButton}
          aria-controls="mobile-menu"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setServicesOpen(false);
          }}
          className="site-header-menu-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <>
                <path d="m6 6 12 12" />
                <path d="M18 6 6 18" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="site-header-mobile-menu">
          <div className="site-header-mobile-content">
            <div className="site-header-mobile-primary">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                >
                  {link.label}
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
            <p className="site-header-menu-eyebrow">
              A little support, wherever you need it
            </p>
            <div className="site-header-mobile-services">
              {serviceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <Link
              href="/get-started"
              onClick={closeMenus}
              className="site-header-menu-cta"
            >
              Build my village <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
