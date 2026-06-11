"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/global_components/backButton";
import { Mail, GraduationCap, Trophy, Loader2, CheckCircle } from "lucide-react";

interface CompetitionResultItem {
  competition_id: number;
  competition_title: string;
  rank: number;
  score?: number | string;
}

interface WinCategoryData {
  count: number;
  competition_ids: number[];
}

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  about_me: string | null;
  skills_expertise: string[];
  achievements: any[];
  semester: number | null;
  campus_name: string | null;
  created_at: string;
  total_registrations: number;
  total_wins: Record<string, WinCategoryData>;
}

export default function Main() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [competitionResults, setCompetitionResults] = useState<CompetitionResultItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isRequestingRole, setIsRequestingRole] = useState<boolean>(false);

  // State untuk form edit profile
  const [formData, setFormData] = useState({
    campus_name: "",
    semester: "",
    skills_input: "",
    about_me: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Anda belum login. Token tidak ditemukan.");
      }

      const res = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data profil dari server.");
      }

      const data: UserProfile = await res.json();
      setProfile(data);

      // Inisialisasi data form dari data profil yang ditarik
      setFormData({
        campus_name: data.campus_name || "",
        semester: data.semester ? String(data.semester) : "",
        skills_input: data.skills_expertise ? data.skills_expertise.join(", ") : "",
        about_me: data.about_me || "",
      });

      if (data.total_wins && Object.keys(data.total_wins).length > 0) {
        fetchDetailedResults(data.total_wins, data.user_id);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResults = async (totalWins: Record<string, WinCategoryData>, currentUserId: string) => {
    try {
      setLoadingResults(true);
      const token = localStorage.getItem("token");

      const allIds: number[] = [];
      Object.values(totalWins).forEach((category) => {
        if (category.competition_ids && Array.isArray(category.competition_ids)) {
          allIds.push(...category.competition_ids);
        }
      });

      if (allIds.length === 0) return;
      const uniqueIds = Array.from(new Set(allIds));

      const detailedPromises = uniqueIds.map(async (id): Promise<CompetitionResultItem | null> => {
        try {
          const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          };

          const [resResult, resComp] = await Promise.all([fetch(`${apiUrl}/results/${id}`, { method: "GET", headers }), fetch(`${apiUrl}/competitions/${id}`, { method: "GET", headers })]);

          const resultPayload = resResult.ok ? await resResult.json() : null;
          const compData = resComp.ok ? await resComp.json() : null;

          let userRank = 0;
          let userScore: number | string | undefined = undefined;

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
                  if (innerRankObj) {
                    userRank = Number(innerRankObj.rank);
                  }
                } else if (typeof targetData.rank === "object") {
                  userRank = targetData.rank.rank !== undefined ? Number(targetData.rank.rank) : 0;
                } else {
                  userRank = Number(targetData.rank);
                }
              }
            }
          }

          if (userRank === 0) {
            for (const categoryData of Object.values(totalWins)) {
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
      console.error("Error fetching detailed competition metrics:", error);
    } finally {
      setLoadingResults(false);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchProfileData();
    }
  }, [apiUrl]);

  const countTotalWins = (): number => {
    if (!profile || !profile.total_wins) return 0;
    return Object.values(profile.total_wins).reduce((sum, item) => sum + (item.count || 0), 0);
  };

  // Fungsi untuk menangani update data profil (PATCH)
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sesi Anda habis. Silakan login kembali.");

      // Memisahkan string skill dipisah koma kembali menjadi array string []
      const processedSkills = formData.skills_input
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const bodyPayload = {
        campus_name: formData.campus_name || null,
        semester: formData.semester ? Number(formData.semester) : null,
        skills_expertise: processedSkills,
        about_me: formData.about_me || null,
        achievements: profile?.achievements || [], // Menjaga payload achievements tetap dikirim sesuai skema
      };

      const res = await fetch(`${apiUrl}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memperbarui profil.");
      }

      alert("Profile updated successfully!");
      setIsEditing(false);
      await fetchProfileData(); // Mengambil ulang data agar tampilan sinkron
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestOrganizer = async () => {
    const isConfirmed = confirm("Do you want to apply as organizer?");
    if (!isConfirmed) return;

    try {
      setIsRequestingRole(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sesi Anda habis. Silakan login kembali.");

      const res = await fetch(`${apiUrl}/users/request-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(responseData.message || "Gagal mengirim permintaan.");

      alert("Request sent successfully! Please wait for further confirmation.");
      await fetchProfileData();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setIsRequestingRole(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] text-[#1e3a8a] font-bold animate-pulse">Loading data profil...</div>;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-red-500 font-bold gap-4">
        <p>{error || "Gagal memuat profil."}</p>
        <button onClick={() => router.back()} className="text-sm bg-[#1e3a8a] text-white px-4 py-2 rounded-xl">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <main className="px-6 py-8 md:px-20 max-w-[1400px] w-full mx-auto font-sans relative">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-extrabold text-[#0b5394] tracking-tight">{isEditing ? "Account Settings" : "Welcome Back"}</h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">{isEditing ? "Here you can set your account personalization" : "Here lies your personal account information and overall achievement"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KOLOM KIRI (PROFIL UTAMA & ACHIEVEMENTS) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm relative">
            <div className="h-28 bg-[#0b5394] w-full relative" />
            <div className="px-8 pb-8 relative">
              <div className="w-24 h-24 rounded-2xl bg-[#cfe2f3] border-4 border-white text-[#1155cc] font-bold text-2xl flex items-center justify-center absolute -top-12 left-8 shadow-sm select-none">
                {getInitials(profile.name)}
              </div>

              <div className="pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">{profile.name}</h2>
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Campus Name (e.g. BINUS UNIVERSITY)"
                      className="mt-2 text-xs font-semibold p-2 border border-gray-200 rounded-lg w-full max-w-sm focus:outline-none focus:border-[#0b5394] uppercase"
                      value={formData.campus_name}
                      onChange={(e) => setFormData({ ...formData, campus_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-0.5">{profile.campus_name || "NOT SPECIFIED YET"}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing && (
                    <button onClick={() => setIsEditing(false)} className="text-xs font-semibold px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                    disabled={isSaving}
                    className="text-xs font-semibold px-6 py-2 rounded-xl bg-[#f4f5f7] text-gray-700 hover:bg-gray-200 border border-gray-100 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 size={12} className="animate-spin" />}
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-gray-800 text-sm mb-2">About Me</h3>
                {isEditing ? (
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="text-xs text-gray-600 p-2.5 border border-gray-200 rounded-xl w-full focus:outline-none focus:border-[#0b5394] leading-relaxed resize-none"
                    value={formData.about_me}
                    onChange={(e) => setFormData({ ...formData, about_me: e.target.value })}
                  />
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed max-w-2xl font-medium">
                    {profile.about_me || "Passionate about competitive programming and building impactful software solutions. Always looking for new challenges in hackathons and data science."}
                  </p>
                )}
              </div>

              {/* BARIS INFO USER: HANYA EMAIL & SEMESTER SEKARANG */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-gray-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={16} className="text-gray-400" />
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="number"
                        min="1"
                        max="14"
                        placeholder="Semester"
                        className="p-1 border border-gray-200 rounded-md w-16 text-center text-gray-700 focus:outline-none focus:border-[#0b5394]"
                        value={formData.semester}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      />
                      <span className="text-gray-400 text-[11px]">th Semester</span>
                    </div>
                  ) : (
                    <span>{profile.semester ? `${profile.semester}th Semester` : "Semester not specified"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TAB MY ACHIEVEMENT */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-bold text-gray-800 text-base">My Achievement</h3>
            </div>

            {profile.achievements && profile.achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{/* Tempat render dokumen */}</div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#f4f5f7] flex items-center justify-center text-gray-300 mb-4">
                  <Trophy size={28} />
                </div>
                <p className="text-xs text-gray-400 font-medium mb-5">You have no achievement yet</p>
                <button
                  onClick={() => router.push("/dashboard/competition")}
                  className="px-8 py-2.5 text-xs font-bold text-white bg-[#8da9d6] hover:bg-[#7a98c7] rounded-xl transition-colors shadow-sm"
                >
                  Find Competition
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN (SKILLS, STATS, RESULTS & ACTIONS) */}
        <div className="space-y-6">
          {/* TAB SKILLS & EXPERTISE */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-800 text-xs mb-4">Skills & Expertise</h4>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  placeholder="React, TypeScript, Python (separated by comma)"
                  className="text-xs p-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:border-[#0b5394]"
                  value={formData.skills_input}
                  onChange={(e) => setFormData({ ...formData, skills_input: e.target.value })}
                />
                <p className="text-[10px] text-gray-400 mt-1">Gunakan tanda koma (,) untuk memisahkan setiap item skill.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills_expertise && profile.skills_expertise.length > 0
                  ? profile.skills_expertise.map((skill, index) => (
                      <span key={index} className="text-[11px] font-bold bg-[#f4f5f7] text-gray-700 px-3 py-1.5 rounded-lg">
                        {skill}
                      </span>
                    ))
                  : ["React", "Typescript", "Python", "Machine Learning", "UI/UX Design"].map((skill, index) => (
                      <span key={index} className="text-[11px] font-bold bg-[#f4f5f7] text-gray-700 px-4 py-1.5 rounded-lg">
                        {skill}
                      </span>
                    ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-800 text-xs">Total Competition Registered</h4>
            <p className="text-7xl font-semibold text-gray-800 mt-2 tracking-tight">{profile.total_registrations || 0}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-800 text-xs">Total Competition Won</h4>
            <p className="text-7xl font-semibold text-gray-800 mt-2 tracking-tight">{countTotalWins()}</p>
          </div>

          {/* TAB COMPETITION RESULTS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-800 text-xs mb-4">Competition Results</h4>

            {loadingResults ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-400 font-semibold">
                <Loader2 size={14} className="animate-spin text-[#0b5394]" />
                <span>Loading metrics history...</span>
              </div>
            ) : competitionResults.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium italic py-2">Belum ada riwayat hasil.</p>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 mb-1">
                {competitionResults.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-xl border border-gray-100 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${result.rank === 1 ? "bg-amber-50 text-amber-500" : result.rank === 2 ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-500"}`}
                      >
                        <Trophy size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{result.competition_title}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md flex-shrink-0 ${
                        result.rank === 1 ? "bg-amber-500 text-white" : result.rank === 2 ? "bg-slate-400 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {result.rank > 0 ? `Rank ${result.rank}` : "Participant"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOMBOL APPLY AS ORGANIZER */}
          <div>
            {profile.role === "organizer" ? (
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 justify-center">
                <CheckCircle size={15} />
                <span>You are verified Organizer</span>
              </div>
            ) : (
              <button
                onClick={handleRequestOrganizer}
                disabled={isRequestingRole}
                className="w-full text-xs font-bold py-3 rounded-xl bg-[#8da9d6] hover:bg-[#7a98c7] text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
              >
                {isRequestingRole ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <span>Apply as Organizer</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
