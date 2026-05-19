const Main = () => {
  const registrations = [
    {
      title: "VIBEZ CODING COMPETITION",
      organizer: "BNCC",
      status: "ONGOING",
      statusColor: "text-red-500",
      dateRange: "April 4, 2026 - April 11, 2026",
    },
    {
      title: "UNTECH COMPETITION",
      organizer: "HIMTI",
      status: "ONGOING",
      statusColor: "text-red-500",
      dateRange: "April 7, 2026 - April 21, 2026",
    },
    {
      title: "DATA SCIENTIST COMPETITION",
      organizer: "DATA SCIENCE CLUB",
      status: "DONE",
      statusColor: "text-green-500",
      dateRange: "March 15, 2026 - April 5, 2026",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">My Registrations</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your registered competition. Don't forget to finish one that is still ongoing!</p>
      </div>

      {/* Registrations Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {registrations.map((reg, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              {/* Left Side: Competition Name & Organizer */}
              <div className="space-y-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-md font-bold text-gray-800 tracking-tight">{reg.title}</h2>
                  <span className={`text-[9px] font-black tracking-tighter ${reg.statusColor}`}>{reg.status}</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium uppercase">By: {reg.organizer}</p>
              </div>

              {/* Right Side: Date Range */}
              <div className="text-left md:text-right">
                <div className="text-sm font-bold text-gray-800">{reg.dateRange}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
