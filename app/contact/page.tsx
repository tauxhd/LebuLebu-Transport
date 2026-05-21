import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | LebuLebu Transport Services",
  description:
    "Get in touch with LebuLebu Transport Services for a quote, booking, or general enquiry. Based in Port Moresby, Papua New Guinea.",
};

const contactInfo = [
  {
    icon: MapPin,
    title: "Location",
    detail: "Port Moresby, National Capital District, Papua New Guinea",
  },
  {
    icon: Phone,
    title: "Phone",
    detail: "+675 XXX XXXX",
  },
  {
    icon: Mail,
    title: "Email",
    detail: "info@lebulebutransport.com.pg",
  },
  {
    icon: Clock,
    title: "Business hours",
    detail: "Mon–Fri: 7:00am – 5:00pm\nSaturday: 8:00am – 12:00pm",
  },
];

const inputClass =
  "border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal bg-offwhite focus:outline-none focus:border-navy transition-colors duration-200";

export default function ContactPage() {
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
            <span className="text-gold">Contact</span>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-white/60 text-base max-w-xl leading-relaxed">
            Get in touch for a quote, a question, or to find out more about
            what LebuLebu Transport Services can do for you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-offwhite py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-white border border-charcoal/5 rounded-2xl p-8">
            <h2 className="text-charcoal font-bold text-xl mb-6">
              Send us a message
            </h2>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Full name</label>
                  <input type="text" placeholder="Your name" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Phone number</label>
                  <input type="tel" placeholder="+675 XXX XXXX" className={inputClass} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Email address</label>
                <input type="email" placeholder="you@example.com" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Service enquiry</label>
                <select className={inputClass}>
                  <option value="">Select a service</option>
                  <option value="bus">Bus Services</option>
                  <option value="garbage">Garbage Collection</option>
                  <option value="excavation">Excavation & Machine Rental</option>
                  <option value="general">General enquiry</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Message</label>
                <textarea
                  placeholder="Tell us about your needs..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="bg-navy text-white font-bold text-sm px-6 py-3.5 rounded-lg hover:bg-navy-light transition-colors duration-200 w-full"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
                Get in touch
              </p>
              <h2 className="text-charcoal text-2xl font-bold mb-2">
                We'd love to hear from you
              </h2>
              <p className="text-charcoal/50 text-sm leading-relaxed">
                Our team is based in Port Moresby and ready to assist with any
                enquiry, big or small.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex gap-4 items-start bg-white border border-charcoal/5 rounded-xl p-5"
                  >
                    <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-semibold text-sm mb-1">
                        {item.title}
                      </h4>
                      <p className="text-charcoal/50 text-sm leading-relaxed whitespace-pre-line">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-navy/10 border border-navy/10 rounded-xl h-40 flex items-center justify-center gap-2">
              <MapPin size={16} className="text-navy/40" />
              <p className="text-navy/40 text-sm">Port Moresby map coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}