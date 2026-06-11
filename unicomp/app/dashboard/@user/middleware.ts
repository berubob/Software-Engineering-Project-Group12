"use client";
import { useState, useEffect } from "react";

export interface CompetitionRegistration {
  id: string;
  name: string;
  date: string;
  endDate: string | null;
  deadline: string | null;
}

export interface CompetitionResultItem {
  competition_id: number;
  competition_title: string;
  rank: number;
  score?: number | string;
}

export function useDashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<CompetitionRegistration[]>([]);
  const [competitionResults, setCompetitionResults] = useState<CompetitionResultItem[]>([]);

  const [loadingNotif, setLoadingNotif] = useState<boolean>(true);
  const [loadingReg, setLoadingReg] = useState<boolean>(true);
  const [loadingResults, setLoadingResults] = useState<boolean>(true);

  const [activeCount, setActiveCount] = useState<number>(0);
  const [deadlineCount, setDeadlineCount] = useState<number>(0);

  const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/notifications/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data notifikasi");
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      // <-- PERBAIKAN: Diubah dari 'filey' menjadi 'finally'
      setLoadingNotif(false);
    }
  };

  const fetchResultsData = async () => {
    try {
      setLoadingResults(true);
      const token = localStorage.getItem("token");
      if (!token) return;

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

      if (!userData.total_wins || Object.keys(userData.total_wins).length === 0) {
        setCompetitionResults([]);
        return;
      }

      const allIds: number[] = [];
      Object.values(userData.total_wins).forEach((category: any) => {
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
                  if (innerRankObj) userRank = Number(innerRankObj.rank);
                } else if (typeof targetData.rank === "object") {
                  userRank = targetData.rank.rank !== undefined ? Number(targetData.rank.rank) : 0;
                } else {
                  userRank = Number(targetData.rank);
                }
              }
            }
          }

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
      console.error("Error fetching detailed competition metrics on dashboard:", error);
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoadingReg(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/registrations/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data registrasi");
      const data = await res.json();

      const mappedRegs = Array.isArray(data)
        ? data.map((item: any) => {
            const displayDate = item.end_date ? `End: ${new Date(item.end_date).toISOString().split("T")[0]}` : "Date not available";

            return {
              id: item.competition_id || item.registration_id || `comp-${Math.random()}`,
              name: item.title || "UNNAMED COMPETITION",
              date: displayDate,
              endDate: item.end_date || null,
              deadline: item.deadline || null,
            };
          })
        : [];

      setRegistrations(mappedRegs);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      let active = 0;
      let upcoming = 0;

      mappedRegs.forEach((comp) => {
        if (comp.endDate) {
          const compEndDate = new Date(comp.endDate);
          compEndDate.setHours(0, 0, 0, 0);

          if (compEndDate >= today) {
            active++;
          }
        } else {
          active++;
        }

        const targetTargetDate = comp.deadline || comp.endDate;

        if (targetTargetDate) {
          const compDeadlineDate = new Date(targetTargetDate);
          compDeadlineDate.setHours(0, 0, 0, 0);

          if (compDeadlineDate >= today && compDeadlineDate <= sevenDaysFromNow) {
            upcoming++;
          }
        }
      });

      setActiveCount(active);
      setDeadlineCount(upcoming);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoadingReg(false);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchNotifications();
      fetchRegistrations();
      fetchResultsData();
    }
  }, [apiUrl]);

  const stats = [
    {
      label: "Active Competition",
      value: loadingReg ? "-" : activeCount,
      icon: "/Trophy.svg",
      color: "bg-orange-100",
      href: "/dashboard/active-competition",
    },
    {
      label: "Upcoming Deadlines",
      value: loadingReg ? "-" : deadlineCount,
      icon: "/Clock.svg",
      color: "bg-red-100",
      href: "/dashboard/upcoming-deadlines",
    },
    {
      label: "New Notifications",
      value: loadingNotif ? "-" : notifications.length,
      icon: "/Bell.svg",
      color: "bg-green-100",
      href: "/dashboard/notifications",
    },
  ];

  return {
    stats,
    registrations,
    competitionResults,
    loadingReg,
    loadingResults,
  };
}
