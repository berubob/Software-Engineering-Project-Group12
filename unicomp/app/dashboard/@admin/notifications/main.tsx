"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  status: "UNREAD" | "READ" | string;
  time: string;
  desc: string;
}

export default function Main() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMarkingRead, setIsMarkingRead] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
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

      const mappedData = Array.isArray(data)
        ? data.map((item: any) => {
            const timeDisplay = item.time || (item.created_at ? formatTimeAgo(item.created_at) : "Baru saja");

            return {
              id: item.notification_id || item.id,
              title: item.title || "ANNOUNCEMENT",
              status: item.is_read === true || item.status === "READ" ? "READ" : "UNREAD",
              time: timeDisplay,
              desc: item.desc || item.message || "",
            };
          })
        : [];

      setNotifications(mappedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchNotifications();
    }
  }, []);

  // Menandai semua notifikasi UNREAD menjadi READ via API PATCH
  const handleMarkAllRead = async () => {
    // Ambil daftar notifikasi yang saat ini masih berstatus UNREAD
    const unreadNotifications = notifications.filter((n) => n.status === "UNREAD");

    // Jika tidak ada yang unread, hentikan eksekusi
    if (unreadNotifications.length === 0) {
      alert("Semua notifikasi Anda sudah dibaca.");
      return;
    }

    try {
      setIsMarkingRead(true);
      const token = localStorage.getItem("token");

      // Eksekusi semua request PATCH secara paralel ke backend menggunakan Promise.all
      const promises = unreadNotifications.map(async (notif) => {
        const res = await fetch(`${apiUrl}/notifications/me/${notif.id}/read`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        return { id: notif.id, ok: res.ok };
      });

      const results = await Promise.all(promises);
      const successfulIds = results.filter((r) => r.ok).map((r) => r.id);

      // Perbarui state UI secara lokal untuk notifikasi yang berhasil diubah di backend
      setNotifications((prev) => prev.map((notif) => (successfulIds.includes(notif.id) ? { ...notif, status: "READ" } : notif)));

      if (successfulIds.length === unreadNotifications.length) {
        alert("Semua notifikasi berhasil ditandai telah dibaca!");
      } else {
        alert(`${successfulIds.length} dari ${unreadNotifications.length} notifikasi berhasil diperbarui.`);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      alert("Terjadi kesalahan jaringan saat memperbarui status notifikasi.");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const msPerMinute = 60 * 1000;
      const msPerHour = msPerMinute * 60;
      const msPerDay = msPerHour * 24;
      const elapsed = now.getTime() - past.getTime();

      if (elapsed < msPerMinute) return "Just now";
      if (elapsed < msPerHour) return `${Math.round(elapsed / msPerMinute)} minutes ago`;
      if (elapsed < msPerDay) return `${Math.round(elapsed / msPerHour)} hours ago`;
      return `${Math.round(elapsed / msPerDay)} days ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Competition Notifications</h1>
          <p className="text-gray-500 mt-2 text-sm">Here is all of your competition updates. Make sure not to miss them!</p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={isMarkingRead || !notifications.some((n) => n.status === "UNREAD")}
            className="text-[10px] font-bold text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors mt-4 md:mt-0 uppercase tracking-tighter cursor-pointer"
          >
            {isMarkingRead ? "Processing..." : "Mark All Read"}
          </button>
        )}
      </div>

      {/* Notifications Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-gray-400 animate-pulse">Loading your notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="text-gray-400 text-sm font-semibold mb-1">No notification</div>
            <p className="text-xs text-gray-400/80">You are completely up to date!</p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[480px] overflow-y-auto scrollbar-thin">
            {notifications.map((notif) => (
              <Link key={notif.id} href={`/dashboard/notifications/${notif.id}`} className="p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors block cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-bold text-gray-800 tracking-tight">{notif.title}</h2>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${notif.status === "UNREAD" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>{notif.status}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{notif.time}</span>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed max-w-[90%] line-clamp-2 md:line-clamp-none">{notif.desc}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
