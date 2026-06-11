"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Calendar, FileText, Check, X } from "lucide-react";
import BackButton from "@/components/global_components/backButton";

interface CompetitionDetail {
  id: string;
  title: string;
  description?: string;
  rules?: string | string[];
  category?: string;
  start_date?: string;
  end_date?: string;
  organizer_name?: string;
  organizer?: string;
  schedules?: { name: string; date: string }[];
}

export default function Main() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  // 1. Ambil data detail kompetisi berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchCompetitionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const res = await fetch(`${apiUrl}/competitions/${id}`, {
          method: "GET",
          headers,
        });

        if (!res.ok) throw new Error("Gagal memuat detail data kompetisi.");

        const data = await res.json();
        setCompetition(data);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError("Terjadi kesalahan jaringan saat mengambil detail kompetisi.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitionDetail();
  }, [id, apiUrl]);

  // 2. Fungsi Handlers PATCH /competitions/[id] dengan body {"action": "accept" | "decline"}
  const handleUpdateStatus = async (action: "accept" | "decline") => {
    const confirmMessage = action === "accept" ? "Apakah Anda yakin ingin menyetujui kompetisi ini?" : "Apakah Anda yakin ingin menolak kompetisi ini?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        return;
      }

      // Memperbaiki URL endpoint menjadi /competitions/[id] sesuai instruksi teranyar
      const res = await fetch(`${apiUrl}/competitions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: action }),
      });

      if (res.ok) {
        alert(`Kompetisi berhasil di-${action === "accept" ? "setujui (accept)" : "tolak (decline)"}!`);
        router.push("/dashboard/pending-approval");
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || `Gagal mengubah status kompetisi menjadi ${action}.`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan saat memproses permintaan.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center gap-2 text-gray-400 font-sans">
        <Loader2 size={32} className="animate-spin text-[#1e40af]" />
        <p className="text-sm font-medium">Loading competition details...</p>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500 font-sans px-6 text-center">
        <AlertCircle size={40} className="text-red-500" />
        <p className="text-sm font-semibold">{error || "Data kompetisi tidak ditemukan."}</p>
        <button onClick={() => router.back()} className="text-xs text-[#1e40af] font-bold underline mt-2">
          Kembali ke Halaman Sebelumnya
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      <BackButton />

      {/* Header Title */}
      <div className="mb-8 flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Review Competition</h1>
          <p className="text-gray-400 text-sm mt-1">Please review the details below carefully before making an approval decision</p>
        </div>
      </div>

      {/* Card Utama */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        {/* Banner Biru (Header Card) */}
        <div className="bg-[#1e40af] p-12 relative">
          <div className="absolute top-6 right-8 bg-white text-[#1e40af] px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">{competition.category || "Others"}</div>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase leading-tight max-w-[85%]">{competition.title || "Untitled Competition"}</h2>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">By: {competition.organizer_name || competition.organizer || "Unknown Organizer"}</p>
        </div>

        {/* Content Section */}
        <div className="p-12 space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" /> Description
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{competition.description || "No description provided for this competition."}</p>
          </section>

          {/* Rules */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3">Rules & Guidelines</h3>
            {Array.isArray(competition.rules) ? (
              <ul className="list-disc list-outside ml-5 text-gray-500 text-sm space-y-2">
                {competition.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{competition.rules || "No specific rules provided."}</p>
            )}
          </section>

          {/* Schedule Section */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-gray-400" /> Timeline & Schedule
            </h3>
            <div className="bg-[#F9FAFB] rounded-2xl p-6 space-y-4 border border-gray-50">
              <div className="flex justify-between text-sm border-b border-gray-100/70 pb-3">
                <span className="text-gray-500 font-bold">Start Registration Date</span>
                <span className="text-gray-600 font-medium">
                  {competition.start_date ? new Date(competition.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-1">
                <span className="text-gray-500 font-bold">Closing/End Date</span>
                <span className="text-gray-600 font-medium">
                  {competition.end_date ? new Date(competition.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                </span>
              </div>

              {/* Custom milestones */}
              {competition.schedules &&
                competition.schedules.map((sched, idx) => (
                  <div key={idx} className="flex justify-between text-sm pt-3 border-t border-gray-100/70">
                    <span className="text-gray-500 font-bold">{sched.name}</span>
                    <span className="text-gray-600 font-medium">{sched.date}</span>
                  </div>
                ))}
            </div>
          </section>

          {/* Action Buttons (Decline / Accept) */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              disabled={isProcessing}
              onClick={() => handleUpdateStatus("decline")}
              className="w-full bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
              Decline Competition
            </button>
            <button
              disabled={isProcessing}
              onClick={() => handleUpdateStatus("accept")}
              className="w-full bg-[#4593DF] hover:bg-[#1e40af] text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Approve Competition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
