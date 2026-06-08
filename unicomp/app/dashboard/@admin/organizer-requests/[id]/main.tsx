"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Mail, GraduationCap, MapPin, User } from "lucide-react";

interface RequestDetail {
  request_id: string;
  requester_id: string;
  status: string;
  created_at: string;
  requester_name: string;
  requester_email: string;

  major_semester?: string;
  location?: string;
  about_me?: string;
}

export default function Main() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

  useEffect(() => {
    if (!id) return;

    const fetchDetailRequest = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/users/role-requests/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.ok) {
          const data = await res.json();
          setRequest(data);
        } else {
          setError("Gagal mengambil data detail permohonan.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan jaringan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailRequest();
  }, [id, apiUrl]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/organizers/accept/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        alert("Permohonan berhasil disetujui!");
        router.push("/dashboard");
      } else {
        alert("Gagal menyetujui permohonan.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin text-[#8CABD9]" size={32} />
        <p className="text-sm font-medium">Loading user information...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4 text-red-500">
        <p className="text-sm font-medium">{error || "Data tidak ditemukan."}</p>
        <button onClick={() => router.back()} className="text-xs text-gray-500 underline flex items-center gap-1">
          <ArrowLeft size={14} /> Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-sans selection:bg-blue-100">
      {/* --- MAIN CONTENT CONTAINER --- */}
      <main className="flex-1 px-6 py-10 md:px-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-slate-600 mb-6"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a4380]">Welcome Back</h1>
          <p className="text-gray-400 text-xs mt-0.5">Here lies your personal account information</p>
        </div>

        {/* --- DYNAMIC USER CARD --- */}
        <div className="max-w-5xl bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden mx-auto">
          {/* Blue Decorative Header Bar inside Card */}
          <div className="h-28 bg-[#1056a1]" />

          {/* Card Body */}
          <div className="px-10 pb-10 relative">
            {/* Avatar Badge Placement */}
            <div className="absolute -top-12 left-10 w-20 h-20 bg-[#d9e7f7] border-4 border-white rounded-xl flex items-center justify-center font-bold text-2xl text-[#1056a1] shadow-md">
              {getInitials(request.requester_name)}
            </div>

            {/* Profile Info */}
            <div className="pt-12">
              <h2 className="text-xl font-bold text-slate-800">{request.requester_name}</h2>
            </div>

            {/* About Me Section */}
            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-700">About Me</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-2xl">
                {request.about_me || "Passionate about competitive programming and building impactful software solutions. Always looking for new challenges in hackathons and data science."}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-gray-50 pt-6 text-gray-500 text-xs">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span>{request.requester_email}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-gray-400" />
                <span>{request.major_semester || "Computer Science, 4th Semester"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span>{request.location || "Kemanggisan"}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-10">
              <button
                disabled={actionLoading}
                onClick={handleApprove}
                className="w-full bg-[#8DAED6] hover:bg-[#7b9ec7] text-white font-bold text-xs py-4 rounded-xl shadow-sm tracking-wide transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Approve as Organizer"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
