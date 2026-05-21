"use client";

import { useState, useEffect } from "react";
import { Bus, Trash2, Hammer, AlertTriangle, CheckCircle2 } from "lucide-react";

type ServiceKey = "bus" | "garbage" | "excavation";

interface BusConfig {
  baseRatePerBusPerDay: number;
  extraHourlyRate: number;
  maxBuses: number;
  maxHoursPerDay: number;
  minHoursPerDay: number;
  maxDaysPerWeek: number;
  yearlyDiscount: number;
  routeMultipliers: { standard: number; extended: number; remote: number };
}

interface GarbageConfig {
  baseRatePerTruckPerWeek: number;
  maxTrucks: number;
  maxCollectionsPerWeek: number;
  yearlyDiscount: number;
  volumeMultipliers: { small: number; medium: number; large: number };
  typeMultipliers: { general: number; mixed: number; hazardous: number };
}

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

interface Pricing {
  bus: BusConfig;
  garbage: GarbageConfig;
  excavation: ExcavationConfig;
}

const serviceList = [
  { key: "bus" as ServiceKey, icon: Bus, label: "Bus Services", sub: "Passenger transport" },
  { key: "garbage" as ServiceKey, icon: Trash2, label: "Garbage Collection", sub: "Waste management" },
  { key: "excavation" as ServiceKey, icon: Hammer, label: "Excavation & Rental", sub: "Heavy equipment" },
];

function fmt(n: number) {
  return "K " + n.toLocaleString();
}

export default function ContractEstimator() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<Record<ServiceKey, boolean>>({
    bus: true, garbage: true, excavation: true,
  });
  const [activeTab, setActiveTab] = useState<ServiceKey>("bus");
  const [showInquiry, setShowInquiry] = useState(false);

  const [busCount, setBusCount] = useState(2);
  const [busHrs, setBusHrs] = useState(8);
  const [busDays, setBusDays] = useState(5);
  const [busRoute, setBusRoute] = useState<"standard" | "extended" | "remote">("standard");

  const [gbTrucks, setGbTrucks] = useState(1);
  const [gbFreq, setGbFreq] = useState(3);
  const [gbVol, setGbVol] = useState<"small" | "medium" | "large">("small");
  const [gbType, setGbType] = useState<"general" | "mixed" | "hazardous">("general");

  const [exEquipment, setExEquipment] = useState<keyof ExcavationConfig["equipmentRates"]>("excavator_standard");
  const [exUnits, setExUnits] = useState(1);
  const [exHrs, setExHrs] = useState(8);
  const [exDays, setExDays] = useState(20);
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

  // Refetch when admin saves pricing
  window.addEventListener("pricing-updated", fetchPricing);
  return () => window.removeEventListener("pricing-updated", fetchPricing);
}, []);

  function toggleService(key: ServiceKey) {
    const anyOther = Object.keys(selected).some(
      (k) => k !== key && selected[k as ServiceKey]
    );
    if (selected[key] && !anyOther) return;
    const next = { ...selected, [key]: !selected[key] };
    setSelected(next);
    if (!next[key] && activeTab === key) {
      const nextTab = (Object.keys(next) as ServiceKey[]).find((k) => next[k]);
      if (nextTab) setActiveTab(nextTab);
    }
  }

  function calcBus() {
    if (!pricing) return 0;
    const { baseRatePerBusPerDay, extraHourlyRate, routeMultipliers } = pricing.bus;
    const extra = Math.max(0, busHrs - 8) * extraHourlyRate;
    return Math.round((baseRatePerBusPerDay + extra) * routeMultipliers[busRoute] * busCount * busDays * 4.33);
  }

  function calcGarbage() {
    if (!pricing) return 0;
    const { baseRatePerTruckPerWeek, volumeMultipliers, typeMultipliers } = pricing.garbage;
    return Math.round(baseRatePerTruckPerWeek * gbTrucks * volumeMultipliers[gbVol] * typeMultipliers[gbType] * (gbFreq / 3) * 4.33);
  }

  function calcExcavation() {
    if (!pricing) return 0;
    const { extraHourlyRate, equipmentRates, operatorMultiplier } = pricing.excavation;
    const dayRate = equipmentRates[exEquipment];
    const extra = Math.max(0, exHrs - 8) * extraHourlyRate;
    const opMultiplier = exOp === "with" ? operatorMultiplier : 1;
    return Math.round((dayRate * opMultiplier + extra) * exUnits * exDays);
  }

  const disc = billing === "yearly"
    ? (pricing?.bus.yearlyDiscount ?? 0.1)
    : 0;
  const mult = billing === "yearly" ? 12 : 1;

  const busAmt = selected.bus ? Math.round(calcBus() * mult * (1 - disc)) : 0;
  const gbAmt = selected.garbage ? Math.round(calcGarbage() * mult * (1 - (billing === "yearly" ? (pricing?.garbage.yearlyDiscount ?? 0.1) : 0))) : 0;
  const exAmt = selected.excavation ? Math.round(calcExcavation() * (1 - (billing === "yearly" ? (pricing?.excavation.yearlyDiscount ?? 0.1) : 0))) : 0;
  const total = busAmt + gbAmt + exAmt;

  const inputClass = "w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm bg-offwhite focus:outline-none focus:border-navy text-charcoal";

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
      {/* Billing toggle */}
      <div className="flex mb-6 border border-charcoal/15 rounded-lg overflow-hidden w-fit">
        {(["monthly", "yearly"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={`px-5 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
              billing === b ? "bg-navy text-white" : "bg-white text-charcoal/50"
            }`}
          >
            {b === "monthly" ? "Monthly" : "Yearly"}
            {b === "yearly" && (
              <span className="text-xs text-green-500 font-semibold">
                Save {Math.round((pricing.bus.yearlyDiscount) * 100)}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Service selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {serviceList.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.key}
              onClick={() => toggleService(s.key)}
              className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                selected[s.key] ? "border-navy bg-[#F4F7FB]" : "border-charcoal/15 bg-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                selected[s.key] ? "bg-navy" : "bg-navy/5"
              }`}>
                <Icon size={18} className={selected[s.key] ? "text-gold" : "text-navy"} />
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">{s.label}</p>
                <p className="text-xs text-charcoal/50">{s.sub}</p>
              </div>
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                selected[s.key] ? "bg-navy border-navy text-white" : "border-charcoal/20"
              }`}>
                {selected[s.key] && <CheckCircle2 size={12} />}
              </div>
              {s.key === "excavation" && (
                <span className="absolute bottom-2 right-3 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Estimator grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Config panel */}
        <div className="lg:col-span-3 bg-white border border-charcoal/5 rounded-2xl overflow-hidden">
          <div className="flex bg-[#F5F7FA] border-b border-charcoal/5">
            {serviceList.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => selected[s.key] && setActiveTab(s.key)}
                  disabled={!selected[s.key]}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
                    activeTab === s.key
                      ? "border-gold text-navy bg-white"
                      : "border-transparent text-charcoal/50"
                  }`}
                >
                  <Icon size={13} />
                  {s.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {/* Bus */}
            {activeTab === "bus" && (
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of buses</label>
                    <span className="text-xs font-bold text-navy">{busCount}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.bus.maxBuses}
                    value={busCount}
                    onChange={(e) => setBusCount(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Hours per day</label>
                    <span className="text-xs font-bold text-navy">{busHrs} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={pricing.bus.minHoursPerDay}
                    max={pricing.bus.maxHoursPerDay}
                    value={busHrs}
                    onChange={(e) => setBusHrs(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Days per week</label>
                    <span className="text-xs font-bold text-navy">{busDays} days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.bus.maxDaysPerWeek}
                    value={busDays}
                    onChange={(e) => setBusDays(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Route type</label>
                  <select
                    value={busRoute}
                    onChange={(e) => setBusRoute(e.target.value as typeof busRoute)}
                    className={inputClass}
                  >
                    <option value="standard">Standard city route (×{pricing.bus.routeMultipliers.standard})</option>
                    <option value="extended">Extended / highway route (×{pricing.bus.routeMultipliers.extended})</option>
                    <option value="remote">Remote / out-of-city route (×{pricing.bus.routeMultipliers.remote})</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">
                  Base rate: {fmt(pricing.bus.baseRatePerBusPerDay)}/bus/day · Extended hours (&gt;8hrs): +{fmt(pricing.bus.extraHourlyRate)}/hr
                </p>
              </div>
            )}

            {/* Garbage */}
            {activeTab === "garbage" && (
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of trucks</label>
                    <span className="text-xs font-bold text-navy">{gbTrucks}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.garbage.maxTrucks}
                    value={gbTrucks}
                    onChange={(e) => setGbTrucks(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Collections per week</label>
                    <span className="text-xs font-bold text-navy">{gbFreq}×/week</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.garbage.maxCollectionsPerWeek}
                    value={gbFreq}
                    onChange={(e) => setGbFreq(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Waste volume</label>
                  <select
                    value={gbVol}
                    onChange={(e) => setGbVol(e.target.value as typeof gbVol)}
                    className={inputClass}
                  >
                    <option value="small">Small (residential / small office) ×{pricing.garbage.volumeMultipliers.small}</option>
                    <option value="medium">Medium (commercial premises) ×{pricing.garbage.volumeMultipliers.medium}</option>
                    <option value="large">Large (industrial / bulk) ×{pricing.garbage.volumeMultipliers.large}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Waste type</label>
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
                <p className="text-xs text-charcoal/40">
                  Base rate: {fmt(pricing.garbage.baseRatePerTruckPerWeek)}/truck/week
                </p>
              </div>
            )}

            {/* Excavation */}
            {activeTab === "excavation" && (
              <div className="flex flex-col gap-5">
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                  <AlertTriangle size={13} className="shrink-0" />
                  Excavation is coming soon. This estimate is indicative for planning purposes.
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Equipment type</label>
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
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of units</label>
                    <span className="text-xs font-bold text-navy">{exUnits}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.excavation.maxUnits}
                    value={exUnits}
                    onChange={(e) => setExUnits(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Hours per day</label>
                    <span className="text-xs font-bold text-navy">{exHrs} hrs</span>
                  </div>
                  <input
                    type="range"
                    min={pricing.excavation.minHoursPerDay}
                    max={pricing.excavation.maxHoursPerDay}
                    value={exHrs}
                    onChange={(e) => setExHrs(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of days</label>
                    <span className="text-xs font-bold text-navy">{exDays} days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={pricing.excavation.maxDays}
                    value={exDays}
                    onChange={(e) => setExDays(+e.target.value)}
                    className="w-full accent-navy"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Operator included?</label>
                  <select
                    value={exOp}
                    onChange={(e) => setExOp(e.target.value as typeof exOp)}
                    className={inputClass}
                  >
                    <option value="with">Yes — operator included (×{pricing.excavation.operatorMultiplier})</option>
                    <option value="without">No — equipment only</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">
                  Extended hours (&gt;8hrs): +{fmt(pricing.excavation.extraHourlyRate)}/hr · Operator: ×{pricing.excavation.operatorMultiplier}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary panel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden sticky top-24">
            <div className="bg-navy px-5 py-4">
              <h3 className="text-white font-semibold text-sm">Contract estimate</h3>
              <p className="text-white/40 text-xs mt-0.5">
                {billing === "monthly" ? "Monthly billing" : "Yearly billing"}
              </p>
            </div>
            <div className="p-5">
              <div className="flex flex-col mb-4">
                {serviceList.map((s) => {
                  const Icon = s.icon;
                  const amt = s.key === "bus" ? busAmt : s.key === "garbage" ? gbAmt : exAmt;
                  return (
                    <div key={s.key} className="flex justify-between items-center py-2.5 border-b border-charcoal/5 last:border-none">
                      <span className="text-xs text-charcoal/50 flex items-center gap-2">
                        <Icon size={13} />
                        {s.label}
                      </span>
                      <span className={`text-xs font-semibold ${selected[s.key] ? "text-charcoal" : "text-charcoal/25"}`}>
                        {selected[s.key] ? fmt(amt) : "Not selected"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#EEF2F8] rounded-xl px-4 py-3 flex justify-between items-center mb-2">
                <span className="text-navy text-xs font-semibold">Estimated total</span>
                <span className="text-navy text-xl font-bold">{fmt(total)}</span>
              </div>
              <p className="text-xs text-charcoal/30 text-right mb-4">
                {billing === "monthly" ? "Per month" : "Per year"} · excl. GST
              </p>
              <button
                onClick={() => setShowInquiry(!showInquiry)}
                disabled={total === 0}
                className="w-full bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Proceed to inquiry →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry form */}
      {showInquiry && (
        <div className="mt-8 bg-white border border-charcoal/5 rounded-2xl p-8">
          <h3 className="text-charcoal font-bold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-gold" />
            Contract inquiry
          </h3>
          <div className="bg-[#F5F7FA] rounded-xl p-4 mb-6 text-xs">
            <p className="font-semibold text-navy mb-2">Attached estimate</p>
            {selected.bus && (
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal/50">Bus services</span>
                <span className="font-medium">{fmt(busAmt)}</span>
              </div>
            )}
            {selected.garbage && (
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal/50">Garbage collection</span>
                <span className="font-medium">{fmt(gbAmt)}</span>
              </div>
            )}
            {selected.excavation && (
              <div className="flex justify-between py-1 border-b border-charcoal/5">
                <span className="text-charcoal/50">Excavation (indicative)</span>
                <span className="font-medium">{fmt(exAmt)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 font-bold text-navy">
              <span>Total ({billing})</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-charcoal/60">Company name</label>
                <input type="text" placeholder="Your company" className={inputClass} />
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
              <label className="text-xs font-medium text-charcoal/60">Preferred contract start date</label>
              <input type="text" placeholder="e.g. July 2025" className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-charcoal/60">Additional notes</label>
              <textarea
                placeholder="Specific requirements, locations, questions..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
            <button
              type="submit"
              className="bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200"
            >
              Submit contract inquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}