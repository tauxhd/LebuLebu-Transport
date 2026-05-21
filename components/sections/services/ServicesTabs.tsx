"use client";

import { useState } from "react";
import { Building2, Briefcase } from "lucide-react";
import PublicTrack from "./PublicTrack";
import PrivateTrack from "./PrivateTrack";

export default function ServicesTabs() {
  const [activeTrack, setActiveTrack] = useState<"public" | "private">("public");

  return (
    <div>
      {/* Tab Switcher */}
      <div className="bg-white border-b border-charcoal/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex">
          <button
            onClick={() => setActiveTrack("public")}
            className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTrack === "public"
                ? "border-gold text-navy font-semibold"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}
          >
            <Building2 size={15} />
            Public / Government
          </button>
          <button
            onClick={() => setActiveTrack("private")}
            className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTrack === "private"
                ? "border-gold text-navy font-semibold"
                : "border-transparent text-charcoal/50 hover:text-charcoal"
            }`}
          >
            <Briefcase size={15} />
            Private / Business
          </button>
        </div>
      </div>

      {/* Track Content */}
      <div>
        {activeTrack === "public" ? <PublicTrack /> : <PrivateTrack />}
      </div>
    </div>
  );
}