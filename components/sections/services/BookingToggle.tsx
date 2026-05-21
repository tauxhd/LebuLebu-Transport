"use client";

import { useState } from "react";
import { FileText, CalendarDays } from "lucide-react";
import ContractEstimator from "./ContractEstimator";
import OneTimeBooking from "./OneTimeBooking";

export default function BookingToggle() {
  const [mode, setMode] = useState<"contract" | "onetime">("contract");

  return (
    <div>
      {/* Toggle */}
      <div className="flex mb-8 border border-charcoal/15 rounded-lg overflow-hidden w-fit">
        <button
          onClick={() => setMode("contract")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
            mode === "contract"
              ? "bg-navy text-white"
              : "bg-white text-charcoal/50 hover:text-charcoal"
          }`}
        >
          <FileText size={14} />
          Contract / Ongoing
        </button>
        <button
          onClick={() => setMode("onetime")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
            mode === "onetime"
              ? "bg-navy text-white"
              : "bg-white text-charcoal/50 hover:text-charcoal"
          }`}
        >
          <CalendarDays size={14} />
          One-Time Booking
        </button>
      </div>

      {mode === "contract" ? <ContractEstimator /> : <OneTimeBooking />}
    </div>
  );
}