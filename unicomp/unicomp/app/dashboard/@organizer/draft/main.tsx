"use client";
import React from "react";
import Image from "next/image";

export default function Main() {
  // Data Mockup
  const draftList = [
    {
      id: "draft-1",
      title: "Z-TECH COMPETITION",
      timeline: "June 1, 2026 - June 11, 2026",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-hidden">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Draft Page Background" fill className="object-cover object-center" priority />
      </div>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-16 font-sans">
        {/* Judul & Deskripsi Halaman */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e5297] tracking-tight">Draft</h1>
          <p className="mt-3 text-gray-500 font-medium text-sm md:text-base max-w-2xl leading-relaxed">Here lies all of your saved draft. Make sure to continue edit them and send your competition</p>
        </div>

        {/* List Card Area */}
        <div className="space-y-4">
          {draftList.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-300 text-gray-400 font-bold">No drafts found.</div>
          ) : (
            draftList.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Sisi Kiri: Judul Kompetisi */}
                <div className="flex items-center">
                  <h3 className="font-extrabold text-gray-700 text-lg md:text-xl tracking-tight group-hover:text-[#1e5297] transition-colors">{item.title}</h3>
                </div>

                {/* Sisi Kanan: Rentang Waktu */}
                <div className="text-gray-800 font-bold text-sm md:text-lg tracking-tight bg-gray-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl">{item.timeline}</div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
