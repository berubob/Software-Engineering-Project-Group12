"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Trophy, FileText, ChevronDown, Loader2, ChevronRight, Check, X, AlertCircle } from "lucide-react";

interface OrganizerRequestUser {
  request_id: string;
  requester_id: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  requester_name: string;
  requester_email: string;
  requester_current_role: string;
}

interface ActiveCompetitionOption {
  id: string;
  title: string;
}

interface PendingResultItem {
  id?: string;
  result_id?: string;
  competition_id: string;
  competition_title: string; // Akan diisi dari /competitions/[id]
  organizer_name?: string;
  announcement_date: string;
  status: string;
  rank: {
    rank: number;
    user_id: number;
    username?: string; // Akan diisi dari /users/[id]/name
  }[];
}

export default function Main() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_active_tab") || "notification";
    }
    return "notification";
  });

  const [activeCompCount, setActiveCompCount] = useState<number>(0);
  const [pendingCompCount, setPendingCompCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  const [activeCompetitionOptions, setActiveCompetitionOptions] = useState<ActiveCompetitionOption[]>([]);

  const [targetAudience, setTargetAudience] = useState<string>("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const [organizerRequests, setOrganizerRequests] = useState<OrganizerRequestUser[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const [pendingResults, setPendingResults] = useState<PendingResultItem[]>([]);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [processingResultId, setProcessingResultId] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Mengambil data dari endpoint kompetisi umum dan kompetisi admin (pending) secara paralel
        const [resCompetitions, resPendingAdmin] = await Promise.all([
          fetch(`${apiUrl}/competitions`, { method: "GET", headers }),
          fetch(`${apiUrl}/competitions/admin?status=pending`, { method: "GET", headers }),
        ]);

        if (!resCompetitions.ok) throw new Error("Gagal mengambil data kompetisi");

        // 1. Memproses Kompetisi Aktif
        const competitions = await resCompetitions.json();
        const today = new Date();

        const activeCompetitions = competitions.filter((comp: any) => {
          if (!comp.end_date) return false;
          const endDate = new Date(comp.end_date);
          return endDate >= today;
        });
        setActiveCompCount(activeCompetitions.length);

        const mappedOptions = activeCompetitions.map((comp: any) => ({
          id: comp.id || comp.competition_id,
          title: comp.title || comp.name,
        }));
        setActiveCompetitionOptions(mappedOptions);

        // 2. Memproses Jumlah Kompetisi Pending dari Endpoint Admin khusus
        if (resPendingAdmin.ok) {
          const pendingAdminData = await resPendingAdmin.json();
          setPendingCompCount(Array.isArray(pendingAdminData) ? pendingAdminData.length : 0);
        } else {
          console.error("Gagal mengambil data dari /competitions/admin");
          setPendingCompCount(0);
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setActiveCompCount(0);
        setPendingCompCount(0);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [apiUrl]);

  // Fetch data hasil pemenang + Enrichment Nama Kompetisi & Nama User
  const fetchPendingResults = async () => {
    try {
      setLoadingResults(true);
      setResultsError(null);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${apiUrl}/results?status=pending`, {
        method: "GET",
        headers,
      });

      if (!res.ok) throw new Error("Gagal memuat data hasil kelulusan.");

      const data = await res.json();
      const initialFilteredData = Array.isArray(data) ? data.filter((item: any) => item.status === "pending") : [];

      // Proses enrichment secara paralel untuk performa optimal
      const enrichedResults = await Promise.all(
        initialFilteredData.map(async (result: any) => {
          let competitionTitle = result.competition_title || `Competition ID: ${result.competition_id}`;

          // 1. Ambil Nama Kompetisi jika belum ada
          if (!result.competition_title && result.competition_id) {
            try {
              const compRes = await fetch(`${apiUrl}/competitions/${result.competition_id}`, { headers });
              if (compRes.ok) {
                const compData = await compRes.json();
                competitionTitle = compData.title || compData.name || competitionTitle;
              }
            } catch (e) {
              console.error(`Gagal fetch nama kompetisi ${result.competition_id}:`, e);
            }
          }

          // 2. Ambil Nama untuk setiap User di dalam array rank
          const enrichedRank = await Promise.all(
            (result.rank || []).map(async (rankItem: any) => {
              let username = rankItem.username || `User ID: ${rankItem.user_id}`;
              if (!rankItem.username && rankItem.user_id) {
                try {
                  const userRes = await fetch(`${apiUrl}/users/${rankItem.user_id}/name`, { headers });
                  if (userRes.ok) {
                    const userData = await userRes.json();
                    username = userData.name || userData.username || username;
                  }
                } catch (e) {
                  console.error(`Gagal fetch nama user ${rankItem.user_id}:`, e);
                }
              }
              return { ...rankItem, username };
            }),
          );

          return {
            ...result,
            competition_title: competitionTitle,
            rank: enrichedRank,
          };
        }),
      );

      setPendingResults(enrichedResults);
    } catch (err) {
      console.error("Error fetching results:", err);
      setResultsError("Terjadi kesalahan jaringan saat memuat hasil.");
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchOrganizerRequests = async () => {
    try {
      setLoadingRequests(true);
      setRequestError(null);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/users/role-requests?status=pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrganizerRequests(data);
      } else if (res.status === 401) {
        setRequestError("Sesi habis. Silakan login kembali sebagai admin.");
      } else {
        setRequestError("Gagal mengambil data permohonan.");
      }
    } catch (err) {
      console.error("Error:", err);
      setRequestError("Terjadi kesalahan jaringan.");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === "organizer") {
      fetchOrganizerRequests();
    } else if (activeTab === "publish") {
      fetchPendingResults();
    }
  }, [activeTab, apiUrl]);

  // Menangani Aksi Publish/Approve Hasil Kompetisi (PATCH ke /results/[id]/status)
  const handleApproveResult = async (resultId: string) => {
    const confirmPublish = window.confirm("Apakah Anda yakin ingin mempublikasikan hasil peringkat kompetisi ini secara resmi?");
    if (!confirmPublish) return;

    try {
      setProcessingResultId(resultId);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/results/${resultId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (res.ok) {
        alert("Hasil peringkat kompetisi berhasil dipublikasikan ke publik!");
        setPendingResults((prev) => prev.filter((item) => (item.result_id || item.id) !== resultId));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || "Gagal menyetujui hasil kompetisi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setProcessingResultId(null);
    }
  };

  const handleProcessRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      setProcessingId(requestId);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/users/role-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setOrganizerRequests((prev) => prev.filter((req) => req.request_id !== requestId));
        return { success: true, id: requestId };
      } else {
        const errorData = await res.json();
        return { success: false, id: requestId, message: errorData.message };
      }
    } catch (err) {
      console.error("Error processing role request:", err);
      return { success: false, id: requestId, message: "Kesalahan jaringan" };
    } finally {
      setProcessingId(null);
    }
  };

  const handleAcceptAllRequests = async () => {
    if (organizerRequests.length === 0) return;

    const confirmAction = window.confirm(`Apakah Anda yakin ingin menyetujui semua (${organizerRequests.length}) permintaan sekaligus?`);
    if (!confirmAction) return;

    try {
      setIsAccepting(true);
      const token = localStorage.getItem("token");
      const requestsToProcess = [...organizerRequests];

      const promises = requestsToProcess.map(async (req) => {
        const res = await fetch(`${apiUrl}/users/role-requests/${req.request_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ action: "accept" }),
        });
        return { id: req.request_id, ok: res.ok };
      });

      const results = await Promise.all(promises);
      const successfulIds = results.filter((r) => r.ok).map((r) => r.id);

      setOrganizerRequests((prev) => prev.filter((req) => !successfulIds.includes(req.request_id)));

      if (successfulIds.length === requestsToProcess.length) {
        alert("Semua permintaan berhasil disetujui!");
      } else {
        alert(`${successfulIds.length} dari ${requestsToProcess.length} permintaan berhasil disetujui. Sisanya gagal.`);
      }
    } catch (err) {
      console.error("Error Accept All:", err);
      alert("Terjadi kesalahan jaringan saat menyetujui semua permintaan.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handlePublishNotification = async () => {
    if (!messageContent.trim()) {
      alert("Mohon isi konten pengumuman terlebih dahulu.");
      return;
    }

    try {
      setIsPublishing(true);
      const token = localStorage.getItem("token");

      let payload: any = { message: messageContent };

      if (targetAudience === "all") {
        payload.target = "all";
      } else {
        payload.target = "competition";
        payload.competition_id = targetAudience;
      }

      const res = await fetch(`${apiUrl}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Notifikasi berhasil dikirim ke target!");
        setNotificationTitle("");
        setMessageContent("");
        setTargetAudience("all");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal mengirimkan notifikasi.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan saat mengirim notifikasi.");
    } finally {
      setIsPublishing(false);
    }
  };

  const stats = [
    { label: "Pending Approval", value: pendingCompCount, icon: Clock, iconColor: "text-[#FF5757]", bgColor: "bg-[#FEE2E2]", href: "/dashboard/pending-approval" },
    { label: "Active Competition", value: activeCompCount, icon: Trophy, iconColor: "text-[#FFB048]", bgColor: "bg-[#FEF3C7]", href: "/dashboard/active-competition" },
    { label: "Pending Publish Result", value: pendingResults.length, icon: FileText, iconColor: "text-[#4593DF]", bgColor: "bg-[#DBEAFE]", href: "#" },
  ];

  const tabs = [
    { id: "publish", label: `Publish Result (${pendingResults.length})` },
    { id: "notification", label: "Send Notification" },
    { id: "organizer", label: "Organizer Request" },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#1e40af]">Admin Control Center</h1>
        <p className="text-gray-500 text-sm mt-1">This is admin dashboard! Manage and update competitions, results and campus communication all on this website</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-gray-700 w-1/2 leading-tight">{stat.label}</div>
              <div className={`${stat.bgColor} p-2.5 rounded-full`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-5xl font-bold text-gray-800">{loadingStats ? <Loader2 size={32} className="animate-spin text-gray-300" /> : stat.value}</div>
              <Link href={stat.href} className="text-xs text-gray-400 hover:text-blue-600 transition-all font-medium">
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feature Container */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px]">
        {/* Dynamic Navigation Tab Bar */}
        <div className="flex gap-10 px-10 pt-8 border-b border-gray-100/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold transition-all ${activeTab === tab.id ? "text-[#4593DF] border-b-4 border-[#4593DF]" : "text-gray-400 hover:text-gray-500"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-10">
          {/* --- TAB 1: PUBLISH RESULT --- */}
          {activeTab === "publish" && (
            <div className="w-full">
              {loadingResults ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400 text-sm font-medium">
                  <Loader2 size={24} className="animate-spin text-[#4593DF]" /> Loading pending results...
                </div>
              ) : resultsError ? (
                <div className="flex items-center justify-center text-red-500 text-sm font-medium py-20">{resultsError}</div>
              ) : pendingResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-400 text-sm font-medium py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <AlertCircle size={32} className="text-gray-300 mb-2" />
                  No pending competition results submission at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingResults.map((result) => {
                    const resId = String(result.result_id || result.id);
                    return (
                      <div key={resId} className="bg-[#F9FAFB] border border-gray-100 rounded-[2rem] p-8 shadow-inner flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-gray-700 tracking-tight uppercase">{result.competition_title}</h3>
                          <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-1 uppercase mb-4">
                            Announcement: {new Date(result.announcement_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          </p>

                          <div className="space-y-2 mb-6">
                            {Array.isArray(result.rank) &&
                              result.rank.map((w, idx) => {
                                let badgeColor = "text-[#D97706] bg-[#FFEDD5]";
                                if (w.rank === 1) badgeColor = "text-[#F59E0B] bg-[#FEF3C7]";
                                if (w.rank === 2) badgeColor = "text-gray-500 bg-gray-100";

                                return (
                                  <div key={idx} className="bg-white border border-gray-50 px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm">
                                    <div className={`w-6 h-6 rounded-full ${badgeColor} text-[10px] flex items-center justify-center font-black`}>{w.rank}</div>
                                    <div className="text-xs text-gray-500 font-bold">{w.username}</div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <button
                          disabled={processingResultId === resId}
                          onClick={() => handleApproveResult(resId)}
                          className="w-full bg-[#4593DF] hover:bg-[#3476b7] text-white text-xs font-extrabold py-4 rounded-2xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {processingResultId === resId ? (
                            <>
                              <Loader2 size={14} className="animate-spin" /> Publishing...
                            </>
                          ) : (
                            "Publish Result & Notify"
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* --- TAB 2: SEND NOTIFICATION --- */}
          {activeTab === "notification" && (
            <div className="max-w-full space-y-6">
              {/* Dropdown target_audience sekarang otomatis sinkron */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Target Audience</label>
                <div className="relative">
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-gray-200/60 rounded-xl px-4 py-3.5 text-xs text-gray-600 appearance-none outline-none focus:border-blue-300 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="all">@all (Send to All Users)</option>
                    {activeCompetitionOptions.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.title} (Participants Only)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Notification Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Type your notification title here..."
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-gray-200/60 rounded-xl px-4 py-3.5 text-xs text-gray-700 placeholder-gray-300 outline-none focus:border-blue-300 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Message Content</label>
                <textarea
                  rows={6}
                  placeholder="Type your announcement here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-gray-200/60 rounded-xl px-4 py-3.5 text-xs text-gray-700 placeholder-gray-300 outline-none resize-none focus:border-blue-300 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  disabled={isPublishing}
                  onClick={handlePublishNotification}
                  className="w-full md:w-auto px-20 bg-[#8CABD9] hover:bg-[#7ba0d4] text-white text-xs font-extrabold py-4 rounded-2xl shadow-md active:scale-[0.98] transition-all block mx-auto disabled:opacity-60 cursor-pointer"
                >
                  {isPublishing ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Publishing...
                    </div>
                  ) : (
                    "Publish Notification"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* --- TAB 3: ORGANIZER REQUEST --- */}
          {activeTab === "organizer" && (
            <div className="flex flex-col h-[400px]">
              {loadingRequests ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm font-medium">
                  <Loader2 size={24} className="animate-spin text-[#8CABD9]" /> Loading requests...
                </div>
              ) : requestError ? (
                <div className="flex-1 flex items-center justify-center text-red-500 text-sm font-medium">{requestError}</div>
              ) : organizerRequests.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">No pending organizer requests.</div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {organizerRequests.map((request) => (
                      <div key={request.request_id} className="group flex items-center justify-between py-4 px-6 bg-white border border-gray-100 shadow-sm rounded-2xl transition-all duration-200">
                        <Link href={`/dashboard/organizer-requests/${request.request_id}`} className="flex-1">
                          <h4 className="text-sm font-black text-gray-800 tracking-tight group-hover:text-[#1e40af] transition-colors">{request.requester_name}</h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-gray-500 font-bold tracking-wider uppercase">{request.requester_email}</span>
                            <span className="text-[10px] px-2.5 py-0.5 bg-blue-600 text-white rounded-full font-bold uppercase tracking-wide shadow-sm">{request.requester_current_role}</span>
                          </div>
                        </Link>

                        <div className="flex items-center gap-2 ml-4">
                          {processingId === request.request_id ? (
                            <Loader2 size={16} className="animate-spin text-gray-400 mx-4" />
                          ) : (
                            <>
                              <button
                                onClick={() => handleProcessRequest(request.request_id, "accept")}
                                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Accept Request"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleProcessRequest(request.request_id, "decline")}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                                title="Decline Request"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          <ChevronRight size={18} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6">
                    <button
                      disabled={isAccepting || organizerRequests.length === 0}
                      onClick={handleAcceptAllRequests}
                      className="w-full bg-[#8CABD9] hover:bg-[#7DA0D0] text-white text-xs font-extrabold py-4 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Processing ({organizerRequests.length})...
                        </>
                      ) : (
                        `Accept All as Organizer (${organizerRequests.length})`
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
