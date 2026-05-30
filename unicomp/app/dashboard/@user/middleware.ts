"use client";
import { useState, useEffect } from "react";

export interface CompetitionRegistration {
  id: string;
  name: string;
  date: string;
  endDate: string | null;
  deadline: string | null;
}

export function useDashboard() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<CompetitionRegistration[]>([]);
  const [loadingNotif, setLoadingNotif] = useState<boolean>(true);
  const [loadingReg, setLoadingReg] = useState<boolean>(true);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [deadlineCount, setDeadlineCount] = useState<number>(0);

  const fetchNotifications = async () => {
    try {
      setLoadingNotif(true);
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
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
      setLoadingNotif(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoadingReg(true);
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
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
            // Memformat tampilan tanggal untuk UI (Contoh hasil: "End: 2026-06-05")
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

      // --- LOGIKA UTAMA FILTER WAKTU (DENGAN DATA ASLI API) ---
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Batas H+7 dari hari ini
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      let active = 0;
      let upcoming = 0;

      mappedRegs.forEach((comp) => {
        // 1. Hitung Kompetisi Aktif berdasarkan 'endDate' yang belum terlewat
        if (comp.endDate) {
          const compEndDate = new Date(comp.endDate);
          compEndDate.setHours(0, 0, 0, 0);

          if (compEndDate >= today) {
            active++;
          }
        } else {
          // Jika tidak ada endDate dari backend, default dianggap aktif
          active++;
        }

        // 2. Hitung Upcoming Deadlines berdasarkan 'deadline' atau 'endDate' (H-7)
        const targetTargetDate = comp.deadline || comp.endDate;

        if (targetTargetDate) {
          const compDeadlineDate = new Date(targetTargetDate);
          compDeadlineDate.setHours(0, 0, 0, 0);

          // Masuk kategori upcoming jika deadline-nya antara hari ini sampai 7 hari ke depan
          if (compDeadlineDate >= today && compDeadlineDate <= sevenDaysFromNow) {
            upcoming++;
          }
        }
      });

      setActiveCount(active);
      setDeadlineCount(upcoming);
      // --------------------------------------------------------
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoadingReg(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchRegistrations();
  }, []);

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
    loadingReg,
  };
}
