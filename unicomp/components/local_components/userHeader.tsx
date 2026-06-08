"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserCircle, LogOut, Bell, Menu, X, Settings } from "lucide-react";

export default function UserHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State untuk data notifikasi khusus di header
  const [hasUnread, setHasUnread] = useState<boolean>(false);

  // State placeholder untuk menyimpan data user
  const [userData, setUserData] = useState({
    name: "Guest",
    role: "Participant",
  });

  // Ambil data user dari localStorage & fetch notifikasi unread
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedRole = localStorage.getItem("userRole");

    if (savedName || savedRole) {
      setUserData({
        name: savedName || "Participant",
        role: savedRole || "",
      });
    }

    const checkUnreadNotifications = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
        const token = localStorage.getItem("token");

        if (!apiUrl) return;

        const res = await fetch(`${apiUrl}/notifications/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Logika diperketat: Hanya bernilai TRUE jika ada objek yang statusnya UNREAD secara eksplisit
            const unreadExist = data.some((n: any) => {
              // Menangani struktur data fleksibel (boolean `is_read` atau string `status`)
              const isUnreadByFlag = n.is_read === false;
              const isUnreadByStatus = String(n.status).toUpperCase() === "UNREAD";

              return isUnreadByFlag || isUnreadByStatus;
            });

            setHasUnread(unreadExist);
          }
        }
      } catch (error) {
        console.error("Error fetching header notifications:", error);
      }
    };

    checkUnreadNotifications();
  }, []);

  // Fungsi untuk menangani Sign Out secara aman lewat client-side
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="bg-[#8cabd9] py-4 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/dashboard">
            <div className="flex items-center gap-3 cursor-pointer group">
              <Image src="/UniComp Logo.svg" width={24} height={24} alt="UniComp Logo" />
              <span className="font-extrabold text-2xl text-[#1e40af] tracking-tight group-hover:opacity-80 transition-opacity">UniComp</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 text-[#1e40af] text-[15px] font-bold">
            <Link href="/dashboard/competition" className="hover:text-white transition-colors">
              Competition
            </Link>
            <Link href="/dashboard/calendar" className="hover:text-white transition-colors">
              Calendar
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/leaderboard" className="hover:text-white transition-colors">
              Leaderboard
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Notification Icon */}
            <Link href="/dashboard/notifications" className="text-[#1e40af] hover:text-white transition-colors relative">
              <Bell size={24} strokeWidth={2} className="md:w-[28px] md:h-[28px]" />

              {/* TANDA MERAH AKTIF HANYA JIKA ADA UNREAD */}
              {hasUnread && <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border-2 border-[#8cabd9] animate-pulse"></span>}
            </Link>

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center text-[#1e40af] hover:text-white transition-all transform active:scale-95 outline-none">
                <UserCircle size={32} strokeWidth={1.5} className="md:w-[36px] md:h-[36px]" />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-4 w-55 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  {/* User Info Section */}
                  <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="font-bold text-gray-800 text-lg">{userData.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-medium">{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</div>
                  </div>

                  {/* Links Section */}
                  <div className="p-3 space-y-1">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-4 text-sm text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors group font-bold"
                    >
                      <UserCircle size={20} className="text-gray-400 group-hover:text-[#1e40af]" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 px-4 py-4 text-sm text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors group font-bold"
                    >
                      <Settings size={20} className="text-gray-400 group-hover:text-[#1e40af]" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="h-px bg-gray-100 my-2 mx-4"></div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-4 px-4 py-4 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-colors group font-bold cursor-pointer"
                    >
                      <LogOut size={20} className="text-red-400 group-hover:text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Button (Mobile) */}
            <button className="md:hidden text-[#1e40af] p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-6 flex flex-col gap-5 border-t border-[#1e40af]/10 pt-6 animate-in slide-in-from-top duration-300">
            <Link href="/dashboard/competition" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1e40af] font-bold hover:text-white text-xl">
              Competition
            </Link>
            <Link href="/dashboard/calendar" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1e40af] font-bold hover:text-white text-xl">
              Calendar
            </Link>
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1e40af] font-bold hover:text-white text-xl">
              Dashboard
            </Link>
            <Link href="/dashboard/leaderboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[#1e40af] font-bold hover:text-white text-xl underline underline-offset-8">
              Leaderboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
