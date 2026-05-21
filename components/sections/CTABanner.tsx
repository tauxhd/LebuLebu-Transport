import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="px-6 py-10 bg-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="bg-navy rounded-2xl px-8 py-12 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
            Ready to work with us?
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Get in touch today for a quote or to find out more about what
            LebuLebu Transport Services can do for your business.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-navy font-bold text-sm px-8 py-3.5 rounded hover:bg-gold-dark transition-colors duration-200"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </section>
  );
}