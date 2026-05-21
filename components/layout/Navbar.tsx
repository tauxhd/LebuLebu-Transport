"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full z-50 sticky top-0 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md py-2 shadow-md shadow-black/5"
          : "bg-navy py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo — hides on scroll */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            scrolled ? "w-0 opacity-0 mr-0" : "w-40 opacity-100 mr-8"
          }`}
        >
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="LebuLebu Transport Services"
              width={200}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Desktop Links — shift left when logo hides */}
        <div
          className={`hidden md:flex items-center gap-8 transition-all duration-500 ${
            scrolled ? "mr-auto" : ""
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                pathname === link.href
                  ? scrolled
                    ? "text-navy"
                    : "text-gold"
                  : scrolled
                  ? "text-charcoal/50 hover:text-charcoal"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className={`text-sm font-bold px-5 py-2 rounded transition-all duration-300 ${
              scrolled
                ? "bg-navy text-white hover:bg-navy-light"
                : "bg-gold text-navy hover:bg-gold-dark"
            }`}
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden p-2 transition-colors duration-200 ${
            scrolled
              ? "text-charcoal/60 hover:text-charcoal"
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-6 py-5 flex flex-col gap-4 border-t transition-colors duration-300 ${
            scrolled
              ? "bg-white border-charcoal/10"
              : "bg-navy-dark border-white/10"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-1 transition-colors duration-200 ${
                pathname === link.href
                  ? scrolled
                    ? "text-navy font-medium"
                    : "text-gold font-medium"
                  : scrolled
                  ? "text-charcoal/50 hover:text-charcoal"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className={`text-sm font-bold px-5 py-2.5 rounded text-center transition-colors duration-200 mt-2 ${
              scrolled
                ? "bg-navy text-white hover:bg-navy-light"
                : "bg-gold text-navy hover:bg-gold-dark"
            }`}
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}