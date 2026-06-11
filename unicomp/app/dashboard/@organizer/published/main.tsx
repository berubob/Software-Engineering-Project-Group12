"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Award } from "lucide-react";

interface Competition {
  competition_id: string;
  title: string;
  competition_type: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
}

export default function Main() {
  const [publishedList, setPublishedList] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Helper function untuk format tanggal ISO String ke format Text biasa
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Pengecekan status berdasarkan rentang tanggal
  const getTimelineStatus = (startDateStr: string, endDateStr: string) => {
    const now = new Date();
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (now < start) {
      return {
        label: "UPCOMING",
        style: "text-[#3b82f6] bg-[#3b82f6]/10", // Warna Biru
        isFinished: false,
      };
    } else if (now >= start && now <= end) {
      return {
        label: "ONGOING",
        style: "text-[#2ade5d] bg-[#2ade5d]/10", // Warna Hijau
        isFinished: false,
      };
    } else {
      return {
        label: "FINISHED",
        style: "text-amber-600 bg-amber-500/10 border border-amber-200/50", // Warna Amber untuk menandakan kompetisi selesai & siap input hasil
        isFinished: true,
      };
    }
  };

  // Handler navigasi khusus untuk kompetisi yang sudah FINISHED
  const handleRowClick = (item: Competition, isFinished: boolean) => {
    if (isFinished) {
      router.push(`/dashboard/add-result/${item.competition_id}`);
    }
  };

  useEffect(() => {
    const fetchPublishedCompetitions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

        const userRes = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        const userId = String(userData.user_id);

        const compRes = await fetch(`${apiUrl}/competitions`);
        if (!compRes.ok) throw new Error("Failed to fetch competitions");
        const competitions: Competition[] = await compRes.json();

        const myPublishedComps = competitions.filter((comp) => String(comp.organizer_id) === userId);

        setPublishedList(myPublishedComps);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedCompetitions();
  }, []);

  return (
    <div className="relative h-auto md:min-h-[calc(100vh-180px)] w-full bg-[#f8f9fa] flex flex-col justify-between">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Published Page Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans flex-1">
        {/* Dashboard Title Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Published Competition</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">View all of your published competition here, ones either still ongoing or finished</p>
        </div>

        {/* List Content Area */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[1.75rem] border border-gray-100 shadow-sm gap-3">
              <Loader2 className="animate-spin text-[#1e5297] w-10 h-10" />
              <p className="text-gray-400 font-bold text-sm">Loading your competitions...</p>
            </div>
          ) : publishedList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[1.75rem] border border-dashed border-gray-200 text-gray-400 font-bold shadow-sm">No published competition found.</div>
          ) : (
            publishedList.map((item) => {
              const status = getTimelineStatus(item.start_date, item.end_date);

              return (
                <div
                  key={item.competition_id}
                  onClick={() => handleRowClick(item, status.isFinished)}
                  className={`w-full bg-white rounded-[1.75rem] border p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all ${
                    status.isFinished ? "hover:border-amber-300 hover:shadow-md cursor-pointer group bg-gradient-to-r from-white to-amber-50/10" : "border-gray-100 select-none"
                  }`}
                >
                  {/* Sisi Kiri: Judul & Badge Status Dinamis */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 flex-1">
                    <h3 className={`font-extrabold text-gray-700 text-base md:text-lg tracking-tight uppercase ${status.isFinished ? "group-hover:text-amber-700 transition-colors" : ""}`}>
                      {item.title}
                    </h3>
                    <span className={`text-[10px] font-black tracking-wider px-3 py-1 rounded-full uppercase ${status.style}`}>{status.label}</span>
                  </div>

                  {/* Sisi Kanan: Rentang Timeline / Tombol Aksi Tambah Pemenang */}
                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto border-t sm:border-none pt-4 sm:pt-0 border-gray-100">
                    <div className="text-gray-500 font-bold text-xs md:text-sm tracking-tight whitespace-nowrap">
                      {formatDate(item.start_date)} - {formatDate(item.end_date)}
                    </div>

                    {/* Tampilkan tombol interaktif jika status FINISHED */}
                    {status.isFinished && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100/60 px-3 py-2 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                        <Award size={14} />
                        <span className="hidden md:inline">Add Result</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
