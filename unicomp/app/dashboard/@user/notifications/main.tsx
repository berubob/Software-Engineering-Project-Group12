"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Mengimpor Link untuk navigasi internal Next.js

interface Notification {
  id: string; // Tambahkan id di interface untuk rute dinamis
  title: string;
  status: "UNREAD" | "READ" | string;
  time: string;
  desc: string;
}

export default function Main() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // DUMMY DATA LOKAL + ID UNTUK TESTING ROUTING
  const dummyNotifications: Notification[] = [
    {
      id: "1",
      title: "VIBEZ UPLOAD REMINDER",
      status: "UNREAD",
      time: "1 hour ago",
      desc: "Announcement: Reminder to all of Vibez Coding Competition to upload your project at max at April 11, 2026. Make sure to upload all of your work with following UI Design (.fig), ...",
    },
    {
      id: "2",
      title: "VIBEZ MID POINT CHECK IN",
      status: "UNREAD",
      time: "7 hours ago",
      desc: "System Reminder: Mid-point Check-in will be held soon at April 8, 2026 at 12:00. Don't forget to attend this activity.",
    },
    {
      id: "3",
      title: "COMPETITION BRIEFING",
      status: "UNREAD",
      time: "2 days ago",
      desc: "Announcement: Hi, all Competition Enjoyer! Don't forget to attend the Competition Briefing at 19:00 - 21:00, April 6, 2026. The meeting will be held at zoom room ID: 911620, ...",
    },
    {
      id: "4",
      title: "UNTECH COMPETITION",
      status: "READ",
      time: "11 days ago",
      desc: "Announcement: Hi, all Competition Enjoyer! Before the competition will be start next week, there will be an Competition Briefing at 19:00 - 21:00, April 6, 2026. The meeting code ...",
    },
    {
      id: "5",
      title: "DATA SCIENCE SEMINAR",
      status: "READ",
      time: "2 weeks ago",
      desc: "Information: The certificates for the Data Science Seminar have been distributed. Please check your registered email inbox or spam folder.",
    },
    {
      id: "6",
      title: "REGISTRATION SUCCESSFUL",
      status: "READ",
      time: "3 weeks ago",
      desc: "System: You have successfully registered for the AI Hackathon 2026. Welcome aboard and good luck with your team project!",
    },
  ];

  useEffect(() => {
    const loadDummyData = setTimeout(() => {
      setNotifications(dummyNotifications);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(loadDummyData);

    /* // JIKA BACKEND SIAP, MAP DATA KAMU AGAR PUNYA PROPERTI ID:
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/notifications/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        
        const mappedData = Array.isArray(data) ? data.map((item: any) => ({
          id: item.notification_id || item.id, // Pastikan id terpetakan dari database
          title: item.title,
          status: item.status,
          time: item.time,
          desc: item.desc || item.message,
        })) : [];
        
        setNotifications(mappedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    */
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e40af]">Competition Notifications</h1>
          <p className="text-gray-500 mt-2 text-sm">Here is all of your competition updates. Make sure not to miss them!</p>
        </div>
        {notifications.length > 0 && (
          <button className="text-[10px] font-bold text-gray-500 hover:text-blue-600 transition-colors mt-4 md:mt-0 uppercase tracking-tighter cursor-pointer">Mark All Read</button>
        )}
      </div>

      {/* Notifications Card Container (Box Scrollable) */}
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
            {notifications.map((notif, index) => (
              /* DIUBAH MENJADI LINK DINAMIS */
              <Link
                key={index}
                href={`/dashboard/notifications/${notif.id}`} // Arahkan sesuai folder rute detail notifikasi kamu
                className="p-8 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors block cursor-pointer"
              >
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
