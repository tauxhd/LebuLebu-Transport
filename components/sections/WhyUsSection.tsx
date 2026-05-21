const reasons = [
  {
    title: "Local expertise",
    description:
      "Deep knowledge of Port Moresby's roads, communities, and logistics needs built over years of service.",
  },
  {
    title: "Punctual & dependable",
    description:
      "We show up on time, every time. No excuses, just results you can count on.",
  },
  {
    title: "Safety first",
    description:
      "All vehicles and equipment are regularly inspected and maintained to the highest standards.",
  },
  {
    title: "Growing service range",
    description:
      "Continuously expanding our fleet and capabilities to serve more of PNG's infrastructure needs.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
            Why choose us
          </p>
          <h2 className="text-charcoal text-3xl md:text-4xl font-bold mb-3">
            Reliable. Responsible. Ready.
          </h2>
          <p className="text-charcoal/50 text-sm max-w-lg">
            We are built on trust, safety, and a commitment to Port Moresby's
            growth and community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex gap-4 items-start p-5 bg-offwhite rounded-xl border border-charcoal/5"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <div>
                <h4 className="text-charcoal font-semibold text-sm mb-1.5">
                  {reason.title}
                </h4>
                <p className="text-charcoal/50 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}