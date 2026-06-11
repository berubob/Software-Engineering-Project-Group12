"use client";
import React, { useState, useEffect } from "react";
// Tambahkan Award atau Trophy untuk pemanis ketika data kosong
import { Info, Award } from "lucide-react";

interface CompetitionAPI {
  registration_id: string;
  registration_date: string;
  status: string;
  competition_id: string;
  title: string;
  category: string;
  deadline: string;
  competition_type: string;
  schedule: string | null;
  start_date: string | null;
  end_date: string;
}

export default function Main() {
  const [competitions, setCompetitions] = useState<CompetitionAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const RAILWAY_API_URL = process.env.NEXT_PUBLIC_VERCEL_URL;

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const token = localStorage.getItem("token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${RAILWAY_API_URL}/registrations/me`, {
          method: "GET",
          headers: headers,
        });

        if (response.ok) {
          const data = await response.json();
          setCompetitions(data);
        } else {
          setErrorMessage("Gagal mengambil data kompetisi aktif.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Terjadi kesalahan jaringan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [RAILWAY_API_URL]);

  const calculateDaysLeft = (deadlineStr: string) => {
    const today = new Date();
    const deadline = new Date(deadlineStr);

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Today is Deadline";
    return `${diffDays} Days Remaining`;
  };

  const calculateProgress = (startDateStr: string, deadlineStr: string) => {
    const today = new Date().getTime();
    const start = new Date(startDateStr).getTime();
    const end = new Date(deadlineStr).getTime();

    if (today >= end) return "100%";
    if (today <= start) return "0%";

    const totalDuration = end - start;
    const elapsed = today - start;

    const percentage = Math.round((elapsed / totalDuration) * 100);
    return `${percentage}%`;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 w-full font-sans">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">Active Competition</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your active competition. Make sure to complete all of it on time!</p>
      </div>

      {/* State Handler Rendering */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-medium text-sm animate-pulse bg-white border border-gray-100 rounded-[2rem] shadow-sm">Loading active competitions...</div>
      ) : errorMessage ? (
        <div className="text-center py-12 text-red-500 font-medium text-sm bg-red-50 border border-red-100 rounded-[2rem] shadow-sm">{errorMessage}</div>
      ) : competitions.length === 0 ? (
        /* --- TAMPILAN KETIKA TIDAK ADA DATA --- */
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white border border-gray-100 rounded-[2rem] shadow-sm p-8">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4 border border-gray-100/50">
            <Award size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-700 tracking-tight">No Active Competition</h3>
          <p className="text-xs text-gray-400 font-medium mt-1 max-w-sm">You are not registered in any competition at the moment. Explore the competition page to get started!</p>
        </div>
      ) : (
        /* Grid Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            const daysLeftText = calculateDaysLeft(comp.deadline);
            const progressPercentage = calculateProgress(comp.registration_date, comp.deadline);

            return (
              <div key={comp.registration_id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                {/* Top Row: Title & Badge */}
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 tracking-tight uppercase">{comp.title}</h2>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      Category: <span className="text-gray-600 font-semibold">{comp.category}</span> ({comp.competition_type})
                    </p>
                  </div>
                  <div className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap">{daysLeftText}</div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-50 my-6"></div>

                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Progress</span>
                    <span className="text-[10px] font-bold text-gray-500">{progressPercentage}</span>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100/50">
                    {/* The Blue Fill */}
                    <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-700" style={{ width: progressPercentage }}></div>
                  </div>
                </div>

                {/* Bottom Row: Status Information */}
                <div className="flex items-center gap-2 text-gray-400 pt-1">
                  <Info size={16} className="text-blue-400" />
                  <div className="text-[11px] font-medium">
                    Registration Status: <span className="text-gray-600 font-bold capitalize">{comp.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
