"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface CompetitionAPI {
  registration_id: string;
  registration_date: string;
  status: string;
  competition_id: string;
  title: string;
  category: string;
  deadline: string; // contoh: "2026-05-30T00:00:00.000Z"
  competition_type: string;
  schedule: string | null;
  start_date: string | null;
  end_date: string;
}

export default function Main() {
  const [deadlines, setDeadlines] = useState<CompetitionAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Endpoint API Backend Railway Anda
  const RAILWAY_API_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const token = localStorage.getItem("token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${RAILWAY_API_URL}/registrations/me`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setDeadlines(data);
        } else {
          setErrorMessage("Gagal mengambil data tenggat waktu kompetisi.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Terjadi kesalahan jaringan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlines();
  }, [RAILWAY_API_URL]);

  // --- HELPER FUNCTION: PARSING FORMAT JAM & TANGGAL ---
  const formatDateTime = (isoString: string) => {
    const dateObj = new Date(isoString);

    // Format Jam (HH:MM)
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const timeFormatted = `${hours}:${minutes}`;

    // Format Tanggal (Month DD, YYYY)
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
    const dateFormatted = dateObj.toLocaleDateString("en-US", options);

    return { time: timeFormatted, date: dateFormatted };
  };

  // --- HELPER FUNCTION: LOGIKA PENENTUAN PRIORITAS (< 7 HARI) ---
  const getPriorityInfo = (deadlineStr: string) => {
    const today = new Date();
    const deadline = new Date(deadlineStr);

    // Reset jam agar perbandingan hari murni berbasis tanggal kalender
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Jika lewat deadline
    if (diffDays < 0) {
      return {
        text: "PASSED DEADLINE",
        colorClass: "text-gray-400",
      };
    }

    // Jika sisa hari <= 7 maka HIGH PRIORITY, selain itu LOW PRIORITY
    if (diffDays <= 7) {
      return {
        text: "HIGH PRIORITY",
        colorClass: "text-red-500",
      };
    } else {
      return {
        text: "LOW PRIORITY",
        colorClass: "text-green-500",
      };
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20 w-full font-sans">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">Upcoming Deadlines</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your active competition deadlines. Make sure to finish one with higher priority first!</p>
      </div>

      {/* State Handler Rendering */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium text-sm animate-pulse bg-white border border-gray-100 rounded-[2rem] shadow-sm">Loading deadlines...</div>
      ) : errorMessage ? (
        <div className="text-center py-12 text-red-500 font-medium text-sm bg-red-50 border border-red-100 rounded-[2rem] shadow-sm">{errorMessage}</div>
      ) : deadlines.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-gray-100 rounded-[2rem] shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4 border border-gray-100/50">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-700 tracking-tight">No Upcoming Deadlines</h3>
          <p className="text-xs text-gray-400 font-medium mt-1 max-w-sm">Hooray! You don't have any pressing deadlines at the moment. Keep up the good work!</p>
        </div>
      ) : (
        /* Deadlines Card Container */
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="flex flex-col">
            {deadlines.map((item) => {
              const { time, date } = formatDateTime(item.deadline);
              const priority = getPriorityInfo(item.deadline);

              return (
                <div
                  key={item.registration_id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Left Side: Competition Info */}
                  <div className="space-y-1 mb-4 md:mb-0">
                    <h2 className="text-md font-bold text-gray-800 tracking-tight uppercase">{item.title}</h2>
                    <p className="text-[11px] text-gray-400 font-medium">
                      Category: <span className="text-gray-500 font-semibold">{item.category}</span> ({item.competition_type})
                    </p>
                  </div>

                  {/* Right Side: Date & Priority */}
                  <div className="text-left md:text-right space-y-1">
                    <div className="text-md font-bold text-gray-800">
                      {time} - <span className="font-bold">{date}</span>
                    </div>
                    <div className={`text-[10px] font-black tracking-widest ${priority.colorClass}`}>{priority.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
