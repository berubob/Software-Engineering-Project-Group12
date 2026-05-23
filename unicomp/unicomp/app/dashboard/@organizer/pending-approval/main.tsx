"use client";
import React from "react";
import Image from "next/image";

export default function Main() {
  // Data mockup
  const pendingCompetitions = [
    {
      id: "pending-1",
      title: "ASYNCO COMPETITION",
      badgeText: "PUBLISH APPROVAL",
      timeline: "May 20, 2026 - May 31, 2026",
    },
    {
      id: "pending-2",
      title: "SAW-IT COMPETITION",
      badgeText: "PUBLISH APPROVAL",
      timeline: "May 21, 2026 - June 1, 2026",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Pending Approval Page Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans">
        {/* Title Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Pending Approval</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">Here lies all of your competition that has been yet to be approved by administrator</p>
        </div>

        {/* List Cards Container */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-2 overflow-hidden">
          {pendingCompetitions.map((item, index) => (
            <div key={item.id}>
              {/* Card Row */}
              <div className="w-full p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors">
                {/* Kiri: Judul Kompetisi & Badge */}
                <div className="flex flex-wrap items-center gap-6">
                  <h3 className="font-extrabold text-gray-700 text-base md:text-lg tracking-tight">{item.title}</h3>
                  <span className="text-[9px] font-black tracking-wider text-[#ef4444] bg-[#ef4444]/10 px-3 py-1.5 rounded-md">{item.badgeText}</span>
                </div>

                {/* Kanan: Tanggal Durasi */}
                <div className="text-gray-800 font-bold text-sm md:text-base tracking-tight whitespace-nowrap">{item.timeline}</div>
              </div>

              {/* Garis Pembatas Tipis Antar Baris */}
              {index < pendingCompetitions.length - 1 && <div className="h-px bg-gray-100 mx-6 md:mx-8"></div>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
