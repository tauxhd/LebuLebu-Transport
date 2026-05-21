import BookingToggle from "./BookingToggle";

export default function PrivateTrack() {
  return (
    <section className="bg-offwhite py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">
          For businesses
        </p>
        <h2 className="text-charcoal text-3xl font-bold mb-2">
          Book or estimate our services
        </h2>
        <p className="text-charcoal/50 text-sm mb-10 max-w-xl">
          Choose between a one-time booking for a single job, or a contract
          estimate for ongoing services. All prices are indicative — our team
          will confirm final pricing.
        </p>
        <BookingToggle />
      </div>
    </section>
  );
}