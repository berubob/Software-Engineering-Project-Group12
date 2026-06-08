"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDashboard } from "./middleware";
import { Trophy, Loader2 } from "lucide-react";

export default function Main() {
  const { stats, registrations, competitionResults, loadingReg, loadingResults } = useDashboard();

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20">
      {/* Header Title */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-[#1e40af]">Campus Competition Overview</div>
        <div className="text-gray-500 text-sm mt-1">This is your dashboard! Here you can view competition overview and information</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-gray-700 w-1/2 leading-tight">{stat.label}</div>
              <div className={`${stat.color} p-2 rounded-full`}>
                <Image src={stat.icon} width={24} height={24} alt="icon" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-5xl font-bold text-gray-800">{stat.value}</div>
              <Link href={stat.href} className="text-xs text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Registrations */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[280px]">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-gray-800">My Registrations</div>
            <Link href="/dashboard/my-registration" className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
              View All
            </Link>
          </div>

          {loadingReg ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400 font-medium">Loading registered competitions...</div>
          ) : registrations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="text-gray-400 text-xs italic font-medium">No Competition Registered</div>
            </div>
          ) : (
            <div className="space-y-6">
              {registrations.map((reg, i) => (
                <Link
                  key={i}
                  href={`/dashboard/competition/${reg.id}`}
                  className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer px-2 -mx-2 rounded-lg block"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-800">{reg.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{reg.date}</div>
                  </div>
                  <div className="text-gray-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Results */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[280px]">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-gray-800">My Results</div>
            <Link href="/dashboard/my-results" className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
              View All
            </Link>
          </div>

          {loadingResults ? (
            <div className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span>Loading metrics history...</span>
            </div>
          ) : competitionResults.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <Image src="/Trophy.svg" width={20} height={20} alt="empty" className="opacity-100 grayscale brightness-120" />
              </div>
              <div className="text-gray-400 text-xs italic">No result published yet</div>
            </div>
          ) : (
            /* PERBAIKAN: Menambahkan arbitrary class Tailwind untuk menyembunyikan scrollbar baris di bawah ini.
               Serta menghapus `pr-1` agar padding kanan simetris kembali setelah scrollbar menghilang.
            */
            <div className="space-y-4 max-h-[320px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&-::-webkit-scrollbar]:none">
              {competitionResults.map((result, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${result.rank === 1 ? "bg-amber-50 text-amber-500" : result.rank === 2 ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-500"}`}
                    >
                      <Trophy size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{result.competition_title}</div>
                      {result.score !== undefined && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Score: <span className="font-semibold text-gray-600">{result.score}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md flex-shrink-0 ${result.rank === 1 ? "bg-amber-500 text-white" : result.rank === 2 ? "bg-slate-400 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {result.rank > 0 ? `Rank ${result.rank}` : "Participant"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
