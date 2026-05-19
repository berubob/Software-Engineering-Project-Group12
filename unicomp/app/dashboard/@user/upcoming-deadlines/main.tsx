const Main = () => {
  const deadlines = [
    {
      title: "VIBEZ CODING COMPETITION",
      nextStep: "Mid-Point Check-In",
      time: "21:00",
      date: "April 11, 2026",
      priority: "HIGH PRIORITY",
      priorityColor: "text-red-500",
    },
    {
      title: "UNTECH COMPETITION",
      nextStep: "Proposal Submission",
      time: "23:59",
      date: "April 21, 2026",
      priority: "LOW PRIORITY",
      priorityColor: "text-green-500",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">Upcoming Deadlines</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your active competition deadlines. Make sure to finish one with higher priority first!</p>
      </div>

      {/* Deadlines Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="flex flex-col">
          {deadlines.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              {/* Left Side: Competition Info */}
              <div className="space-y-1 mb-4 md:mb-0">
                <h2 className="text-md font-bold text-gray-800 tracking-tight">{item.title}</h2>
                <p className="text-[11px] text-gray-400 font-medium">Next Step: {item.nextStep}</p>
              </div>

              {/* Right Side: Date & Priority */}
              <div className="text-left md:text-right space-y-1">
                <div className="text-md font-bold text-gray-800">
                  {item.time} - <span className="font-bold">{item.date}</span>
                </div>
                <div className={`text-[10px] font-black tracking-widest ${item.priorityColor}`}>{item.priority}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
