"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import AdminModal from "./AdminModal";
import AdminDashboard from "./AdminDashboard";

export default function AdminButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch("/api/admin/me");
      setIsLoggedIn(res.ok);
    } catch {
      setIsLoggedIn(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setShowDashboard(false);
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {isLoggedIn && (
          <button
            onClick={() => setShowDashboard(true)}
            className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-navy-light transition-colors duration-200 flex items-center gap-2"
          >
            <ShieldCheck size={13} />
            Admin Dashboard
          </button>
        )}
        <button
          onClick={() => isLoggedIn ? handleLogout() : setShowModal(true)}
          className={`text-xs font-semibold px-4 py-2 rounded-full shadow-lg transition-colors duration-200 flex items-center gap-2 ${
            isLoggedIn
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gold text-navy hover:bg-gold-dark"
          }`}
        >
          <ShieldCheck size={13} />
          {isLoggedIn ? "Sign Out" : "Admin"}
        </button>
      </div>

      {showModal && (
        <AdminModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setIsLoggedIn(true);
            setShowDashboard(true);
          }}
        />
      )}

      {showDashboard && (
        <AdminDashboard onClose={() => setShowDashboard(false)} />
      )}
    </>
  );
}