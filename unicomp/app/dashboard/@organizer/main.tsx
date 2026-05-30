"use client";
import React from "react";
import { Trophy, Clock, User } from "lucide-react";
import Link from "next/link";

export default function Main() {
  // Stat data mockup yang disesuaikan persis dengan gambar kedua
  const stats = [
    {
      title: "Published",
      count: 1,
      icon: <Trophy className="text-[#f59e0b] w-5 h-5" />,
      iconBg: "bg-[#fef3c7]",
    },
    {
      title: "Pending Approval",
      count: 2,
      icon: <Clock className="text-[#ef4444] w-5 h-5" />,
      iconBg: "bg-[#fee2e2]",
    },
    {
      title: "Draft",
      count: 1,
      icon: <Trophy className="text-[#f59e0b] w-5 h-5" />,
      iconBg: "bg-[#fef3c7]",
    },
    {
      title: "Total Participant",
      count: 76,
      icon: <User className="text-[#3b82f6] w-5 h-5" />,
      iconBg: "bg-[#dbeafe]",
    },
  ];

  return (
    <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans">
      {/* Dashboard Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Organizer Workshop</h1>
        <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">This is organizer dashboard! Manage and update your own competition all on this website</p>
      </div>

      {/* Grid Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex items-start justify-between">
              <span className="text-gray-500 font-bold text-sm tracking-tight">{stat.title}</span>
              <div className={`p-2.5 rounded-full ${stat.iconBg} flex items-center justify-center`}>{stat.icon}</div>
            </div>

            <div className="flex items-end justify-between mt-4">
              <span className="text-5xl font-black text-gray-800 tracking-tighter">{stat.count}</span>
              {stat.title !== "Total Participant" && <button className="text-xs font-bold text-gray-400 hover:text-[#1e5297] transition-colors outline-none cursor-pointer">View Detail</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Banner Create Competition */}
      <div className="w-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-700 tracking-tight">Create Competition</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Make new competition and publish all on this website!
            <br />
            Make sure to give all of the valid and necessary information!
          </p>
        </div>
        <Link href="/dashboard/create-new-competition">
          <button className="bg-[#8cabd9] hover:bg-[#365D92] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-sm whitespace-nowrap transition-colors cursor-pointer outline-none">
            Create New Competition
          </button>
        </Link>
      </div>
    </main>
  );
}
