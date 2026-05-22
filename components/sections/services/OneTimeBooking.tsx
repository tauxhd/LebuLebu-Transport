"use client";

import { useState, useEffect } from "react";
import { Bus, Trash2, Hammer, Info, AlertTriangle, Calendar } from "lucide-react";

type ServiceKey = "bus" | "garbage" | "excavation";

interface ExcavationConfig {
  extraHourlyRate: number;
  maxUnits: number;
  maxHoursPerDay: number;
  minHoursPerDay: number;
  maxDays: number;
  operatorMultiplier: number;
  yearlyDiscount: number;
  equipmentRates: {
    excavator_standard: number;
    excavator_large: number;
    backhoe: number;
    bulldozer: number;
    compactor: number;
  };
}

interface BusConfig {
  baseRatePerBusPerDay: number;
  extraHourlyRate: number;
  maxBuses: number;
  maxHoursPerDay: number;
  minHoursPerDay: number;
  routeMultipliers: { standard: number; extended: number; remote: number };
}

interface GarbageConfig {
  baseRatePerTruckPerWeek: number;
  maxTrucks: number;
  maxCollectionsPerWeek: number;
  volumeMultipliers: { small: number; medium: number; large: number };
  typeMultipliers: { general: number; mixed: number; hazardous: number };
}

interface Pricing {
  bus: BusConfig;
  garbage: GarbageConfig;
  excavation: ExcavationConfig;
}

const tabs = [
  { key: "bus" as ServiceKey, icon: Bus, label: "Bus" },
  { key: "garbage" as ServiceKey, icon: Trash2, label: "Garbage" },
  { key: "excavation" as ServiceKey, icon: Hammer, label: "Excavation" },
];

function fmt(n: number) {
  return "K " + n.toLocaleString();
}

export default function OneTimeBooking() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [activeTab, setActiveTab] = useState<ServiceKey>("bus");
  const [showInquiry, setShowInquiry] = useState(false);

  const [busDate, setBusDate] = useState("");
  const [busCount, setBusCount] = useState(1);
  const [busDur, setBusDur] = useState(8);
  const [busRoute, setBusRoute] = useState<"standard" | "extended" | "remote">("standard");

  const [gbDate, setGbDate] = useState("");
  const [gbTrucks, setGbTrucks] = useState(1);
  const [gbVol, setGbVol] = useState<"small" | "medium" | "large">("small");
  const [gbType, setGbType] = useState<"general" | "mixed" | "hazardous">("general");

  const [exDate, setExDate] = useState("");
  const [exDays, setExDays] = useState(1);
  const [exEquipment, setExEquipment] = useState<keyof ExcavationConfig["equipmentRates"]>("excavator_standard");
  const [exOp, setExOp] = useState<"with" | "without">("with");

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch("/api/pricing?t=" + Date.now());
        const data = await res.json();
        setPricing(data);
      } catch {
        console.error("Failed to fetch pricing");
      } finally {
        setLoadingPricing(false);
      }
    }

    fetchPricing();

    window.addEventListener("pricing-updated", fetchPricing);
    return () => window.removeEventListener("pricing-updated", fetchPricing);
  }, []);

  function calcBus() {
    if (!pricing) return 0;
    const { baseRatePerBusPerDay, extraHourlyRate, routeMultipliers } = pricing.bus;
    const extra = Math.max(0, busDur - 8) * extraHourlyRate;
    return Math.round((baseRatePerBusPerDay + extra) * routeMultipliers[busRoute] * busCount);
  }

  function calcGarbage() {
    if (!pricing) return 0;
    const { baseRatePerTruckPerWeek, volumeMultipliers, typeMultipliers } = pricing.garbage;
    return Math.round((baseRatePerTruckPerWeek * gbTrucks * volumeMultipliers[gbVol] * typeMultipliers[gbType]) / 3);
  }

  function calcExcavation() {
    if (!pricing) return 0;
    const { equipmentRates, operatorMultiplier } = pricing.excavation;
    const dayRate = equipmentRates[exEquipment];
    const opMultiplier = exOp === "with" ? operatorMultiplier : 1;
    return Math.round(dayRate * opMultiplier * exDays);
  }

  const currentAmt =
    activeTab === "bus" ? calcBus()
    : activeTab === "garbage" ? calcGarbage()
    : calcExcavation();

  const currentDate =
    activeTab === "bus" ? busDate
    : activeTab === "garbage" ? gbDate
    : exDate;

  const inputClass =
    "w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm bg-offwhite focus:outline-none focus:border-navy text-charcoal";

  const ActiveIcon = tabs.find((t) => t.key === activeTab)?.icon ?? Bus;

  if (loadingPricing) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal/30 text-sm">
        Loading pricing...
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
        Failed to load pricing. Please refresh the page.
      </div>
    );
  }

  return (
    <div>
      {/* Info banner */}
      <div className="bg-[#EEF2F8] border border-[#C8D5E8] rounded-xl px-5 py-4 text-sm text-navy/70 mb-6 flex items-start gap-3">
        <Info size={16} className="text-navy/50 shrink-0 mt-0.5" />
        <span>
          One-time bookings are for single-use jobs. Configure the service you
          need, pick your date, and submit a booking request. Our team will
          confirm availability within 24 hours.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Config panel */}
        <div className="lg:col-span-3 bg-white border border-charcoal/5 rounded-2xl overflow-hidden">
          <div className="flex bg-[#F5F7FA] border-b border-charcoal/5">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setActiveTab(t.key);
                    setShowInquiry(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === t.key
                      ? "border-gold text-navy bg-white"
                      : "border-transparent text-charcoal/50 hover:text-charcoal"
                  }`}
                >
                  <Icon size={13} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Bus */}
            {activeTab === "bus" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Date of service</label>
                    <input
                      type="date"
                      value={busDate}
                      onChange={(e) => setBusDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Number of buses</label>
                    <select
                      value={busCount}
                      onChange={(e) => setBusCount(+e.target.value)}
                      className={inputClass}
                    >
                      {Array.from({ length: pricing.bus.maxBuses }, (_, i) => i + 1).slice(0, 5).map((n) => (
                        <option key={n} value={n}>{n} bus{n > 1 ? "es" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Duration</label>
                    <select
                      value={busDur}
                      onChange={(e) => setBusDur(+e.target.value)}
                      className={inputClass}
                    >
                      <option value={pricing.bus.minHoursPerDay}>Half day ({pricing.bus.minHoursPerDay} hrs)</option>
                      <option value={8}>Full day (8 hrs)</option>
                      <option value={12}>Extended (12 hrs)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Route type</label>
                    <select
                      value={busRoute}
                      onChange={(e) => setBusRoute(e.target.value as typeof busRoute)}
                      className={inputClass}
                    >
                      <option value="standard">Standard city (×{pricing.bus.routeMultipliers.standard})</option>
                      <option value="extended">Extended / highway (×{pricing.bus.routeMultipliers.extended})</option>
                      <option value="remote">Remote / out-of-city (×{pricing.bus.routeMultipliers.remote})</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Pickup location</label>
                  <input type="text" placeholder="Street address or area in Port Moresby" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Purpose / details</label>
                  <textarea placeholder="e.g. staff transport for company event, school excursion..." rows={3} className={`${inputClass} resize-none`} />
                </div>
                <p className="text-xs text-charcoal/40">
                  Base rate: {fmt(pricing.bus.baseRatePerBusPerDay)}/bus/day · Extended hours: +{fmt(pricing.bus.extraHourlyRate)}/hr
                </p>
              </div>
            )}

            {/* Garbage */}
            {activeTab === "garbage" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Date of collection</label>
                    <input
                      type="date"
                      value={gbDate}
                      onChange={(e) => setGbDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Number of trucks</label>
                    <select
                      value={gbTrucks}
                      onChange={(e) => setGbTrucks(+e.target.value)}
                      className={inputClass}
                    >
                      {Array.from({ length: Math.min(pricing.garbage.maxTrucks, 5) }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} truck{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Waste volume</label>
                  <select
                    value={gbVol}
                    onChange={(e) => setGbVol(e.target.value as typeof gbVol)}
                    className={inputClass}
                  >
                    <option value="small">Small (household / small office) ×{pricing.garbage.volumeMultipliers.small}</option>
                    <option value="medium">Medium (commercial premises) ×{pricing.garbage.volumeMultipliers.medium}</option>
                    <option value="large">Large (industrial / bulk load) ×{pricing.garbage.volumeMultipliers.large}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Waste type</label>
                  <select
                    value={gbType}
                    onChange={(e) => setGbType(e.target.value as typeof gbType)}
                    className={inputClass}
                  >
                    <option value="general">General waste ×{pricing.garbage.typeMultipliers.general}</option>
                    <option value="mixed">Mixed / construction waste ×{pricing.garbage.typeMultipliers.mixed}</option>
                    <option value="hazardous">Hazardous / special handling ×{pricing.garbage.typeMultipliers.hazardous}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Collection address</label>
                  <input type="text" placeholder="Street address in Port Moresby" className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Preferred time window</label>
                  <select className={inputClass}>
                    <option>Early morning (6–9 AM)</option>
                    <option>Morning (9 AM–12 PM)</option>
                    <option>Afternoon (12–4 PM)</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">
                  Base rate: {fmt(pricing.garbage.baseRatePerTruckPerWeek)}/truck/week
                </p>
              </div>
            )}

            {/* Excavation */}
            {activeTab === "excavation" && (
              <div className="flex flex-col gap-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                  <AlertTriangle size={13} className="shrink-0" />
                  Excavation & machine rental is coming soon. Submit an interest request and we will contact you when available.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Requested start date</label>
                    <input
                      type="date"
                      value={exDate}
                      onChange={(e) => setExDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-charcoal/60">Number of days</label>
                    <select
                      value={exDays}
                      onChange={(e) => setExDays(+e.target.value)}
                      className={inputClass}
                    >
                      {[1, 2, 3, 5, 10, 15, Math.min(20, pricing.excavation.maxDays)].map((n) => (
                        <option key={n} value={n}>{n} day{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Equipment type</label>
                  <select
                    value={exEquipment}
                    onChange={(e) => setExEquipment(e.target.value as typeof exEquipment)}
                    className={inputClass}
                  >
                    <option value="excavator_standard">Excavator (standard) — {fmt(pricing.excavation.equipmentRates.excavator_standard)}/day</option>
                    <option value="excavator_large">Excavator (large / heavy) — {fmt(pricing.excavation.equipmentRates.excavator_large)}/day</option>
                    <option value="backhoe">Backhoe loader — {fmt(pricing.excavation.equipmentRates.backhoe)}/day</option>
                    <option value="bulldozer">Bulldozer — {fmt(pricing.excavation.equipmentRates.bulldozer)}/day</option>
                    <option value="compactor">Compactor / roller — {fmt(pricing.excavation.equipmentRates.compactor)}/day</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Operator required?</label>
                  <select
                    value={exOp}
                    onChange={(e) => setExOp(e.target.value as typeof exOp)}
                    className={inputClass}
                  >
                    <option value="with">Yes — include operator (×{pricing.excavation.operatorMultiplier})</option>
                    <option value="without">No — equipment only</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-charcoal/60">Site location / project description</label>
                  <textarea placeholder="Describe the site and what work needs to be done..." rows={3} className={`${inputClass} resize-none`} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-navy px-5 py-4">
              <h3 className="text-white font-semibold text-sm">Booking summary</h3>
              <p className="text-white/40 text-xs mt-0.5">One-time job estimate</p>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 py-3 border-b border-charcoal/5 mb-3">
                <div className="w-9 h-9 bg-navy/5 rounded-lg flex items-center justify-center">
                  <ActiveIcon size={18} className="text-navy" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {activeTab === "bus" ? "Bus Service"
                      : activeTab === "garbage" ? "Garbage Collection"
                      : "Excavation"}
                  </p>
                  <p className="text-xs text-charcoal/40 flex items-center gap-1">
                    <Calendar size={11} />
                    {currentDate
                      ? new Date(currentDate).toLocaleDateString("en-AU", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "No date selected"}
                  </p>
                </div>
                <p className="ml-auto text-sm font-bold text-navy">{fmt(currentAmt)}</p>
              </div>
              {activeTab === "excavation" && (
                <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
                  <AlertTriangle size={11} />
                  Indicative — service coming soon
                </p>
              )}
              <p className="text-xs text-charcoal/30 text-right mb-4">Excl. GST</p>
              <button
                onClick={() => setShowInquiry(!showInquiry)}
                className="w-full bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200"
              >
                Request this booking →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry form */}
      {showInquiry && (
        <div className="mt-8 bg-white border border-charcoal/5 rounded-2xl p-8">
          <h3 className="text-charcoal font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-gold" />
            One-time booking request
          </h3>
          <div className="bg-[#F5F7FA] rounded-xl p-4 mb-6 text-xs">
            <p className="font-semibold text-navy mb-2">Booking details</p>
            <div className="flex justify-between py-1 border-b border-charcoal/5">
              <span className="text-charcoal/50">Service</span>
              <span className="font-medium">
                {activeTab === "bus" ? "Bus Service"
                  : activeTab === "garbage" ? "Garbage Collection"
                  : "Excavation (indicative)"}
              </span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-navy">
              <span>Estimated cost</span>
              <span>{fmt(currentAmt)}</span>
            </div>
          </div>
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Company / organisation name</label>
                <input type="text" placeholder="Your company or name" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Contact person</label>
                <input type="text" placeholder="Full name" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Email</label>
                <input type="email" placeholder="you@company.com" className={inputClass} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Phone</label>
                <input type="tel" placeholder="+675 XXX XXXX" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-charcoal/60">Additional notes</label>
              <textarea placeholder="Anything else we should know about this job..." rows={3} className={`${inputClass} resize-none`} />
            </div>
            <button type="submit" className="bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200">
              Submit booking request
            </button>
          </form>
        </div>
      )}
    </div>
  );
}