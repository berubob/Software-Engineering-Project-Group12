"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import BackButton from "@/components/global_components/backButton";

interface Competition {
  competition_id: string;
  title: string;
  description: string;
  category: string;
  competition_type: string;
  deadline: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
}

export default function Main() {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  useEffect(() => {
    const fetchAndFilterCompetitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${apiUrl}/competitions`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data kompetisi dari server.");
        }

        const data: Competition[] = await res.json();

        // Waktu sekarang (Tahun berjalan: 2026)
        const today = new Date();

        // Filter, Map, dan Urutkan kompetisi
        const filtered = data
          .map((comp) => {
            const startDate = new Date(comp.start_date);
            const endDate = new Date(comp.end_date);

            let status = "";
            let statusColor = "";

            if (today >= startDate && today <= endDate) {
              status = "ONGOING";
              statusColor = "text-green-500";
            } else if (today < startDate) {
              status = "UPCOMING";
              statusColor = "text-red-500";
            }

            return {
              ...comp,
              status,
              statusColor,
              dateRange: `${formatDate(comp.start_date)} - ${formatDate(comp.end_date)}`,
            };
          })
          // Hanya tampilkan yang berstatus ONGOING atau UPCOMING
          .filter((comp) => comp.status !== "")
          // Mengurutkan: ONGOING ditaruh di paling atas
          .sort((a, b) => {
            if (a.status === "ONGOING" && b.status === "UPCOMING") return -1;
            if (a.status === "UPCOMING" && b.status === "ONGOING") return 1;

            // Jika statusnya sama, urutkan berdasarkan start_date terdekat
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
          });

        setCompetitions(filtered);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterCompetitions();
  }, [apiUrl]);

  // Helper format tanggal (contoh: "April 4, 2026")
  const formatDate = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-[#1e40af] font-bold gap-2">
        <Loader2 size={32} className="animate-spin text-[#1e40af]" />
        <p className="text-sm">Loading competitions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-red-500 font-bold gap-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Section */}
      <div className="mb-10">
        <BackButton />
        <h1 className="text-3xl font-bold text-[#1e40af]">Currently Active Competition</h1>
        <p className="text-gray-400 text-sm mt-1">Here is all of currently active competition</p>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {competitions.length === 0 ? (
          <div className="p-10 text-center text-gray-400 font-medium text-sm">No ongoing or upcoming competitions found at the moment.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {competitions.map((comp) => (
              <div key={comp.competition_id} className="p-8 flex justify-between items-center hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-black text-gray-700 tracking-tight">{comp.title}</h3>
                    {/* Status Label (ONGOING / UPCOMING) */}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${comp.statusColor}`}>{comp.status}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                    Category: {comp.category} | Type: {comp.competition_type}
                  </p>
                </div>

                {/* Date Range - Rata Kanan */}
                <div className="text-right">
                  <p className="text-sm font-black text-gray-700">{comp.dateRange}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
