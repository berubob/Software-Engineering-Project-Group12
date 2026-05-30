"use client";
import React, { useState } from "react";
import { Shield, Bell, Lock, LogOut } from "lucide-react";
import BackButton from "@/components/global_components/backButton";

type MenuType = "security" | "notifications" | "privacy";

export default function Main() {
  const [activeMenu, setActiveMenu] = useState<MenuType>("security");

  return (
    <main className="px-6 py-8 md:px-20 max-w-[1400px] w-full mx-auto font-sans">
      {/* --- BACK BUTTON & TITLE --- */}
      <div className="mb-10">
        <BackButton />
        <h1 className="text-3xl font-extrabold text-[#1e3a8a] tracking-tight">Account Settings</h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">Here you can set your account personalization</p>
      </div>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* KOLOM KIRI: Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveMenu("security")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeMenu === "security" ? "bg-white text-gray-800 shadow-sm border border-gray-100" : "text-gray-500 hover:bg-gray-100/70"
            }`}
          >
            <Shield size={18} className={activeMenu === "security" ? "text-gray-700" : "text-gray-400"} />
            <span>Security</span>
          </button>

          <button
            onClick={() => setActiveMenu("notifications")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeMenu === "notifications" ? "bg-white text-gray-800 shadow-sm border border-gray-100" : "text-gray-500 hover:bg-gray-100/70"
            }`}
          >
            <Bell size={18} className={activeMenu === "notifications" ? "text-gray-700" : "text-gray-400"} />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveMenu("privacy")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeMenu === "privacy" ? "bg-white text-gray-800 shadow-sm border border-gray-100" : "text-gray-500 hover:bg-gray-100/70"
            }`}
          >
            <Lock size={18} className={activeMenu === "privacy" ? "text-gray-700" : "text-gray-400"} />
            <span>Privacy</span>
          </button>

          {/* Sign Out Button */}
          <div className="pt-4 border-t border-gray-200/60 mt-4">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: Settings Content Card */}
        <div className="md:col-span-3">
          {activeMenu === "security" && (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Security & Password</h2>

              {/* Option 1: Change Password */}
              <div className="flex items-center justify-between p-5 bg-[#f8fafc] border border-gray-100 rounded-2xl">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Change Password</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">Last changed 2 months ago</p>
                </div>
                <button className="bg-[#e2e8f0] text-gray-700 hover:bg-gray-300 text-xs font-bold px-5 py-2 rounded-xl transition-colors">Edit</button>
              </div>

              {/* Option 2: Two-Factor Authentication */}
              <div className="flex items-center justify-between p-5 bg-[#f8fafc] border border-gray-100 rounded-2xl">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Two-Factor Authentication</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">Enable for extra security</p>
                </div>
                <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1.5 rounded-lg tracking-wider uppercase">OFF</span>
              </div>
            </div>
          )}

          {activeMenu === "notifications" && (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Notification Settings</h2>
              <p className="text-xs text-gray-400 font-medium">Manage how you receive alerts and updates.</p>
            </div>
          )}

          {activeMenu === "privacy" && (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Privacy Settings</h2>
              <p className="text-xs text-gray-400 font-medium">Control your profile visibility and data sharing preferences.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
