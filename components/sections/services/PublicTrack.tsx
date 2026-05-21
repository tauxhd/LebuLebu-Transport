import Link from "next/link";
import { Bus, Trash2, Hammer, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Bus,
    title: "Bus Services",
    subtitle: "Public passenger transport",
    description:
      "Contracted bus services for government agencies, public schools, and community transport programmes in the National Capital District.",
    features: [
      "Government staff shuttle routes",
      "Public school transport contracts",
      "Community route servicing",
      "Event & public function transport",
      "Fleet available for tender",
    ],
    available: true,
  },
  {
    icon: Trash2,
    title: "Garbage Collection",
    subtitle: "Public waste management",
    description:
      "Structured, reliable waste collection and sanitation services for local-level governments and public institutions.",
    features: [
      "LLG waste collection contracts",
      "Public facility servicing",
      "Disaster clean-up response",
      "Bulk waste removal",
      "Environmentally compliant disposal",
    ],
    available: true,
  },
  {
    icon: Hammer,
    title: "Excavation & Equipment",
    subtitle: "Civil & infrastructure works",
    description:
      "Coming soon — heavy equipment support for public infrastructure and civil engineering projects across PNG.",
    features: [
      "Road & drainage excavation",
      "Public works machinery support",
      "Government project equipment hire",
    ],
    available: false,
  },
];

export default function PublicTrack() {
  return (
    <section className="bg-offwhite py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-charcoal/50 text-sm leading-relaxed max-w-2xl mb-12">
          LebuLebu Transport Services partners with government agencies and
          public institutions across Papua New Guinea. We provide dependable,
          large-scale transport, sanitation, and infrastructure services to
          support public works and community wellbeing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden"
              >
                <div className="bg-navy px-5 py-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      {service.title}
                    </h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      {service.subtitle}
                    </p>
                  </div>
                  {!service.available && (
                    <span className="bg-amber-400/20 text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                      Soon
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-charcoal/50 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {service.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-charcoal/60 border-b border-charcoal/5 pb-2 last:border-none last:pb-0"
                      >
                        <CheckCircle2 size={13} className="text-gold shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-[#EEF2F8] border border-[#C8D5E8] rounded-2xl px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-navy font-bold text-lg mb-2">
              Interested in a government or public contract?
            </h3>
            <p className="text-charcoal/50 text-sm max-w-lg">
              Contact our team to discuss your agency's requirements. We are
              experienced in tender processes and can provide all necessary
              documentation.
            </p>
          </div>
          <Link
            href="/contact"
            className="bg-navy text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-navy-light transition-colors duration-200 whitespace-nowrap"
          >
            Request a Contract
          </Link>
        </div>
      </div>
    </section>
  );
}