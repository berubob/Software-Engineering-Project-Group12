"use client";
import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface CompetitionItem {
  id: string; // atau competition_id sesuai skema backend
  title: string;
  organizer_name?: string; // Akan diisi dari /competitions/[id]
  start_date: string;
  end_date: string;
  category?: string;
  status: string;
}

export default function Main() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingList, setPendingList] = useState<CompetitionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApprovingAll, setIsApprovingAll] = useState<boolean>(false);

  const categories = ["All", "Hackathon", "Data Science", "Design", "Cybersecurity", "Others"];
  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

  // 1. Ambil data pending & perkaya data organizer dari /competitions/[id]
  const fetchPendingCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch data kompetisi pending awal
      const res = await fetch(`${apiUrl}/competitions/admin?status=pending`, {
        method: "GET",
        headers,
      });

      if (!res.ok) throw new Error("Gagal memuat data kompetisi pending.");

      const rawData = await res.json();
      const initialList = Array.isArray(rawData) ? rawData : [];

      // Proses pengayaan data (Enrichment) nama organizer secara paralel
      const enrichedList = await Promise.all(
        initialList.map(async (comp: any) => {
          const compId = comp.id || comp.competition_id;
          let organizerName = comp.organizer_name || "Unknown Organizer";

          // Panggil endpoint /competitions/[id] jika nama organizer belum ada di response awal
          if (!comp.organizer_name && compId) {
            try {
              const detailRes = await fetch(`${apiUrl}/competitions/${compId}`, {
                method: "GET",
                headers,
              });
              if (detailRes.ok) {
                const detailData = await detailRes.json();
                // Sesuaikan property name dari backend kamu (misal: detailData.organizer_name atau detailData.organizer)
                organizerName = detailData.organizer_name || detailData.organizer || organizerName;
              }
            } catch (err) {
              console.error(`Gagal mengambil detail organizer untuk kompetisi ${compId}:`, err);
            }
          }

          return {
            ...comp,
            id: compId,
            organizer_name: organizerName,
          };
        }),
      );

      setPendingList(enrichedList);
    } catch (err) {
      console.error("Error fetching pending competitions:", err);
      setError("Terjadi kesalahan jaringan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCompetitions();
  }, [apiUrl]);

  // 2. Fungsi untuk menyetujui semua kompetisi sekaligus (Approve All)
  const handleApproveAll = async () => {
    if (pendingList.length === 0) return;

    const confirmAction = window.confirm(`Apakah Anda yakin ingin menyetujui semua (${pendingList.length}) kompetisi ini?`);
    if (!confirmAction) return;

    try {
      setIsApprovingAll(true);
      const token = localStorage.getItem("token");

      const promises = pendingList.map(async (comp) => {
        const compId = comp.id;
        const res = await fetch(`${apiUrl}/competitions/${compId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ status: "accepted" }),
        });
        return { id: compId, ok: res.ok };
      });

      const results = await Promise.all(promises);
      const successfulIds = results.filter((r) => r.ok).map((r) => r.id);

      setPendingList((prev) => prev.filter((item) => !successfulIds.includes(item.id)));

      if (successfulIds.length === pendingList.length) {
        alert("Semua kompetisi berhasil disetujui!");
      } else {
        alert(`${successfulIds.length} dari ${pendingList.length} kompetisi berhasil disetujui.`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem saat memproses persetujuan.");
    } finally {
      setIsApprovingAll(false);
    }
  };

  // 3. Logika Filter & Pencarian lokal (Client-side Filtering)
  const filteredCompetitions = pendingList.filter((item) => {
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || (item.organizer_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === "All" || (item.category || "").toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatDateRange = (start: string, end: string) => {
    if (!start || !end) return "Tanggal tidak valid";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const startDate = new Date(start).toLocaleDateString("id-ID", options);
    const endDate = new Date(end).toLocaleDateString("id-ID", options);
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e40af]">Pending Approval</h1>
        <p className="text-gray-400 text-sm mt-1">Here is all of competition that has not been approved yet</p>
      </div>

      {/* Filter Bar Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
          <input
            type="text"
            placeholder="Search Competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-gray-50 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-500 outline-none focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-300"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeCategory === cat ? "bg-[#4593DF] text-white shadow-md" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Action Text */}
      <div className="flex justify-end mb-4">
        <button
          disabled={isApprovingAll || pendingList.length === 0}
          onClick={handleApproveAll}
          className="text-xs font-bold text-gray-400 hover:text-[#1e40af] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isApprovingAll ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Processing...
            </>
          ) : (
            `Approve All (${pendingList.length})`
          )}
        </button>
      </div>

      {/* List Container */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[250px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2 text-gray-400 text-sm font-medium">
            <Loader2 size={26} className="animate-spin text-[#4593DF]" /> Loading pending competitions & organizers...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center text-red-500 text-sm font-medium py-24">{error}</div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 text-sm font-medium py-20 bg-gray-50/50 m-6 rounded-2xl border border-dashed border-gray-200">
            <AlertCircle size={32} className="text-gray-300 mb-2" />
            No pending competition found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredCompetitions.map((item) => (
              <Link href={`/dashboard/pending-approval/${item.id}`} key={item.id}>
                <div className="p-8 flex justify-between items-center hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <div>
                    <h3 className="text-lg font-black text-gray-700 tracking-tight group-hover:text-[#4593DF] transition-colors uppercase">{item.title}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">By: {item.organizer_name}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="text-sm font-black text-gray-700">{formatDateRange(item.start_date, item.end_date)}</p>
                    {item.category && <span className="inline-block text-[9px] font-extrabold px-2.5 py-0.5 bg-blue-50 text-[#4593DF] rounded-md uppercase tracking-wide">{item.category}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
