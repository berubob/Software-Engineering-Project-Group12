"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarDate {
  date: number;
  currentMonth: boolean;
  isToday: boolean;
  isRed: boolean;
  isGreen: boolean;
  fullDateString: string;
}

export default function Main() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // State kalender otomatis mengikuti waktu riil saat ini (Real-time)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]); // Siap untuk menampung data dari API

  // Contoh data dari API (Gunakan format standard ISO YYYY-MM-DD agar sinkron otomatis)
  useEffect(() => {
    const mockApiResponse = [
      {
        date: "2026-04-11",
        time: "21:00",
        title: "VIBEZ CODING COMPETITION",
        nextStep: "Mid-Point Check-In",
        colorType: "red",
        bgColor: "bg-[#ff5f5f]",
      },
      {
        date: "2026-04-21",
        time: "23:59",
        title: "UNTECH COMPETITION",
        nextStep: "Proposal Submission",
        colorType: "green",
        bgColor: "bg-[#2ade5d]",
      },
    ];
    setEventsData(mockApiResponse);
  }, []);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const datesArray: CalendarDate[] = [];
    const today = new Date();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevMonthDate = new Date(year, month, -i);
      const dateStr = prevMonthDate.toISOString().split("T")[0];

      datesArray.push({
        date: prevMonthDate.getDate(),
        currentMonth: false,
        isToday: false,
        isRed: eventsData.some((e) => e.date === dateStr && e.colorType === "red"),
        isGreen: eventsData.some((e) => e.date === dateStr && e.colorType === "green"),
        fullDateString: dateStr,
      });
    }

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
        isRed: eventsData.some((e) => e.date === dateStr && e.colorType === "red"),
        isGreen: eventsData.some((e) => e.date === dateStr && e.colorType === "green"),
        fullDateString: dateStr,
      });
    }

    const remainingSlots = 42 - datesArray.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonthDate = new Date(year, month + 1, i);
      const dateStr = nextMonthDate.toISOString().split("T")[0];

      datesArray.push({
        date: i,
        currentMonth: false,
        isToday: false,
        isRed: eventsData.some((e) => e.date === dateStr && e.colorType === "red"),
        isGreen: eventsData.some((e) => e.date === dateStr && e.colorType === "green"),
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

  const filteredEvents = eventsData.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20 w-full font-sans">
      {/* Header Section (Menampilkan Tanggal Real-Time Hari Ini) */}
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
                    ${item.isGreen ? "bg-[#2ade5d] text-white shadow-sm" : ""}
                  `}
                >
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Event Details */}
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-medium text-sm bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm">No competition deadline this month.</div>
          ) : (
            filteredEvents.map((event, idx) => {
              const dayNumber = event.date.split("-")[2];
              return (
                <div key={idx} className={`${event.bgColor} rounded-[1.5rem] p-6 text-white shadow-md transform hover:scale-[1.01] transition-transform`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-4xl font-bold">{dayNumber}</span>
                    <span className="text-lg font-bold">{event.time}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 tracking-wide">{event.title}</h3>
                  <p className="text-[10px] font-medium opacity-90 italic">Next Step: {event.nextStep}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
