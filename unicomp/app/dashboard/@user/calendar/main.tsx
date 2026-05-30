"use client";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarDate {
  date: number;
  currentMonth: boolean;
  isToday: boolean;
  isRed: boolean;
  isGreen: boolean;
  fullDateString: string;
}

interface RegistrationEvent {
  registration_id: string;
  registration_date: string;
  status: string;
  competition_id: string;
  title: string;
  category: string;
  deadline: string;
  competition_type: string;
  schedule: string | null;
  start_date: string | null;
  end_date: string;
}

export default function Main() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [eventsData, setEventsData] = useState<RegistrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const RAILWAY_API_URL = process.env.NEXT_PUBLIC_RAILWAY_URL;

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        // 1. Ambil JWT token dari localStorage
        const token = localStorage.getItem("token");

        // 2. Setup Headers
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // 3. Sisipkan token jika tersedia
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        } else {
          console.warn("JWT Token tidak ditemukan di localStorage!");
        }

        // 4. Hit langsung ke endpoint Railway API
        const response = await fetch(`${RAILWAY_API_URL}/registrations/me`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setEventsData(data);
        } else if (response.status === 401) {
          setErrorMessage("Unauthorized. Sesi kamu habis, silakan login kembali.");
          console.error("Token invalid atau kedaluwarsa.");
        } else {
          setErrorMessage("Gagal memuat data kompetisi dari server.");
          console.error("Failed to fetch registrations data:", response.statusText);
        }
      } catch (error) {
        setErrorMessage("Terjadi kesalahan jaringan saat menghubungi server.");
        console.error("Error fetching data from API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [RAILWAY_API_URL]);

  // --- HELPER UNTUK EKSTRAKSI STRING TANGGAL (YYYY-MM-DD) ---
  const getIsoDateString = (isoString: string | null) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
  };

  // --- LOGIKA GENERATE GRID KALENDER ---
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const datesArray: CalendarDate[] = [];
    const today = new Date();

    // 1. Tanggal dari Bulan Sebelumnya
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month, -i);
      const dateStr = prevMonthDate.toISOString().split("T")[0];

      datesArray.push({
        date: prevMonthDate.getDate(),
        currentMonth: false,
        isToday: false,
        isRed: eventsData.some((e) => getIsoDateString(e.deadline) === dateStr),
        isGreen: eventsData.some((e) => getIsoDateString(e.registration_date) === dateStr),
        fullDateString: dateStr,
      });
    }

    // 2. Tanggal Bulan Berjalan (Current Month)
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const activeDate = new Date(year, month, i);
      const offset = activeDate.getTimezoneOffset();
      const localActiveDate = new Date(activeDate.getTime() - offset * 60 * 1000);
      const dateStr = localActiveDate.toISOString().split("T")[0];

      const checkToday = today.getDate() === i && today.getMonth() === month && today.getFullYear() === year;

      datesArray.push({
        date: i,
        currentMonth: true,
        isToday: checkToday,
        isRed: eventsData.some((e) => getIsoDateString(e.deadline) === dateStr),
        isGreen: eventsData.some((e) => getIsoDateString(e.registration_date) === dateStr),
        fullDateString: dateStr,
      });
    }

    // 3. Tanggal Bulan Berikutnya (Sisa Grid Slot)
    const remainingSlots = 42 - datesArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthDate = new Date(year, month + 1, i);
      const dateStr = nextMonthDate.toISOString().split("T")[0];

      datesArray.push({
        date: i,
        currentMonth: false,
        isToday: false,
        isRed: eventsData.some((e) => getIsoDateString(e.deadline) === dateStr),
        isGreen: eventsData.some((e) => getIsoDateString(e.registration_date) === dateStr),
        fullDateString: dateStr,
      });
    }

    setCalendarDates(datesArray);
  }, [currentDate, eventsData]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // --- FILTER SIDEBAR EVENT (Bulan & Tahun ini) ---
  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const deadlineDate = new Date(event.deadline);
      const regDate = new Date(event.registration_date);

      return (
        (deadlineDate.getMonth() === currentDate.getMonth() && deadlineDate.getFullYear() === currentDate.getFullYear()) ||
        (regDate.getMonth() === currentDate.getMonth() && regDate.getFullYear() === currentDate.getFullYear())
      );
    });
  }, [eventsData, currentDate]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20 w-full font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Competition Calendar</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage all of your competition on this calendar!</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-gray-700 tracking-tight">{new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}</div>
          <p className="text-gray-400 text-sm mt-1">Today: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Calendar Card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          {/* Calendar Controller */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button onClick={handlePrevMonth} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors p-1">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-gray-700 min-w-32 text-center">{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            <button onClick={handleNextMonth} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors p-1">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days Name */}
          <div className="grid grid-cols-7 mb-4">
            {days.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-blue-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-y-4">
            {calendarDates.map((item, idx) => (
              <div key={idx} className="flex justify-center items-center h-12 relative">
                <span
                  className={`
                    text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full transition-all
                    ${item.currentMonth ? "text-gray-600" : "text-gray-300"}
                    ${item.isToday ? "text-blue-600 ring-2 ring-blue-500/20 bg-blue-50/80 shadow-sm" : ""}
                    ${item.isRed ? "bg-[#ff5f5f] text-white shadow-sm" : ""}
                    ${item.isGreen && !item.isRed ? "bg-[#2ade5d] text-white shadow-sm" : ""}
                  `}
                  title={item.fullDateString}
                >
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Event Details */}
        <div className="space-y-6">
          <div className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Timeline Cards</div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 font-medium text-sm bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm animate-pulse">Loading API Data...</div>
          ) : errorMessage ? (
            <div className="text-center py-12 text-red-500 font-medium text-sm bg-red-50 border border-red-100 rounded-[1.5rem] p-6 shadow-sm">{errorMessage}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium text-sm bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm">No competition timeline this month.</div>
          ) : (
            filteredEvents.map((event, idx) => {
              const deadlineDay = event.deadline.split("T")[0].split("-")[2];
              const regDay = event.registration_date.split("T")[0].split("-")[2];

              return (
                <div key={idx} className="space-y-4">
                  {/* Card 1: Bagian Deadline (Merah) */}
                  <div className="bg-[#ff5f5f] rounded-[1.5rem] p-6 text-white shadow-md transform hover:scale-[1.01] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl font-bold">{deadlineDay}</span>
                      <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">{event.competition_type}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1 tracking-wide uppercase">{event.title}</h3>
                    <p className="text-[10px] font-medium opacity-90 italic">Next Step: Final Submission Deadline ({event.category})</p>
                  </div>

                  {/* Card 2: Bagian Registration Date (Hijau) */}
                  <div className="bg-[#2ade5d] rounded-[1.5rem] p-6 text-white shadow-md transform hover:scale-[1.01] transition-transform">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl font-bold">{regDay}</span>
                      <span className="text-xs font-bold bg-black/10 px-2.5 py-1 rounded-full uppercase tracking-wider text-emerald-900">{event.status}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1 tracking-wide uppercase">{event.title}</h3>
                    <p className="text-[10px] font-medium opacity-90 italic text-emerald-95">Status: Initial Registration Logged</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
