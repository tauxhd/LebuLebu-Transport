"use client";

import { useState, useEffect, useCallback, useId } from "react";
import {
  X, Bus, Trash2, Hammer, Save, RefreshCw,
  ChevronDown, ChevronUp, Percent
} from "lucide-react";

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

interface Props {
  onClose: () => void;
}

function fmt(n: number) {
  return "K " + n.toLocaleString();
}

function calcYearly(monthly: number, discount: number) {
  return Math.round(monthly * 12 * (1 - discount));
}

const inputClass =
  "w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm text-charcoal bg-offwhite focus:outline-none focus:border-navy transition-colors duration-200";

// ── Defined OUTSIDE component to prevent remount on every render ──
interface NumericFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  step?: number;
  min?: number;
}

function NumericField({ label, value, onChange, prefix = "K", step = 1, min = 0 }: NumericFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-charcoal/60">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-charcoal/40 font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          value={value}
          step={step}
          min={min}
          onChange={(e) => onChange(+e.target.value)}
          className={`${inputClass} ${prefix ? "pl-7" : ""}`}
        />
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: (key: string) => void;
}

function SectionHeader({ title, sectionKey, expanded, onToggle }: SectionHeaderProps) {
  return (
    <button
      onClick={() => onToggle(sectionKey)}
      className="w-full flex items-center justify-between py-2 text-xs font-semibold text-charcoal/50 uppercase tracking-widest hover:text-charcoal transition-colors duration-200"
    >
      {title}
      {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
    </button>
  );
}

export default function AdminDashboard({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"bus" | "garbage" | "excavation">("bus");
  const [bus, setBus] = useState<BusConfig | null>(null);
  const [garbage, setGarbage] = useState<GarbageConfig | null>(null);
  const [excavation, setExcavation] = useState<ExcavationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    base: true, limits: true, multipliers: true, yearly: true, typeMultipliers: true,
  });

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pricing");
      const data = await res.json();
      setBus(data.bus);
      setGarbage(data.garbage);
      setExcavation(data.excavation);
    } catch {
      setError("Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const configs = [
        { service: "bus", config: bus },
        { service: "garbage", config: garbage },
        { service: "excavation", config: excavation },
      ];
      for (const { service, config } of configs) {
        const res = await fetch("/api/pricing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service, config }),
        });
        if (!res.ok) throw new Error(`Failed to save ${service}`);
      }
      setSaved(true);
window.dispatchEvent(new Event("pricing-updated"));
setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save pricing");
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(key: string) {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const tabs = [
    { key: "bus" as const, icon: Bus, label: "Bus Services" },
    { key: "garbage" as const, icon: Trash2, label: "Garbage" },
    { key: "excavation" as const, icon: Hammer, label: "Excavation" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-semibold text-sm">Pricing Dashboard</h2>
            <p className="text-white/40 text-xs mt-0.5">Manage service rates & limits</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchPricing} className="text-white/40 hover:text-white transition-colors duration-200" title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors duration-200">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-charcoal/10 shrink-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 flex-1 py-3 text-xs font-medium border-b-2 transition-colors duration-200 justify-center ${
                  activeTab === t.key
                    ? "border-gold text-navy"
                    : "border-transparent text-charcoal/40 hover:text-charcoal"
                }`}
              >
                <Icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-charcoal/30 text-sm">
              Loading pricing data...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">{error}</div>
          ) : (
            <>
              {/* ── BUS ── */}
              {activeTab === "bus" && bus && (
                <div className="flex flex-col gap-1">
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Base rates" sectionKey="base" expanded={expandedSections.base} onToggle={toggleSection} />
                    {expandedSections.base && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField
                          label="Base rate per bus per day"
                          value={bus.baseRatePerBusPerDay}
                          onChange={(v) => setBus((b) => b ? { ...b, baseRatePerBusPerDay: v } : b)}
                        />
                        <NumericField
                          label="Extra hourly rate (>8hrs)"
                          value={bus.extraHourlyRate}
                          onChange={(v) => setBus((b) => b ? { ...b, extraHourlyRate: v } : b)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Vehicle & time limits" sectionKey="limits" expanded={expandedSections.limits} onToggle={toggleSection} />
                    {expandedSections.limits && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Max buses available" value={bus.maxBuses} onChange={(v) => setBus((b) => b ? { ...b, maxBuses: v } : b)} prefix="" />
                        <NumericField label="Max days per week" value={bus.maxDaysPerWeek} onChange={(v) => setBus((b) => b ? { ...b, maxDaysPerWeek: v } : b)} prefix="" />
                        <NumericField label="Min hours per day" value={bus.minHoursPerDay} onChange={(v) => setBus((b) => b ? { ...b, minHoursPerDay: v } : b)} prefix="" />
                        <NumericField label="Max hours per day" value={bus.maxHoursPerDay} onChange={(v) => setBus((b) => b ? { ...b, maxHoursPerDay: v } : b)} prefix="" />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Route multipliers" sectionKey="multipliers" expanded={expandedSections.multipliers} onToggle={toggleSection} />
                    {expandedSections.multipliers && (
                      <div className="grid grid-cols-3 gap-4 pb-4">
                        <NumericField label="Standard city" value={bus.routeMultipliers.standard} onChange={(v) => setBus((b) => b ? { ...b, routeMultipliers: { ...b.routeMultipliers, standard: v } } : b)} prefix="×" step={0.1} />
                        <NumericField label="Extended / highway" value={bus.routeMultipliers.extended} onChange={(v) => setBus((b) => b ? { ...b, routeMultipliers: { ...b.routeMultipliers, extended: v } } : b)} prefix="×" step={0.1} />
                        <NumericField label="Remote / out-of-city" value={bus.routeMultipliers.remote} onChange={(v) => setBus((b) => b ? { ...b, routeMultipliers: { ...b.routeMultipliers, remote: v } } : b)} prefix="×" step={0.1} />
                      </div>
                    )}
                  </div>
                  <div>
                    <SectionHeader title="Yearly billing" sectionKey="yearly" expanded={expandedSections.yearly} onToggle={toggleSection} />
                    {expandedSections.yearly && (
                      <div className="pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-charcoal/60">Yearly discount</label>
                            <div className="relative">
                              <Percent size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                              <input
                                type="number"
                                value={Math.round(bus.yearlyDiscount * 100)}
                                step={1}
                                min={0}
                                max={100}
                                onChange={(e) => setBus((b) => b ? { ...b, yearlyDiscount: +e.target.value / 100 } : b)}
                                className={`${inputClass} pl-7`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#EEF2F8] rounded-xl p-4 text-xs">
                          <p className="text-navy font-semibold mb-2">Auto-calculated (2 buses, 8hrs, 5 days, standard route)</p>
                          <div className="flex justify-between py-1 border-b border-navy/10">
                            <span className="text-charcoal/50">Monthly rate</span>
                            <span className="font-medium">{fmt(Math.round(bus.baseRatePerBusPerDay * bus.routeMultipliers.standard * 2 * 5 * 4.33))}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-charcoal/50">Yearly rate (with {Math.round(bus.yearlyDiscount * 100)}% discount)</span>
                            <span className="font-bold text-navy">{fmt(calcYearly(Math.round(bus.baseRatePerBusPerDay * bus.routeMultipliers.standard * 2 * 5 * 4.33), bus.yearlyDiscount))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── GARBAGE ── */}
              {activeTab === "garbage" && garbage && (
                <div className="flex flex-col gap-1">
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Base rates" sectionKey="base" expanded={expandedSections.base} onToggle={toggleSection} />
                    {expandedSections.base && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Base rate per truck per week" value={garbage.baseRatePerTruckPerWeek} onChange={(v) => setGarbage((g) => g ? { ...g, baseRatePerTruckPerWeek: v } : g)} />
                        <NumericField label="Max collections per week" value={garbage.maxCollectionsPerWeek} onChange={(v) => setGarbage((g) => g ? { ...g, maxCollectionsPerWeek: v } : g)} prefix="" />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Fleet limits" sectionKey="limits" expanded={expandedSections.limits} onToggle={toggleSection} />
                    {expandedSections.limits && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Max trucks available" value={garbage.maxTrucks} onChange={(v) => setGarbage((g) => g ? { ...g, maxTrucks: v } : g)} prefix="" />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Volume multipliers" sectionKey="multipliers" expanded={expandedSections.multipliers} onToggle={toggleSection} />
                    {expandedSections.multipliers && (
                      <div className="grid grid-cols-3 gap-4 pb-4">
                        <NumericField label="Small (residential)" value={garbage.volumeMultipliers.small} onChange={(v) => setGarbage((g) => g ? { ...g, volumeMultipliers: { ...g.volumeMultipliers, small: v } } : g)} prefix="×" step={0.1} />
                        <NumericField label="Medium (commercial)" value={garbage.volumeMultipliers.medium} onChange={(v) => setGarbage((g) => g ? { ...g, volumeMultipliers: { ...g.volumeMultipliers, medium: v } } : g)} prefix="×" step={0.1} />
                        <NumericField label="Large (industrial)" value={garbage.volumeMultipliers.large} onChange={(v) => setGarbage((g) => g ? { ...g, volumeMultipliers: { ...g.volumeMultipliers, large: v } } : g)} prefix="×" step={0.1} />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Waste type multipliers" sectionKey="typeMultipliers" expanded={expandedSections.typeMultipliers} onToggle={toggleSection} />
                    {expandedSections.typeMultipliers && (
                      <div className="grid grid-cols-3 gap-4 pb-4">
                        <NumericField label="General waste" value={garbage.typeMultipliers.general} onChange={(v) => setGarbage((g) => g ? { ...g, typeMultipliers: { ...g.typeMultipliers, general: v } } : g)} prefix="×" step={0.1} />
                        <NumericField label="Mixed / construction" value={garbage.typeMultipliers.mixed} onChange={(v) => setGarbage((g) => g ? { ...g, typeMultipliers: { ...g.typeMultipliers, mixed: v } } : g)} prefix="×" step={0.1} />
                        <NumericField label="Hazardous" value={garbage.typeMultipliers.hazardous} onChange={(v) => setGarbage((g) => g ? { ...g, typeMultipliers: { ...g.typeMultipliers, hazardous: v } } : g)} prefix="×" step={0.1} />
                      </div>
                    )}
                  </div>
                  <div>
                    <SectionHeader title="Yearly billing" sectionKey="yearly" expanded={expandedSections.yearly} onToggle={toggleSection} />
                    {expandedSections.yearly && (
                      <div className="pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-charcoal/60">Yearly discount</label>
                            <div className="relative">
                              <Percent size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                              <input
                                type="number"
                                value={Math.round(garbage.yearlyDiscount * 100)}
                                step={1} min={0} max={100}
                                onChange={(e) => setGarbage((g) => g ? { ...g, yearlyDiscount: +e.target.value / 100 } : g)}
                                className={`${inputClass} pl-7`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#EEF2F8] rounded-xl p-4 text-xs">
                          <p className="text-navy font-semibold mb-2">Auto-calculated (1 truck, 3×/week, general, small)</p>
                          <div className="flex justify-between py-1 border-b border-navy/10">
                            <span className="text-charcoal/50">Monthly rate</span>
                            <span className="font-medium">{fmt(Math.round(garbage.baseRatePerTruckPerWeek * 4.33))}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-charcoal/50">Yearly rate (with {Math.round(garbage.yearlyDiscount * 100)}% discount)</span>
                            <span className="font-bold text-navy">{fmt(calcYearly(Math.round(garbage.baseRatePerTruckPerWeek * 4.33), garbage.yearlyDiscount))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── EXCAVATION ── */}
              {activeTab === "excavation" && excavation && (
                <div className="flex flex-col gap-1">
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Equipment day rates" sectionKey="base" expanded={expandedSections.base} onToggle={toggleSection} />
                    {expandedSections.base && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Excavator (standard) /day" value={excavation.equipmentRates.excavator_standard} onChange={(v) => setExcavation((e) => e ? { ...e, equipmentRates: { ...e.equipmentRates, excavator_standard: v } } : e)} />
                        <NumericField label="Excavator (large) /day" value={excavation.equipmentRates.excavator_large} onChange={(v) => setExcavation((e) => e ? { ...e, equipmentRates: { ...e.equipmentRates, excavator_large: v } } : e)} />
                        <NumericField label="Backhoe loader /day" value={excavation.equipmentRates.backhoe} onChange={(v) => setExcavation((e) => e ? { ...e, equipmentRates: { ...e.equipmentRates, backhoe: v } } : e)} />
                        <NumericField label="Bulldozer /day" value={excavation.equipmentRates.bulldozer} onChange={(v) => setExcavation((e) => e ? { ...e, equipmentRates: { ...e.equipmentRates, bulldozer: v } } : e)} />
                        <NumericField label="Compactor / roller /day" value={excavation.equipmentRates.compactor} onChange={(v) => setExcavation((e) => e ? { ...e, equipmentRates: { ...e.equipmentRates, compactor: v } } : e)} />
                        <NumericField label="Extra hourly rate (>8hrs)" value={excavation.extraHourlyRate} onChange={(v) => setExcavation((e) => e ? { ...e, extraHourlyRate: v } : e)} />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Fleet & time limits" sectionKey="limits" expanded={expandedSections.limits} onToggle={toggleSection} />
                    {expandedSections.limits && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Max units available" value={excavation.maxUnits} onChange={(v) => setExcavation((e) => e ? { ...e, maxUnits: v } : e)} prefix="" />
                        <NumericField label="Max days" value={excavation.maxDays} onChange={(v) => setExcavation((e) => e ? { ...e, maxDays: v } : e)} prefix="" />
                        <NumericField label="Min hours per day" value={excavation.minHoursPerDay} onChange={(v) => setExcavation((e) => e ? { ...e, minHoursPerDay: v } : e)} prefix="" />
                        <NumericField label="Max hours per day" value={excavation.maxHoursPerDay} onChange={(v) => setExcavation((e) => e ? { ...e, maxHoursPerDay: v } : e)} prefix="" />
                      </div>
                    )}
                  </div>
                  <div className="border-b border-charcoal/5 pb-1 mb-2">
                    <SectionHeader title="Operator multiplier" sectionKey="multipliers" expanded={expandedSections.multipliers} onToggle={toggleSection} />
                    {expandedSections.multipliers && (
                      <div className="grid grid-cols-2 gap-4 pb-4">
                        <NumericField label="Operator included multiplier" value={excavation.operatorMultiplier} onChange={(v) => setExcavation((e) => e ? { ...e, operatorMultiplier: v } : e)} prefix="×" step={0.1} />
                      </div>
                    )}
                  </div>
                  <div>
                    <SectionHeader title="Yearly billing" sectionKey="yearly" expanded={expandedSections.yearly} onToggle={toggleSection} />
                    {expandedSections.yearly && (
                      <div className="pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-charcoal/60">Yearly discount</label>
                            <div className="relative">
                              <Percent size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
                              <input
                                type="number"
                                value={Math.round(excavation.yearlyDiscount * 100)}
                                step={1} min={0} max={100}
                                onChange={(e) => setExcavation((ex) => ex ? { ...ex, yearlyDiscount: +e.target.value / 100 } : ex)}
                                className={`${inputClass} pl-7`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#EEF2F8] rounded-xl p-4 text-xs">
                          <p className="text-navy font-semibold mb-2">Auto-calculated (1 standard excavator, 8hrs, 20 days, with operator)</p>
                          <div className="flex justify-between py-1 border-b border-navy/10">
                            <span className="text-charcoal/50">One-time rate (20 days)</span>
                            <span className="font-medium">{fmt(Math.round(excavation.equipmentRates.excavator_standard * excavation.operatorMultiplier * 20))}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-charcoal/50">Yearly rate (with {Math.round(excavation.yearlyDiscount * 100)}% discount)</span>
                            <span className="font-bold text-navy">{fmt(Math.round(excavation.equipmentRates.excavator_standard * excavation.operatorMultiplier * 20 * (1 - excavation.yearlyDiscount)))}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-charcoal/10 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
          {saved && (
            <p className="text-green-600 text-xs font-medium">✓ All pricing saved successfully</p>
          )}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {!saved && !error && <div />}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-gold text-navy font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-gold-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save All Pricing"}
          </button>
        </div>
      </div>
    </div>
  );
}