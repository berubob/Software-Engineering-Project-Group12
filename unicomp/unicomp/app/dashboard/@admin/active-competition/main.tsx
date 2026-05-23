"use client";
import Link from "next/link";

export default function Main() {
  // Data dummy
  const competitions = [
    {
      id: "vibez-coding",
      name: "VIBEZ CODING COMPETITION",
      organizer: "By: BNCC",
      status: "ONGOING",
      statusColor: "text-green-500",
      dateRange: "April 4, 2026 - April 11, 2026",
    },
    {
      id: "untech",
      name: "UNTECH COMPETITION",
      organizer: "By: HIMTI",
      status: "ONGOING",
      statusColor: "text-green-500",
      dateRange: "April 7, 2026 - April 21, 2026",
    },
    {
      id: "nat-hackathon",
      name: "National Hackathon 2026",
      organizer: "By: HIMTI",
      status: "UPCOMING",
      statusColor: "text-red-500",
      dateRange: "April 14, 2026 - April 15, 2026",
    },
    {
      id: "ctf-capture",
      name: "Capture The Flag (CTF)",
      organizer: "By: Cyber Club",
      status: "UPCOMING",
      statusColor: "text-red-500",
      dateRange: "May 1, 2026 - May 10, 2026",
    },
    {
      id: "nds-data-science",
      name: "NDS Data Science Challenge",
      organizer: "By: Math Club",
      status: "UPCOMING",
      statusColor: "text-red-500",
      dateRange: "May 13, 2026 - May 29, 2026",
    },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">Currently Active Competition</h1>
        <p className="text-gray-400 text-sm mt-1">Here is all of currently active competition</p>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {competitions.map((comp) => (
            <div key={comp.id} className="p-8 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-black text-gray-700 tracking-tight">{comp.name}</h3>
                  {/* Status Label */}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${comp.statusColor}`}>{comp.status}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{comp.organizer}</p>
              </div>

              {/* Date Range - Rata Kanan */}
              <div className="text-right">
                <p className="text-sm font-black text-gray-700">{comp.dateRange}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
