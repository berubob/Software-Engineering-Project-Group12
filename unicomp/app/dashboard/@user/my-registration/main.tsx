"use client";
import React, { useEffect, useState } from "react";

interface MyRegistration {
  registration_id: string;
  registration_date: string;
  status: string;
  competition_id: string;
  title: string;
  category: string;
  deadline: string;
  competition_type: string;
  schedule: Record<string, string> | null;
  start_date: string;
  end_date: string;
}

export default function Main() {
  const [registrations, setRegistrations] = useState<MyRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Anda belum login. Token tidak ditemukan.");
        }

        const res = await fetch(`${apiUrl}/registrations/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data registrasi kamu.");
        }

        const data: MyRegistration[] = await res.json();
        setRegistrations(data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRegistrations();
  }, [apiUrl]);

  // Helper format tanggal rentang kompetisi (contoh: "Aug 1, 2026 - Sep 13, 2026")
  const formatDateRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "-";
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    const start = new Date(startStr).toLocaleDateString("en-US", options);
    const end = new Date(endStr).toLocaleDateString("en-US", options);
    return `${start} - ${end}`;
  };

  // Helper dinamis untuk menentukan warna visual status
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-amber-500";
      case "approved":
      case "success":
      case "done":
        return "text-green-500";
      default:
        return "text-red-500";
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">My Registrations</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your registered competitions. Don't forget to finish the ones that are still ongoing!</p>
      </div>

      {/* RENDER KONDISIONAL: LOADING & ERROR */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading registrations...</div>
      ) : error ? (
        <div className="text-center py-20 font-bold text-red-500 bg-red-50 rounded-[2rem] border border-red-100">{error}</div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-20 font-bold text-gray-500 bg-white rounded-[2rem] border border-gray-100 shadow-sm">You haven't registered for any competitions yet.</div>
      ) : (
        /* Registrations Card Container */
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="flex flex-col">
            {registrations.map((reg) => (
              <div
                key={reg.registration_id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
              >
                {/* Left Side: Competition Name & Category/Type */}
                <div className="space-y-1 mb-4 md:mb-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-md font-bold text-gray-800 tracking-tight">{reg.title}</h2>
                    <span className={`text-[10px] font-black tracking-wider uppercase ${getStatusStyles(reg.status)}`}>{reg.status}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                    Category: {reg.category} • <span className="normal-case">{reg.competition_type}</span>
                  </p>
                </div>

                {/* Right Side: Date Range */}
                <div className="text-left md:text-right">
                  <div className="text-sm font-bold text-gray-800">{formatDateRange(reg.start_date, reg.end_date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
