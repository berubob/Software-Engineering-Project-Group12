const Main = () => {
  const notifications = [
    {
      title: "VIBEZ UPLOAD REMINDER",
      status: "UNREAD",
      time: "1 hour ago",
      desc: "Announcement: Reminder to all of Vibez Coding Competition to upload your project at max at April 11, 2026. Make sure to upload all of your work with following UI Design (.fig), ...",
    },
    {
      title: "VIBEZ MID POINT CHECK IN",
      status: "UNREAD",
      time: "7 hours ago",
      desc: "System Reminder: Mid-point Check-in will be held soon at April 8, 2026 at 12:00. Don't forget to attend this activity.",
    },
    {
      title: "COMPETITION BRIEFING",
      status: "UNREAD",
      time: "2 days ago",
      desc: "Announcement: Hi, all Competition Enjoyer! Don't forget to attend the Competition Briefing at 19:00 - 21:00, April 6, 2026. The meeting will be held at zoom room ID: 911620, ...",
    },
    {
      title: "UNTECH COMPETITION",
      status: "READ",
      time: "11 days ago",
      desc: "Announcement: Hi, all Competition Enjoyer! Before the competition will be start next week, there will be an Competition Briefing at 19:00 - 21:00, April 6, 2026. The meeting code ...",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Competition Notifications</h1>
          <p className="text-gray-500 mt-2 text-sm">Here is all of your competition updates. Make sure not to miss them!</p>
        </div>
        <button className="text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors mt-4 md:mt-0 uppercase tracking-tighter">Mark All Read</button>
      </div>

      {/* Notifications Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {notifications.map((notif, index) => (
            <div key={index} className="p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-gray-800 tracking-tight">{notif.title}</h2>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${notif.status === "UNREAD" ? "text-red-500" : "text-green-500"}`}>{notif.status}</span>
                </div>
                <span className="text-[11px] text-gray-400">{notif.time}</span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed max-w-[90%] line-clamp-2 md:line-clamp-none">{notif.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
