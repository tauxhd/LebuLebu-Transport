"use client";

import { useState } from "react";
import { Bus, Trash2, Hammer, AlertTriangle, CheckCircle2 } from "lucide-react";

type ServiceKey = "bus" | "garbage" | "excavation";

const serviceList = [
  { key: "bus" as ServiceKey, icon: Bus, label: "Bus Services", sub: "Passenger transport" },
  { key: "garbage" as ServiceKey, icon: Trash2, label: "Garbage Collection", sub: "Waste management" },
  { key: "excavation" as ServiceKey, icon: Hammer, label: "Excavation & Rental", sub: "Heavy equipment" },
];

function fmt(n: number) {
  return "K " + n.toLocaleString();
}

export default function ContractEstimator() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<Record<ServiceKey, boolean>>({
    bus: true, garbage: true, excavation: true,
  });
  const [activeTab, setActiveTab] = useState<ServiceKey>("bus");
  const [showInquiry, setShowInquiry] = useState(false);

  const [busCount, setBusCount] = useState(2);
  const [busHrs, setBusHrs] = useState(8);
  const [busDays, setBusDays] = useState(5);
  const [busRoute, setBusRoute] = useState(1);

  const [gbTrucks, setGbTrucks] = useState(1);
  const [gbFreq, setGbFreq] = useState(3);
  const [gbVol, setGbVol] = useState(1);
  const [gbType, setGbType] = useState(1);

  const [exType, setExType] = useState(800);
  const [exUnits, setExUnits] = useState(1);
  const [exHrs, setExHrs] = useState(8);
  const [exDays, setExDays] = useState(20);
  const [exOp, setExOp] = useState(1.2);

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
    const extra = Math.max(0, busHrs - 8) * 30;
    return Math.round((250 + extra) * busRoute * busCount * busDays * 4.33);
  }
  function calcGarbage() {
    return Math.round(400 * gbTrucks * gbVol * gbType * (gbFreq / 3) * 4.33);
  }
  function calcExcavation() {
    const extra = Math.max(0, exHrs - 8) * 50;
    return Math.round((exType * exOp + extra) * exUnits * exDays);
  }

  const disc = billing === "yearly" ? 0.9 : 1;
  const mult = billing === "yearly" ? 12 : 1;
  const busAmt = selected.bus ? Math.round(calcBus() * mult * disc) : 0;
  const gbAmt = selected.garbage ? Math.round(calcGarbage() * mult * disc) : 0;
  const exAmt = selected.excavation ? Math.round(calcExcavation() * disc) : 0;
  const total = busAmt + gbAmt + exAmt;

  const inputClass = "w-full border border-charcoal/15 rounded-lg px-3 py-2.5 text-sm bg-offwhite focus:outline-none focus:border-navy text-charcoal";

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
              <span className="text-xs text-green-500 font-semibold">Save 10%</span>
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
          {/* Tabs */}
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
                  <input type="range" min={1} max={20} value={busCount} onChange={(e) => setBusCount(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Hours per day</label>
                    <span className="text-xs font-bold text-navy">{busHrs} hrs</span>
                  </div>
                  <input type="range" min={4} max={24} value={busHrs} onChange={(e) => setBusHrs(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Days per week</label>
                    <span className="text-xs font-bold text-navy">{busDays} days</span>
                  </div>
                  <input type="range" min={1} max={7} value={busDays} onChange={(e) => setBusDays(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Route type</label>
                  <select value={busRoute} onChange={(e) => setBusRoute(+e.target.value)} className={inputClass}>
                    <option value={1}>Standard city route</option>
                    <option value={1.3}>Extended / highway route</option>
                    <option value={1.6}>Remote / out-of-city route</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">Base rate: K250/bus/day · Extended hours (&gt;8hrs): +K30/hr</p>
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
                  <input type="range" min={1} max={10} value={gbTrucks} onChange={(e) => setGbTrucks(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Collections per week</label>
                    <span className="text-xs font-bold text-navy">{gbFreq}×/week</span>
                  </div>
                  <input type="range" min={1} max={7} value={gbFreq} onChange={(e) => setGbFreq(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Waste volume</label>
                  <select value={gbVol} onChange={(e) => setGbVol(+e.target.value)} className={inputClass}>
                    <option value={1}>Small (residential / small office)</option>
                    <option value={1.5}>Medium (commercial premises)</option>
                    <option value={2.2}>Large (industrial / bulk)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Waste type</label>
                  <select value={gbType} onChange={(e) => setGbType(+e.target.value)} className={inputClass}>
                    <option value={1}>General waste</option>
                    <option value={1.4}>Mixed / construction waste</option>
                    <option value={1.8}>Hazardous / special handling</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">Base rate: K400/truck/week · Volume & type multipliers applied</p>
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
                  <select value={exType} onChange={(e) => setExType(+e.target.value)} className={inputClass}>
                    <option value={800}>Excavator (standard)</option>
                    <option value={1200}>Excavator (large / heavy)</option>
                    <option value={600}>Backhoe loader</option>
                    <option value={500}>Bulldozer</option>
                    <option value={400}>Compactor / roller</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of units</label>
                    <span className="text-xs font-bold text-navy">{exUnits}</span>
                  </div>
                  <input type="range" min={1} max={8} value={exUnits} onChange={(e) => setExUnits(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Hours per day</label>
                    <span className="text-xs font-bold text-navy">{exHrs} hrs</span>
                  </div>
                  <input type="range" min={4} max={24} value={exHrs} onChange={(e) => setExHrs(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-charcoal/60">Number of days</label>
                    <span className="text-xs font-bold text-navy">{exDays} days</span>
                  </div>
                  <input type="range" min={1} max={30} value={exDays} onChange={(e) => setExDays(+e.target.value)} className="w-full accent-navy" />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-2">Operator included?</label>
                  <select value={exOp} onChange={(e) => setExOp(+e.target.value)} className={inputClass}>
                    <option value={1.2}>Yes — operator included</option>
                    <option value={1}>No — equipment only</option>
                  </select>
                </div>
                <p className="text-xs text-charcoal/40">Base day rates vary by equipment · Operator: +20%</p>
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
              <textarea placeholder="Specific requirements, locations, questions..." rows={4} className={`${inputClass} resize-none`} />
            </div>
            <button type="submit" className="bg-gold text-navy font-bold text-sm py-3 rounded-lg hover:bg-gold-dark transition-colors duration-200">
              Submit contract inquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}