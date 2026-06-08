"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface NotificationDetail {
  id: string;
  title: string;
  type: string;
  description: string;
  created_at: string;
}

export default function NotificationDetailMain() {
  const params = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;
        const token = localStorage.getItem("token");

        const res = await fetch(`${apiUrl}/notifications/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil daftar data notifikasi");
        }

        const dataList = await res.json();

        if (Array.isArray(dataList)) {
          const matchedNotif = dataList.find((item: any) => String(item.id) === String(params.id) || String(item.notification_id) === String(params.id));

          if (matchedNotif) {
            setNotification({
              id: matchedNotif.id || matchedNotif.notification_id,
              title: matchedNotif.title || "NOTIFICATION DETAIL",
              type: matchedNotif.type || "Announcement",
              description: matchedNotif.message || matchedNotif.description || matchedNotif.desc || "",
              created_at: matchedNotif.created_at || "",
            });
          } else {
            throw new Error("Detail data notifikasi tidak ditemukan.");
          }
        } else {
          throw new Error("Format respon data API tidak sesuai.");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchNotificationData();
    }
  }, [params.id]);

  // Format tanggal agar lebih rapi dan human-readable
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-[#1e40af] gap-3">
        <div className="w-8 h-8 border-4 border-[#1e40af] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold tracking-wide">Memuat detail notifikasi...</p>
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] px-6 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-3xl border border-red-100 max-w-md w-full shadow-sm">
          <p className="font-bold text-lg mb-4">{error || "Notifikasi tidak ditemukan."}</p>
          <button
            onClick={() => router.back()}
            className="w-full text-sm bg-[#1e40af] text-white py-3 rounded-2xl font-bold hover:bg-[#1a3694] transition-colors shadow-md active:scale-[0.99] cursor-pointer"
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
      {/* BACKGROUND GRAPHIC OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 py-12 font-sans">
        {/* HEADER SECTION: BACK BUTTON & METADATA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-200/60">
          <div className="flex items-center gap-4">
            {/* Tombol Back Premium Modern */}
            <button
              type="button"
              onClick={() => router.back()}
              className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-gray-200/80 flex items-center justify-center text-[#1e40af] hover:text-white hover:bg-[#1e40af] hover:border-[#1e40af] transition-all duration-200 cursor-pointer outline-none flex-shrink-0 active:scale-95"
              title="Kembali"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-[#1e40af] border border-blue-100/50 uppercase tracking-wider mb-1">
                <Tag size={12} /> {notification.type}
              </span>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight max-w-xl">{notification.title}</h1>
            </div>
          </div>

          {/* Timestamp di sisi kanan (Desktop) atau bawah (Mobile) */}
          {notification.created_at && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold sm:self-end bg-gray-100/80 px-3 py-1.5 rounded-xl border border-gray-200/30">
              <Clock size={14} />
              <span>{formatDate(notification.created_at)}</span>
            </div>
          )}
        </div>

        {/* CONTAINER UTAMA ISI NOTIFIKASI */}
        <div className="relative w-full bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 min-h-[350px] overflow-hidden">
          {/* Garis Aksen Dekoratif Gradasi di Atas Card */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4593DF] to-[#1e40af]"></div>

          {/* Deskripsi / Isi Pengumuman */}
          <article className="text-gray-600 text-sm md:text-[15px] leading-relaxed whitespace-pre-line font-medium max-w-none">{notification.description}</article>
        </div>
      </main>
    </div>
  );
}
