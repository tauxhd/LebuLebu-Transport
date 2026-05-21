import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | LebuLebu Transport Services",
  description:
    "Learn about LebuLebu Transport Services — a Port Moresby company built on hard work, local knowledge, and a commitment to service excellence.",
};

const values = [
  {
    number: "01",
    icon: Shield,
    title: "Reliability",
    description:
      "We deliver on our promises — every route, every pickup, every job. Our clients count on us and we never let them down.",
  },
  {
    number: "02",
    icon: Clock,
    title: "Responsibility",
    description:
      "We care about our environment, our people, and our community. Every service we provide is done with care and accountability.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Readiness",
    description:
      "We are always prepared to respond, adapt, and grow with Port Moresby's evolving infrastructure and community needs.",
  },
];

const team = [
  { initials: "VG", name: "Victor Gabi", role: "Founder & CEO" },
  { initials: "RM", name: "Rauwin Mula", role: "Operations Manager" },
  { initials: "TG", name: "Tahiti Gabi", role: "Accountant" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>
            <span>›</span>
            <span className="text-gold">About Us</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            About LebuLebu
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            A Port Moresby company built on hard work, local knowledge, and a
            commitment to service excellence across Papua New Guinea.
          </p>
        </div>
      </section>

      {/* Story + Values */}
      <section className="bg-offwhite py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
              Our story
            </p>
            <h2 className="text-charcoal text-3xl font-bold mb-6">
              Built for Port Moresby
            </h2>
            <div className="flex flex-col gap-4 text-charcoal/60 text-sm leading-relaxed">
              <p>
                LebuLebu Transport Services was founded with a simple mission:
                to provide Port Moresby with transport and infrastructure
                services that are reliable, professional, and community-focused.
              </p>
              <p>
                Starting with bus services, we quickly expanded into waste
                management to meet the growing needs of the city. We are now
                preparing to launch our excavation and machine rental division
                — bringing even more capacity to PNG's infrastructure sector.
              </p>
              <p>
                We are proud to be a local business serving our local community.
                Every job we take on is a commitment to the people and places
                that make Port Moresby home.
              </p>
            </div>
          </div>

          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">
              Our values
            </p>
            <h2 className="text-charcoal text-3xl font-bold mb-6">
              What drives us
            </h2>
            <div className="flex flex-col gap-4">
              {values.map((v) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.number}
                    className="flex gap-4 items-start bg-white border border-charcoal/5 rounded-xl p-5"
                  >
                    <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-semibold text-sm mb-1">
                        {v.title}
                      </h4>
                      <p className="text-charcoal/50 text-sm leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Our people
          </p>
          <h2 className="text-charcoal text-3xl font-bold mb-10">
            Meet the team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-offwhite border border-charcoal/5 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-lg mx-auto mb-4">
                  {member.initials}
                </div>
                <h4 className="text-charcoal font-semibold text-sm mb-1">
                  {member.name}
                </h4>
                <p className="text-charcoal/50 text-xs">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-offwhite px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy rounded-2xl px-8 py-12 text-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
              Want to work with us?
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
              Whether you need a one-time job or an ongoing contract, we are
              ready to help.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold text-navy font-bold text-sm px-8 py-3.5 rounded hover:bg-gold-dark transition-colors duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}