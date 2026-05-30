"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
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

        const res = await fetch(`${apiUrl}/notifications/${params.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil detail notifikasi");
        }

        const data = await res.json();

        // Memastikan pemetaan data dari API masuk ke state UI secara pas
        setNotification({
          id: data.id || data.notification_id,
          title: data.title || "NOTIFICATION DETAIL",
          type: data.type || "Announcement",
          description: data.description || data.desc || data.message || "",
          created_at: data.created_at || "",
        });
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

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f9fa] text-[#1e40af] font-bold">Loading detail notifikasi...</div>;
  }

  if (error || !notification) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9fa] text-red-500 font-bold gap-4">
        <p>{error || "Notifikasi tidak ditemukan."}</p>
        <button onClick={() => router.back()} className="text-sm bg-[#1e40af] text-white px-4 py-2 rounded-xl cursor-pointer">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
      {/* BACKGROUND GRAPHIC OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-6xl w-full mx-auto px-6 md:px-20 py-10 font-sans">
        {/* HEADER SECTION: TOMBOL BACK & JUDUL SEJAJAR */}
        <div className="flex items-start gap-4 mb-8">
          {/* Tombol Back Lingkaran Putih */}
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1e40af] hover:bg-gray-50 transition-colors cursor-pointer outline-none flex-shrink-0 mt-1"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Teks Judul Utama dan Jenis Notifikasi */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e40af] tracking-tight uppercase">{notification.title}</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium capitalize">{notification.type}</p>
          </div>
        </div>

        {/* CONTAINER UTAMA ISI NOTIFIKASI */}
        <div className="w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-12 min-h-[300px]">
          {/* Deskripsi / Isi Pengumuman */}
          <div className="text-gray-600 text-xs md:text-sm leading-relaxed whitespace-pre-line font-medium max-w-[95%]">{notification.description}</div>
        </div>
      </main>
    </div>
  );
}
