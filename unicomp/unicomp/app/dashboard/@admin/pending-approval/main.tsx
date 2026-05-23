"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Main() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Hackathon", "Data Science", "Design", "Cybersecurity", "Others"];

  const pendingList = [
    {
      id: 1,
      name: "ASYNCO COMPETITION",
      organizer: "By: BNCC",
      dateRange: "May 20, 2026 - May 31, 2026",
    },
    {
      id: 2,
      name: "SAW-IT COMPETITION",
      organizer: "By: BNCC",
      dateRange: "May 21, 2026 - June 1, 2026",
    },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e40af]">Pending Approval</h1>
        <p className="text-gray-400 text-sm mt-1">Here is all of competition that has not been approved yet</p>
      </div>

      {/* Filter Bar Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Search Competitions..."
            className="w-full bg-[#F9FAFB] border border-gray-50 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-500 outline-none focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-300"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? "bg-[#4593DF] text-white shadow-md" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Text */}
      <div className="flex justify-end mb-4">
        <button className="text-xs font-bold text-gray-400 hover:text-[#1e40af] transition-colors">Approve All</button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {pendingList.map((item, index) => (
            <Link href={`/dashboard/pending-approval/${item.id}`} key={item.id}>
              <div className="p-8 flex justify-between items-center hover:bg-gray-50/50 transition-colors cursor-pointer group">
                <div>
                  <h3 className="text-lg font-black text-gray-700 tracking-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{item.organizer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-700">{item.dateRange}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
