import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

const services = [
  { label: "Bus Services", href: "/services#bus" },
  { label: "Garbage Collection", href: "/services#garbage" },
  { label: "Excavation & Rental", href: "/services#excavation" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Get a Quote", href: "/contact" },
];

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#111827] px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo.png"
                alt="LebuLebu Transport Services"
                width={140}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-gold text-sm mb-3 font-medium">
              Reliable. Responsible. Ready.
            </p>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              Serving Port Moresby with professional transport, waste collection,
              and heavy equipment solutions for businesses and communities across
              Papua New Guinea.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white/50 text-xs uppercase tracking-widest mb-4 font-medium">
              Services
            </h4>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/50 text-xs uppercase tracking-widest mb-4 font-medium">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {company.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-white/50 text-sm hover:text-white transition-colors duration-200"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <MapPin size={13} />
                <span>Port Moresby, NCD, Papua New Guinea</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Phone size={13} />
                <span>+675 XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Mail size={13} />
                <span>info@lebulebutransport.com.pg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0c1421] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} LebuLebu Transport Services. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Port Moresby, Papua New Guinea
          </p>
        </div>
      </div>
    </footer>
  );
}