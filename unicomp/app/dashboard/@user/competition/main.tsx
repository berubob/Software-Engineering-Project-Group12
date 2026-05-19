"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

interface Competition {
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

// Kunci kategori utama yang kita mau tampilkan di tombol
const FIXED_CATEGORIES = ["All", "Hackathon", "Data Science", "Design", "Cybersecurity", "Others"];

export default function CompetitionHubMain() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL || "http://localhost:3001";

        const response = await fetch(`${apiUrl}/competitions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data: Competition[] = await response.json();

          // Jika tidak termasuk ke data ini, maka dilabel "others"
          const normalizedData = data.map((comp) => {
            const isMainCategory = ["hackathon", "data science", "design", "cybersecurity"].includes(comp.category.toLowerCase());
            return {
              ...comp,
              category: isMainCategory ? comp.category : "Others",
            };
          });

          setCompetitions(normalizedData);
          setFilteredCompetitions(normalizedData);
        } else {
          console.error("Gagal mengambil data dari API");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  // Search Button
  // Filter Logic berdasarkan kategori (termasuk Others) dan input pencarian
  useEffect(() => {
    let result = competitions;

    if (selectedCategory !== "All") {
      result = result.filter((comp) => comp.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((comp) => comp.title.toLowerCase().includes(searchQuery.toLowerCase()) || comp.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    setFilteredCompetitions(result);
  }, [selectedCategory, searchQuery, competitions]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans relative overflow-x-hidden w-full">
      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 py-12 z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#365D92] tracking-tight">Campus Competition Hub</h1>
          <p className="mt-3 text-gray-600 font-medium text-base md:text-lg max-w-xl mx-auto">Discover, participate, and excel in campus-wide competitions. Your journey to excellence starts here.</p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="w-full bg-white p-4 rounded-3xl shadow-md border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between mb-10">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl pl-12 pr-4 py-3 outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-[#8cabd9] transition-all"
            />
          </div>

          {/* Tombol Kategori Statis */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {FIXED_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap
                  ${selectedCategory === category ? "bg-[#365D92] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* COMPETITION CARDS GRID */}
        {loading ? (
          <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Loading competitions...</div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="text-center py-20 font-bold text-gray-500">No competitions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((comp) => (
              <div key={comp.competition_id} className="bg-white rounded-[2rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow">
                {/* Blue Top Section */}
                <div className="bg-[#1e5297] p-6 h-32 relative flex items-start justify-between">
                  <span className="bg-white text-[#1e5297] text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm">{comp.category}</span>
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm">{comp.schedule}</span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 leading-snug line-clamp-1">{comp.title}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2 font-medium">{comp.description}</p>

                    <div className="mt-4 space-y-1 text-xs text-gray-500 font-semibold">
                      <p>
                        Schedule:{" "}
                        <span className="text-gray-700">
                          {formatDate(comp.start_date)} - {formatDate(comp.end_date)}
                        </span>
                      </p>
                      <p>
                        Deadline: <span className="text-red-500">{formatDate(comp.deadline)}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/competition/${comp.competition_id}`}
                    className="mt-6 w-full text-center bg-[#8cabd9] hover:bg-[#365D92] text-white py-3 rounded-xl font-bold text-sm shadow-sm block transition-colors cursor-pointer"
                  >
                    View Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
