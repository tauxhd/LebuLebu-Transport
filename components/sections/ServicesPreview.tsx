import Link from "next/link";
import { Bus, Trash2, Hammer } from "lucide-react";

const services = [
  {
    icon: Bus,
    title: "Bus Services",
    description:
      "Safe, punctual, and comfortable bus transport for individuals, schools, and organisations across Port Moresby.",
    href: "/services#bus",
    available: true,
  },
  {
    icon: Trash2,
    title: "Garbage Collection",
    description:
      "Reliable scheduled waste collection for residential, commercial, and industrial clients throughout the city.",
    href: "/services#garbage",
    available: true,
  },
  {
    icon: Hammer,
    title: "Excavation & Machine Rental",
    description:
      "Heavy equipment solutions for construction and civil works. Coming soon to Port Moresby.",
    href: "/services#excavation",
    available: false,
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-offwhite py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            What we offer
          </p>
          <h2 className="text-charcoal text-3xl md:text-4xl font-bold mb-3">
            Our Services
          </h2>
          <p className="text-charcoal/50 text-sm max-w-lg">
            Trusted solutions for transport, waste management, and heavy works
            across Port Moresby.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white border border-charcoal/10 rounded-xl p-6 border-t-4 border-t-gold relative"
              >
                {!service.available && (
                  <span className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                    Coming Soon
                  </span>
                )}
                <div className="w-12 h-12 bg-navy/5 rounded-lg flex items-center justify-center mb-5">
                  <Icon size={22} className="text-navy" />
                </div>
                <h3 className="text-charcoal font-semibold text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-charcoal/50 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-navy font-semibold text-sm hover:text-gold transition-colors duration-200"
          >
            View all services →
          </Link>
        </div>
      </div>
    </section>
  );
}