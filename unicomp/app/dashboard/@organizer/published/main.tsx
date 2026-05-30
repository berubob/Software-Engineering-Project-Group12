"use client";
import React from "react";
import Image from "next/image";

export default function Main() {
  // Hardcoded Data
  const publishedList = [
    {
      id: "comp-1",
      title: "VIBEZ CODING COMPETITION",
      status: "ONGOING",
      timeline: "April 4, 2026 - April 11, 2026",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Published Page Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans">
        {/* Dashboard Title Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Published Competition</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">View all of your published competition here, ones either still ongoing or finished</p>
        </div>

        {/* List Content Area */}
        <div className="space-y-4">
          {publishedList.map((item) => (
            <div key={item.id} className="w-full bg-white rounded-[1.75rem] border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Sisi Kiri: Judul & Badge Status */}
              <div className="flex flex-wrap items-center gap-6">
                <h3 className="font-extrabold text-gray-700 text-base md:text-lg tracking-tight">{item.title}</h3>
                <span className="text-[10px] font-black tracking-wider text-[#2ade5d] bg-[#2ade5d]/10 px-3 py-1 rounded-full">{item.status}</span>
              </div>

              {/* Sisi Kanan: Rentang Timeline */}
              <div className="text-gray-800 font-bold text-sm md:text-base tracking-tight whitespace-nowrap">{item.timeline}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
