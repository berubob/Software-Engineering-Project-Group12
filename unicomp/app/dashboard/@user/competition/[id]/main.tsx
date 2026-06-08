"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/global_components/backButton";
import { Loader2 } from "lucide-react"; // Ditambahkan untuk spinner loading jika diperlukan

interface CompetitionDetail {
  competition_id: string;
  title: string;
  description: string;
  category: string;
  competition_type: string;
  deadline: string;
  schedule: Record<string, string> | null;
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
  const [organizerName, setOrganizerName] = useState<string>("Loading..."); // State untuk nama organizer
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [registerStatus, setRegisterStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

  useEffect(() => {
    const fetchCompetitionAndOrganizer = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch data kompetisi
        const compRes = await fetch(`${apiUrl}/competitions/${params.id}`);
        if (!compRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }
        const compData: CompetitionDetail = await compRes.json();
        setCompetition(compData);

        // 2. Fetch data nama organizer berdasarkan organizer_id yang didapat
        if (compData.organizer_id) {
          try {
            const orgRes = await fetch(`${apiUrl}/users/${compData.organizer_id}/name`);
            if (orgRes.ok) {
              const orgData = await orgRes.json();
              // Menyesuaikan jika API mengembalikan object seperti { name: "..." } atau langsung string
              setOrganizerName(orgData.name || orgData || "Unknown Organizer");
            } else {
              setOrganizerName("Unknown Organizer");
            }
          } catch (orgErr) {
            console.error("Gagal memuat nama organizer:", orgErr);
            setOrganizerName("Unknown Organizer");
          }
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompetitionAndOrganizer();
    }
  }, [params.id, apiUrl]);

  // --- FUNGSI UTAMA: REGISTRASI OTOMATIS ---
  const handleRegisterCompetition = async () => {
    if (!competition) return;

    try {
      setRegisterLoading(true);
      setRegisterStatus(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setRegisterStatus({
          type: "error",
          message: "Anda harus login terlebih dahulu untuk mendaftar kompetisi.",
        });
        return;
      }

      const response = await fetch(`${apiUrl}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          competition_id: competition.competition_id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setRegisterStatus({
          type: "success",
          message: "Berhasil mendaftar! Mengalihkan Anda ke halaman eksternal kompetisi...",
        });

        setTimeout(() => {
          window.open(competition.registration_link, "_blank", "noopener,noreferrer");
        }, 1500);
      } else {
        setRegisterStatus({
          type: "error",
          message: result.message || "Gagal melakukan pendaftaran kompetisi.",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegisterStatus({
        type: "error",
        message: "Terjadi kesalahan jaringan saat mendaftar.",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

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
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper format jam (contoh: "00:00")
  const formatTime = (isoString: string) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

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
        {/* HEADER SECTION */}
        <div className="flex items-start gap-4 mb-8">
          <BackButton />
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
                      <span className="text-gray-600 capitalize">{competition.competition_type || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Organizer:</span>
                      <span className="text-gray-600 capitalize">{organizerName}</span>
                    </div>
                  </div>
                </div>

                {/* Notifikasi Alert Hasil Registrasi */}
                {registerStatus && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-bold ${
                      registerStatus.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                    }`}
                  >
                    {registerStatus.message}
                  </div>
                )}

                <button
                  type="button"
                  disabled={registerLoading}
                  onClick={handleRegisterCompetition}
                  className={`w-full py-3.5 text-white rounded-xl text-xs font-extrabold tracking-wide shadow-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                    ${registerStatus?.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-[#8cabd9] hover:bg-[#365D92]"}`}
                >
                  {registerLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Registering...
                    </>
                  ) : registerStatus?.type === "success" ? (
                    "Registered Successfully"
                  ) : (
                    "Register Competition"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
