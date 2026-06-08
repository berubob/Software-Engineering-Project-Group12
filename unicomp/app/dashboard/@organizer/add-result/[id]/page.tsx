"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Trophy, Loader2, AlertCircle, CheckCircle, Mail, User, Download, Upload } from "lucide-react";
import OrganizerHeader from "@/components/local_components/organizerHeader";
import Footer from "@/components/global_components/footer";

interface WinnerItem {
  registration_id: string;
  participant_id: string;
  participant_name: string;
  email: string;
  rank: number | "";
  score: string;
}

interface CompetitionDetail {
  competition_id: string;
  title: string;
  category: string;
}

interface RegistrationItem {
  registration_id: string;
  registration_date: string;
  status: string;
  participant_id: string;
  competition_id: string;
}

interface RegistrationResponse {
  count: number;
  registrations: RegistrationItem[];
}

export default function AddResult() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Manajemen Data & UI
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [winners, setWinners] = useState<WinnerItem[]>([]);
  const [announcementDate, setAnnouncementDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // State Loading & Error
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // FETCH DETAIL KOMPETISI, REGISTRASI, DAN DATA PROFIL USER
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

        // 1. Fetch Informasi Detail Kompetisi
        const compRes = await fetch(`${apiUrl}/competitions/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!compRes.ok) throw new Error("Gagal mengambil informasi detail kompetisi.");
        const compData = await compRes.json();
        setCompetition(compData.competition || compData);

        // 2. Fetch Daftar Peserta Terregistrasi Berdasarkan ID Kompetisi
        const regRes = await fetch(`${apiUrl}/registrations/competition/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!regRes.ok) throw new Error("Gagal mengambil daftar peserta kompetisi.");
        const regData: RegistrationResponse = await regRes.json();

        // 3. Fetch Detail Profil Setiap User Berdasarkan participant_id secara Paralel
        if (regData && Array.isArray(regData.registrations)) {
          const detailedWinners: WinnerItem[] = await Promise.all(
            regData.registrations.map(async (reg) => {
              try {
                const userRes = await fetch(`${apiUrl}/users/${reg.participant_id}/name`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!userRes.ok) throw new Error(`User info fetch failed`);
                const userData = await userRes.json();

                return {
                  registration_id: String(reg.registration_id),
                  participant_id: String(reg.participant_id),
                  participant_name: userData.username || userData.name || `Participant ${reg.participant_id}`,
                  email: userData.email || `user${reg.participant_id}@example.com`,
                  rank: "",
                  score: "0",
                };
              } catch (userErr) {
                console.error(`Gagal memuat profil untuk user id: ${reg.participant_id}`, userErr);
                return {
                  registration_id: String(reg.registration_id),
                  participant_id: String(reg.participant_id),
                  participant_name: `Participant ${reg.participant_id}`,
                  email: `user${reg.participant_id}@example.com`,
                  rank: "",
                  score: "0",
                };
              }
            }),
          );

          setWinners(detailedWinners);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan saat memuat data awal.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  // HANDLER MANAJEMEN INPUT MANUAL STATE
  const handleWinnerChange = (index: number, field: keyof WinnerItem, value: any) => {
    if (field === "rank" || field === "participant_name" || field === "email") return;

    const updatedWinners = [...winners];
    updatedWinners[index] = { ...updatedWinners[index], [field]: value };
    setWinners(updatedWinners);
  };

  // FITUR EXPORT CSV
  const handleExportCSV = () => {
    if (winners.length === 0) {
      alert("Tidak ada data peserta untuk di-export.");
      return;
    }

    const headers = ["Rank", "Username", "Email"];

    const rows = winners.map((w, index) => {
      const finalRank = w.rank !== "" ? w.rank : index + 1;
      return [finalRank, `"${w.participant_name.replace(/"/g, '""')}"`, `"${w.email.replace(/"/g, '""')}"`];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Format_Penilaian_Kompetisi_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FITUR IMPORT CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
        if (lines.length <= 1) {
          throw new Error("File CSV kosong atau tidak memiliki baris data.");
        }

        const parsedWinners: WinnerItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");

          if (matches.length < 3) continue;

          const rank = parseInt(matches[0].trim(), 10) || i;
          const email = matches[2].replace(/^"|"$/g, "").trim();

          const existingReg = winners.find((w) => w.email.toLowerCase() === email.toLowerCase());

          if (existingReg) {
            parsedWinners.push({
              registration_id: existingReg.registration_id,
              participant_id: existingReg.participant_id,
              participant_name: existingReg.participant_name,
              email: existingReg.email,
              rank,
              score: existingReg.score,
            });
          }
        }

        if (parsedWinners.length === 0) {
          throw new Error("Data email di dalam CSV tidak cocok dengan satupun daftar email peserta terdaftar.");
        }

        const sortedWinners = parsedWinners.sort((a, b) => (a.rank as number) - (b.rank as number));

        setWinners(sortedWinners);
        alert("Data CSV berhasil dimasukkan! Urutan tampilan diperbarui berdasarkan Rank.");
      } catch (err: any) {
        alert(`Gagal memproses file CSV: ${err.message}`);
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // HANDLER SUBMIT DATA KE API BACKEND (SINGLE POST REQUEST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

      if (winners.length === 0) {
        throw new Error("Tidak ada data peserta terdaftar yang dapat dinilai.");
      }

      const hasEmptyRank = winners.some((w) => w.rank === "");
      if (hasEmptyRank) {
        throw new Error("Peringkat belum ditentukan. Silakan lakukan 'Import CSV' terlebih dahulu untuk mengisi data Rank.");
      }

      // Menentukan competition_id utama
      const finalCompetitionId = competition?.competition_id ? parseInt(competition.competition_id, 10) : parseInt(id as string, 10);

      // Memetakan data state winners menjadi format array of objects [{ rank, user_id }]
      const ranksArray = winners.map((winner) => ({
        rank: Number(winner.rank),
        user_id: parseInt(winner.participant_id, 10), // Menggunakan participant_id sebagai user_id penentu peringkat
      }));

      // Struktur Tunggal Payload baru sesuai kebutuhan backend Anda
      const payload = {
        competition_id: finalCompetitionId,
        announcement_date: announcementDate,
        rank: ranksArray, // rank berupa array of objects
      };

      const res = await fetch(`${apiUrl}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Gagal menyimpan hasil pemenang kompetisi ke server.");
      }

      alert("Semua hasil peringkat kompetisi berhasil diajukan ke admin!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan internal saat memproses penyimpanan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-gray-400 font-medium text-sm">
        <Loader2 className="animate-spin text-[#1e5297] w-10 h-10" />
        Memuat data kompetisi dan detail peserta...
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-700 font-bold text-sm">{error || "Data kompetisi gagal diperoleh."}</p>
        <button onClick={() => router.back()} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all cursor-pointer">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <OrganizerHeader />
      <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
        <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
          <Image src="/NetworkBG.svg" alt="Add Result Background" fill className="object-cover object-center" priority />
        </div>

        <main className="max-w-5xl w-full mx-auto px-6 md:px-12 py-10 font-sans">
          <button
            onClick={() => router.back()}
            type="button"
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1e5297] hover:bg-gray-50 transition-colors mb-6 cursor-pointer outline-none"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="mb-8 p-6 md:p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 bg-[#8cabd9]/20 text-[#1e5297] rounded-full text-[10px] font-extrabold tracking-wide uppercase">{competition.category}</span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight mt-2 uppercase">{competition.title}</h1>
              <p className="text-gray-400 text-xs font-semibold mt-1">Input urutan kelulusan hasil kompetisi langsung dari database pendaftar aktif</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-colors cursor-pointer shadow-sm"
              >
                <Download size={14} className="text-blue-500" /> Export CSV
              </button>

              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImportCSV} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-colors cursor-pointer shadow-sm"
              >
                <Upload size={14} className="text-emerald-500" /> Import CSV
              </button>

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
                <CheckCircle size={14} /> Total: {winners.length} Peserta
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-gray-700">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5 pb-1">
                <Trophy size={14} className="text-[#1e5297]" /> List Papan Peringkat Kompetisi Resmi <span className="text-red-500">*</span>
              </label>

              {winners.length === 0 ? (
                <div className="bg-white border rounded-2xl p-8 text-center text-gray-400 text-xs">Belum ada peserta yang mendaftar pada kompetisi ini.</div>
              ) : (
                <div className="space-y-3">
                  {winners.map((winner, idx) => (
                    <div
                      key={winner.participant_id}
                      className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative group transition-all hover:border-gray-200"
                    >
                      {/* 1. Rank / Peringkat - DISABLED */}
                      <div className="w-full md:w-32 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rank / Peringkat</label>
                        <input
                          type="number"
                          placeholder="-"
                          value={winner.rank}
                          disabled
                          required
                          className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1e5297] text-center focus:outline-none opacity-80 cursor-not-allowed"
                        />
                      </div>

                      {/* 2. Username - DISABLED */}
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Username / Nama Lengkap</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            type="text"
                            value={winner.participant_name}
                            disabled
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-gray-500 focus:outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* 3. User Email - DISABLED */}
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">User Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            type="email"
                            value={winner.email}
                            disabled
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-gray-500 focus:outline-none cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SEKSI ANNOUNCEMENT DATE */}
            <div className="space-y-2 max-w-xs">
              <label className="text-xs font-bold text-gray-400 block">Announcement Date</label>
              <input
                type="date"
                value={announcementDate}
                onChange={(e) => setAnnouncementDate(e.target.value)}
                required
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => router.back()}
                className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 shadow-sm transition-all cursor-pointer outline-none flex items-center justify-center disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || winners.length === 0}
                className="w-full py-4 bg-[#1e5297] hover:bg-[#153b6d] text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer outline-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                Publish Winners Result
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
}
