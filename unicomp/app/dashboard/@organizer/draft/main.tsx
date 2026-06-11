"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

interface Competition {
  competition_id: string;
  title: string;
  status: string;
  start_date: string;
  end_date: string;
  organizer_id: string;
  description?: string;
  category?: string;
  competition_type?: string;
  schedule?: any;
  rules_condition?: string;
  deadline?: string;
  registration_link?: string;
  prize?: string; // Menambahkan field opsional jika ada dari API
}

export default function Main() {
  const [draftList, setDraftList] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchDraftCompetitions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

        if (!token) throw new Error("Token autentikasi tidak ditemukan.");

        const res = await fetch(`${apiUrl}/competitions/organizer/submissions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data draft kompetisi.");
        const data = await res.json();

        const drafts = data.draft?.competitions || [];
        setDraftList(drafts);
      } catch (err: any) {
        console.error("Error fetching draft competitions:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data draft.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraftCompetitions();
  }, []);

  // MENYIMPAN OBJECT UTUH KE SESSIONSTORAGE & NAVIGASI
  const handleSelectDraft = (item: Competition) => {
    sessionStorage.setItem("selected_draft_data", JSON.stringify(item));
    router.push("/dashboard/create-new-competition");
  };

  const formatTimeline = (start: string, end: string) => {
    if (!start || !end) return "Timeline tidak tersedia";
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const startDate = new Date(start).toLocaleDateString("en-US", options);
    const endDate = new Date(end).toLocaleDateString("en-US", options);
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="relative h-auto md:min-h-[calc(100vh-180px)] w-full bg-[#f8f9fa] overflow-hidden flex flex-col justify-between">
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Draft Page Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans flex-1">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Draft</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">Here lies all of your saved draft. Make sure to continue edit them and send your competition</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-gray-400 font-medium text-sm">
              <Loader2 className="animate-spin text-[#8cabd9] w-8 h-8" />
              Loading your drafts...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-red-500 font-medium text-sm">
              <AlertCircle className="w-8 h-8" />
              {error}
            </div>
          ) : draftList.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-[2rem] border border-dashed border-gray-300 text-gray-400 font-bold">No drafts found.</div>
          ) : (
            draftList.map((item) => (
              <div
                key={item.competition_id}
                onClick={() => handleSelectDraft(item)} // Mengirim object item secara utuh
                className="w-full bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center">
                  <h3 className="font-extrabold text-gray-700 text-lg md:text-xl tracking-tight group-hover:text-[#1e5297] transition-colors uppercase">{item.title}</h3>
                </div>

                <div className="text-gray-800 font-bold text-sm md:text-lg tracking-tight bg-gray-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl">
                  {formatTimeline(item.start_date, item.end_date)}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
