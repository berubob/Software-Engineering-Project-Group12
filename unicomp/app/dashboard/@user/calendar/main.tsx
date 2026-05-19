import { ChevronLeft, ChevronRight } from "lucide-react";

const Main = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Contoh data tanggal (bisa disesuaikan dengan logic kalender nantinya)
  const calendarDates = [
    { date: 29, currentMonth: false },
    { date: 30, currentMonth: false },
    { date: 31, currentMonth: false },
    { date: 1, currentMonth: true },
    { date: 2, currentMonth: true },
    { date: 3, currentMonth: true },
    { date: 4, currentMonth: true },
    { date: 5, currentMonth: true },
    { date: 6, currentMonth: true },
    { date: 7, currentMonth: true, isToday: true },
    { date: 8, currentMonth: true },
    { date: 9, currentMonth: true },
    { date: 10, currentMonth: true },
    { date: 11, currentMonth: true, isRed: true },
    { date: 12, currentMonth: true },
    { date: 13, currentMonth: true },
    { date: 14, currentMonth: true },
    { date: 15, currentMonth: true },
    { date: 16, currentMonth: true },
    { date: 17, currentMonth: true },
    { date: 18, currentMonth: true },
    { date: 19, currentMonth: true },
    { date: 20, currentMonth: true },
    { date: 21, currentMonth: true, isGreen: true },
    { date: 22, currentMonth: true },
    { date: 23, currentMonth: true },
    { date: 24, currentMonth: true },
    { date: 25, currentMonth: true },
    { date: 26, currentMonth: true },
    { date: 27, currentMonth: true },
    { date: 28, currentMonth: true },
    { date: 29, currentMonth: true },
    { date: 30, currentMonth: true },
    { date: 1, currentMonth: false },
    { date: 2, currentMonth: false },
  ];

  const events = [
    {
      day: "11",
      time: "21:00",
      title: "VIBEZ CODING COMPETITION",
      nextStep: "Mid-Point Check-In",
      bgColor: "bg-[#ff5f5f]",
    },
    {
      day: "21",
      time: "23:59",
      title: "UNTECH COMPETITION",
      nextStep: "Proposal Submission",
      bgColor: "bg-[#2ade5d]",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Competition Calendar</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage all of your competition on this calendar!</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-gray-700">Tue, 7</div>
          <p className="text-gray-400 text-sm mt-1">Today: April 7, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Calendar Card */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          {/* Calendar Controller */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <button className="text-gray-400 hover:text-blue-600">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-gray-700">April 2026</span>
            <button className="text-gray-400 hover:text-blue-600">
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
                  text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full
                  ${item.currentMonth ? "text-gray-600" : "text-gray-300"}
                  ${item.isToday ? "text-blue-500" : ""}
                  ${item.isRed ? "bg-[#ff5f5f] text-white" : ""}
                  ${item.isGreen ? "bg-[#2ade5d] text-white" : ""}
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
          {events.map((event, idx) => (
            <div key={idx} className={`${event.bgColor} rounded-[1.5rem] p-6 text-white shadow-md`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl font-bold">{event.day}</span>
                <span className="text-lg font-bold">{event.time}</span>
              </div>
              <h3 className="font-bold text-sm mb-1">{event.title}</h3>
              <p className="text-[10px] font-medium opacity-90 italic">Next Step: {event.nextStep}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
