"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Lock, Mail, KeyRound, ShieldCheck } from "lucide-react";

type Mode = "login" | "register";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint =
        mode === "login"
          ? "/api/admin/login"
          : "/api/admin/register";

      const body =
        mode === "login"
          ? { email, password }
          : { email, password, secretKey };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onSuccess();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-charcoal/15 rounded-lg px-4 py-2.5 text-sm text-charcoal bg-offwhite focus:outline-none focus:border-navy transition-colors duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-navy px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold/20 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} className="text-gold" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">
                Admin Access
              </h2>
              <p className="text-white/40 text-xs">
                LebuLebu Transport Services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex border-b border-charcoal/10">
          <button
            onClick={() => { setMode("login"); setError(""); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 ${
              mode === "login"
                ? "text-navy border-b-2 border-gold"
                : "text-charcoal/40 hover:text-charcoal"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("register"); setError(""); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors duration-200 ${
              mode === "register"
                ? "text-navy border-b-2 border-gold"
                : "text-charcoal/40 hover:text-charcoal"
            }`}
          >
            Register Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-charcoal/60">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lebulebu.com"
                required
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-charcoal/60">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${inputClass} pl-9 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-charcoal/60">
                Secret key
              </label>
              <div className="relative">
                <KeyRound
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30"
                />
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Enter secret key to register"
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
              <p className="text-xs text-charcoal/40">
                This is the ADMIN_JWT_SECRET from your .env file
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-white font-bold text-sm py-3 rounded-lg hover:bg-navy-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}