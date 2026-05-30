"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ArrowDown, ChevronDown } from "lucide-react";

// Mock Data
const INITIAL_PARTICIPANTS = [
  { id: 1, name: "Clement Ernest Atmadja", university: "BINUS University", wins: 12, registered: 15, category: "Hackathon" },
  { id: 2, name: "Albert Christian Yang", university: "BINUS University", wins: 10, registered: 14, category: "Data Science" },
  { id: 3, name: "Vittorio Dinata", university: "BINUS University", wins: 9, registered: 12, category: "Design" },
  { id: 4, name: "Alvaro Chandra", university: "BINUS University", wins: 8, registered: 11, category: "Cybersecurity" },
  { id: 5, name: "John Son", university: "BINUS University", wins: 7, registered: 13, category: "Others" },
  { id: 6, name: "John Harley David Son", university: "BINUS University", wins: 6, registered: 9, category: "Hackathon" },
  { id: 7, name: "John Sonflower", university: "BINUS University", wins: 5, registered: 10, category: "Data Science" },
  { id: 8, name: "John Sony", university: "BINUS University", wins: 4, registered: 7, category: "Design" },
  { id: 9, name: "John Daughter", university: "BINUS University", wins: 3, registered: 8, category: "Cybersecurity" },
  { id: 10, name: "John Sonbrero", university: "BINUS University", wins: 2, registered: 6, category: "Others" },
  { id: 11, name: "Alice Wijaya", university: "UI", wins: 2, registered: 5, category: "Hackathon" },
  { id: 12, name: "Michael Owen", university: "ITB", wins: 1, registered: 4, category: "Data Science" },
];

type FilterType = "all" | "wins" | "registered";
type CategoryType = "All" | "Hackathon" | "Data Science" | "Design" | "Cybersecurity" | "Others";

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi menutup dropdown otomatis ketika klik di luar komponen area filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIKA FILTER & SEARCH ---
  const processedParticipants = useMemo(() => {
    let result = [...INITIAL_PARTICIPANTS];

    // Logika 1: Pencarian berdasarkan Nama
    if (searchQuery.trim() !== "") {
      result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Logika 2: Saring data kumulatif dari pilihan Category Dropdown
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Logika 3: Pengurutan Utama Berdasarkan Tab Utama Aktif
    if (activeFilter === "wins") {
      result.sort((a, b) => b.wins - a.wins);
    } else if (activeFilter === "registered") {
      result.sort((a, b) => b.registered - a.registered);
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [searchQuery, activeFilter, activeCategory]);

  // --- LOGIKA PAGINATION ---
  const totalPages = Math.ceil(processedParticipants.length / itemsPerPage) || 1;

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [processedParticipants, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getRankBadgeStyles = (index: number) => {
    const globalRank = (currentPage - 1) * itemsPerPage + index + 1;
    if (globalRank === 1) return "bg-[#fef08a] text-[#a16207] ring-2 ring-yellow-200";
    if (globalRank === 2) return "bg-[#e2e8f0] text-[#475569] ring-2 ring-slate-100";
    if (globalRank === 3) return "bg-[#ffedd5] text-[#c2410c] ring-2 ring-orange-100";
    return "bg-[#3b82f6] text-white";
  };

  const categories: CategoryType[] = ["All", "Hackathon", "Data Science", "Design", "Cybersecurity", "Others"];

  return (
    <div className="bg-[#f3f4f6] min-h-screen pb-16 font-sans">
      <div className="max-w-6l mx-auto px-8 md:px-16 pt-10">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1e40af]">Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">Here lies all participants in UniComp</p>
        </div>

        {/* Toolbar Section (Search & Filter) */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Participant..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#f3f4f6] text-gray-700 pl-12 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-gray-400"
            />
          </div>

          {/* Action Filter Buttons */}
          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setActiveFilter("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                activeFilter === "all" ? "bg-[#3b82f6] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Show All
            </button>

            <button
              onClick={() => {
                setActiveFilter("wins");
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                activeFilter === "wins" ? "bg-[#3b82f6] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              By Competition Win
            </button>

            <button
              onClick={() => {
                setActiveFilter("registered");
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                activeFilter === "registered" ? "bg-[#3b82f6] text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              By Competition Registered
            </button>

            {/* Dropdown Sort Arrow Button Container */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-200 active:scale-90 transition-all cursor-pointer flex items-center gap-1 font-bold text-xs ${
                  activeCategory !== "All" ? "bg-blue-50 border-blue-200" : ""
                }`}
              >
                <ArrowDown size={18} strokeWidth={2.5} />
                {activeCategory !== "All" && <span className="text-[10px] text-blue-600 font-extrabold pr-1 max-w-[80px] truncate animate-in fade-in">{activeCategory}</span>}
                <ChevronDown size={14} className={`text-blue-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* FLOATING DROPDOWN MENU KATEGORI */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">Select Category</div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCurrentPage(1);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                        activeCategory === cat ? "text-blue-600 bg-blue-50/60" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>{cat}</span>
                      {activeCategory === cat && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Table Box Container */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
          <div className="divide-y divide-gray-100">
            {currentData.length > 0 ? (
              currentData.map((participant, index) => {
                const globalRank = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <div key={participant.id} className="flex items-center gap-5 py-4 first:pt-0 last:pb-0 hover:bg-gray-50/70 transition-all px-3 -mx-3 rounded-xl group">
                    {/* Rank Circle Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105 ${getRankBadgeStyles(index)}`}
                    >
                      {globalRank}
                    </div>

                    {/* Metadata Detail */}
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-sm tracking-wide transition-colors group-hover:text-blue-600">{participant.name}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-2">
                        <span>{participant.university}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-gray-400/70 italic font-normal">{participant.category}</span>
                      </div>
                    </div>

                    {/* Menampilkan value pendukung jika filter aktif */}
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full transition-colors group-hover:bg-blue-100 shrink-0">
                      {activeFilter === "wins" && `${participant.wins} Wins`}
                      {activeFilter === "registered" && `${participant.registered} Registered`}
                      {activeFilter === "all" && `${participant.wins}W / ${participant.registered}R`}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-sm text-gray-400 font-medium italic animate-pulse">No participants found matching current filter</div>
            )}
          </div>

          {/* Footer Controls Component */}
          <div className="flex items-center justify-end gap-5 mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 font-medium">
            <div>
              Show {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg border transition-all transform active:scale-90 cursor-pointer ${
                  currentPage === 1 ? "border-gray-100 text-gray-200 cursor-not-allowed" : "border-gray-200 text-blue-600 hover:bg-gray-50"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg border transition-all transform active:scale-90 cursor-pointer ${
                  currentPage === totalPages ? "border-gray-100 text-gray-200 cursor-not-allowed" : "border-gray-200 text-blue-600 hover:bg-gray-50"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
