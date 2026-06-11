"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface CompetitionResultItem {
  competition_id: number;
  competition_title: string;
  rank: number;
  score?: number | string;
}

export default function Main() {
  const [competitionResults, setCompetitionResults] = useState<CompetitionResultItem[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  useEffect(() => {
    const fetchResultsData = async () => {
      try {
        setLoadingResults(true);
        const token = localStorage.getItem("token");
        if (!token || !apiUrl) {
          setLoadingResults(false);
          return;
        }

        // 1. Ambil data profil user
        const resUser = await fetch(`${apiUrl}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resUser.ok) throw new Error("Gagal mengambil data profil.");
        const userData = await resUser.json();
        const currentUserId = userData.user_id;

        // Jika tidak ada data kemenangan/partisipasi kompetisi
        if (!userData.total_wins || Object.keys(userData.total_wins).length === 0) {
          setCompetitionResults([]);
          return;
        }

        // 2. Ekstraksi semua competition_ids dari total_wins
        const allIds: number[] = [];
        Object.values(userData.total_wins).forEach((category: any) => {
          if (category.competition_ids && Array.isArray(category.competition_ids)) {
            allIds.push(...category.competition_ids);
          }
        });

        if (allIds.length === 0) {
          setCompetitionResults([]);
          return;
        }
        const uniqueIds = Array.from(new Set(allIds));

        // 3. Fetch paralel detail hasil nilai dan informasi judul kompetisi
        const detailedPromises = uniqueIds.map(async (id): Promise<CompetitionResultItem | null> => {
          try {
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            };

            const [resResult, resComp] = await Promise.all([fetch(`${apiUrl}/results/${id}`, { method: "GET", headers }), fetch(`${apiUrl}/competitions/${id}`, { method: "GET", headers })]);

            const resultPayload = resResult.ok ? await resResult.json() : null;
            const compData = resComp.ok ? await resComp.json() : null;

            let userRank = 0;
            let userScore: number | string | undefined = undefined;

            // 4. Logika pencarian kecocokan rank dan score user saat ini
            if (resultPayload) {
              const actualResults = Array.isArray(resultPayload) ? resultPayload : resultPayload.data && Array.isArray(resultPayload.data) ? resultPayload.data : [resultPayload];

              let targetData = actualResults.find((item: any) => {
                if (!item) return false;
                const itemUserId = item.user_id !== undefined ? item.user_id : item.userId;
                return String(itemUserId) === String(currentUserId);
              });

              if (!targetData) {
                targetData = actualResults.find((item: any) => {
                  if (item && Array.isArray(item.rank)) {
                    return item.rank.some((r: any) => {
                      const rUserId = r.user_id !== undefined ? r.user_id : r.userId;
                      return String(rUserId) === String(currentUserId);
                    });
                  }
                  return false;
                });
              }

              if (targetData) {
                userScore = targetData.score ?? undefined;
                if (targetData.rank !== undefined && targetData.rank !== null) {
                  if (Array.isArray(targetData.rank)) {
                    const innerRankObj = targetData.rank.find((r: any) => {
                      const rUserId = r.user_id !== undefined ? r.user_id : r.userId;
                      return String(rUserId) === String(currentUserId);
                    });
                    if (innerRankObj) userRank = Number(innerRankObj.rank);
                  } else if (typeof targetData.rank === "object") {
                    userRank = targetData.rank.rank !== undefined ? Number(targetData.rank.rank) : 0;
                  } else {
                    userRank = Number(targetData.rank);
                  }
                }
              }
            }

            // Fallback default rank jika data spesifik dari /results belum terisi penuh
            if (userRank === 0) {
              for (const categoryData of Object.values(userData.total_wins) as any[]) {
                if (categoryData.competition_ids?.includes(id)) {
                  userRank = 2;
                  break;
                }
              }
            }

            return {
              competition_id: id,
              competition_title: compData?.title || compData?.name || `Competition #${id}`,
              rank: userRank,
              ...(userScore !== undefined && { score: userScore }),
            };
          } catch (err) {
            console.error(`Gagal memuat detail kompetisi ID: ${id}`, err);
            return null;
          }
        });

        const resolvedResults = await Promise.all(detailedPromises);
        const cleanResults = resolvedResults.filter((r): r is CompetitionResultItem => {
          return r !== null && r !== undefined && typeof r.competition_title === "string";
        });

        setCompetitionResults(cleanResults);
      } catch (error) {
        console.error("Error fetching detailed competition metrics on page:", error);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResultsData();
  }, [apiUrl]);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">My Results</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your competition results. Keep going on your academic journey!</p>
      </div>

      {/* Results Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm p-6 md:p-12 min-h-[400px] flex flex-col justify-center">
        {loadingResults ? (
          /* --- TAMPILAN LOADING STATE --- */
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-400 font-medium">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <span>Loading published results...</span>
          </div>
        ) : competitionResults.length === 0 ? (
          /* --- TAMPILAN EMPTY STATE --- */
          <div className="max-w-md space-y-4 mx-auto text-center">
            {/* Trophy Icon Circle */}
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-200" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-gray-800">No result published yet</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your competition results and rankings will appear here once they <br className="hidden md:block" />
              are published by the organizers. Please wait...
            </p>
          </div>
        ) : (
          /* --- TAMPILAN JIKA ADA DATA (HILANGKAN SLIDER DI SINI) --- */
          <div className="w-full flex-1 flex flex-col justify-start">
            <div className="text-xs font-semibold text-gray-400 mb-6 px-2">Showing {competitionResults.length} Competition Metrics</div>

            {/* Container List dengan Fitur Scroll Tanpa Batas Garis Slider */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&-::-webkit-scrollbar]:none">
              {competitionResults.map((result, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 hover:bg-gray-50/50 transition-colors px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Badge Icon Warna berdasarkan Rank */}
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 border ${
                        result.rank === 1
                          ? "bg-amber-50 text-amber-500 border-amber-100"
                          : result.rank === 2
                            ? "bg-slate-100 text-slate-500 border-slate-200"
                            : "bg-blue-50 text-blue-500 border-blue-100"
                      }`}
                    >
                      <Image src="/Trophy.svg" width={20} height={20} alt="trophy" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm md:text-base font-bold text-gray-800 truncate max-w-[180px] sm:max-w-[350px] md:max-w-[500px]">{result.competition_title}</div>
                      {result.score !== undefined && (
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Score: <span className="font-semibold text-gray-600">{result.score}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kapsul Status Rank / Partisipan */}
                  <span
                    className={`text-[10px] md:text-xs font-extrabold px-3 py-1 md:py-1.5 rounded-full flex-shrink-0 border shadow-sm ${
                      result.rank === 1 ? "bg-amber-500 text-white border-amber-600" : result.rank === 2 ? "bg-slate-400 text-white border-slate-500" : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {result.rank > 0 ? `Rank ${result.rank}` : "Participant"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
