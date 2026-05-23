"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface CompetitionDetail {
  competition_id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  schedule: string;
  start_date: string;
  end_date: string;
  registration_link: string;
  organizer_id: string;
  admin_id: string | null;
  created_at: string;
}

export default function Main() {
  const params = useParams();
  const router = useRouter();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/competitions/${params.id}`);

        if (!res.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const data: CompetitionDetail = await res.json();
        setCompetition(data);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompetitionData();
    }
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] text-[#1e5297] font-bold">Loading data dari API...</div>;
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-red-500 font-bold gap-4">
        <p>{error || "Kompetisi tidak ditemukan."}</p>
        <button onClick={() => router.back()} className="text-sm bg-[#1e5297] text-white px-4 py-2 rounded-xl">
          Kembali
        </button>
      </div>
    );
  }

  // Helper format tanggal (contoh: "May 30, 2026")
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper format jam (contoh: "00:00")
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Susun baris jadwal dinamis berbasis tanggal dari response API
  const scheduleItems = [
    { activity: "Registration Deadline", isoDate: competition.deadline },
    { activity: "Competition Starts", isoDate: competition.start_date },
    { activity: "Competition Ends & Submission", isoDate: competition.end_date },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-5xl w-full mx-auto px-6 md:px-12 py-10 font-sans">
        {/* HEADER SECTION: TOMBOL BACK & TEXT SEJAJAR */}
        <div className="flex items-start gap-4 mb-8">
          {/* Tombol Back */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1e5297] hover:bg-gray-50 transition-colors cursor-pointer outline-none flex-shrink-0 mt-0.5"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Header Title */}
          <div>
            <h1 className="text-3xl font-black text-[#1e5297] tracking-tight leading-none">Campus Competition</h1>
            <p className="text-gray-400 text-xs font-semibold mt-2 leading-tight">Here lies your personal account information and overall achievement</p>
          </div>
        </div>

        {/* MAIN DISPLAY CARD BOX */}
        <div className="w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
          {/* Header Banner */}
          <div className="bg-[#1e5297] px-8 py-16 md:py-20 relative flex flex-col justify-end items-start min-h-[220px]">
            <span className="absolute top-6 right-8 bg-white text-[#1e5297] text-[10px] font-black tracking-wider px-4 py-1.5 rounded-full shadow-sm">{competition.category}</span>
            <h2 className="text-white text-2xl md:text-4xl font-black tracking-tight mt-auto">{competition.title}</h2>
          </div>

          {/* Content Grid */}
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left & Center Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Deskripsi */}
              <div className="space-y-3">
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Description</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{competition.description}</p>
              </div>

              {/* Jadwal / Linimasa */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Schedule</h3>
                <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-4 border border-gray-100/50">
                  {scheduleItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm font-bold text-gray-600 border-b border-gray-200/40 pb-3 last:border-none last:pb-0">
                      <span className="text-gray-700 font-extrabold">{item.activity}</span>
                      <div className="flex items-center gap-4 text-gray-400 font-semibold text-xs">
                        <span>{formatDate(item.isoDate)}</span>
                        <span className="text-gray-500 font-bold">{formatTime(item.isoDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content: Quick Info Card */}
            <div className="w-full">
              <div className="bg-gray-50 rounded-[2rem] border border-gray-100/60 p-6 space-y-6 flex flex-col justify-between h-fit sticky top-6">
                <div>
                  <h4 className="text-base font-black text-gray-800 tracking-tight mb-4">Quick Info</h4>

                  <div className="space-y-3 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-gray-600">{formatDate(competition.deadline)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Venue / Platform:</span>
                      <span className="text-gray-600">{competition.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Organizer ID:</span>
                      <span className="text-gray-600">#{competition.organizer_id}</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Pendaftaran Link Eksternal */}
                <a
                  href={competition.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#8cabd9] hover:bg-[#365D92] text-white rounded-xl text-xs font-extrabold tracking-wide shadow-sm transition-all text-center block"
                >
                  Register Competition
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
