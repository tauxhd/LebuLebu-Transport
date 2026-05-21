import type { Metadata } from "next";
import Link from "next/link";
import ServicesTabs from "@/components/sections/services/ServicesTabs";

export const metadata: Metadata = {
  title: "Services | LebuLebu Transport Services",
  description:
    "Bus services, garbage collection, and excavation & machine rental in Port Moresby, Papua New Guinea. View public and private service options.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link
              href="/"
              className="hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <span>›</span>
            <span className="text-gold">Services</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Serving Port Moresby's public sector and private businesses with
            transport, waste management, and heavy equipment solutions.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <ServicesTabs />
    </>
  );
}