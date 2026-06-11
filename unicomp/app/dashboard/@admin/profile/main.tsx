"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, AlertCircle, ArrowLeft, Edit3, Check, X } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: string;
  about_me: string;
  skills_expertise: string[];
  achievements: string[];
  semester: number;
  campus_name: string;
}

export default function Main() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Mode Edit
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // 1. Fetch Data Profil Berdasarkan Struktur JSON
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

        const res = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Gagal mengambil data profil.");
        const data: UserProfile = await res.json();

        setProfile(data);
        setEditForm(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan saat memuat data profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Handler Simpan Perubahan Edit Profile
  const handleSaveProfile = async () => {
    if (!editForm) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

      // Konstruksi payload agar sesuai dengan format yang diminta oleh dokumentasi API
      const payload = {
        username: editForm.name,
        about_me: editForm.about_me,
        skills_expertise: editForm.skills_expertise,
        achievements: editForm.achievements,
        semester: editForm.semester,
        campus_name: editForm.campus_name,
      };

      const res = await fetch(`${apiUrl}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data profil di server.");

      setProfile(editForm);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  // Ambil inisial nama secara dinamis (Contoh: Nathan Surya -> NS)
  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-180px)] flex flex-col items-center justify-center gap-2 bg-[#f8f9fa]">
        <Loader2 className="animate-spin text-[#8cabd9] w-10 h-10" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-[calc(100vh-180px)] flex flex-col items-center justify-center gap-2 bg-[#f8f9fa] text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-medium">{error || "Data gagal dimuat."}</p>
      </div>
    );
  }

  return (
    <div className="relative h-auto md:min-h-[calc(100vh-180px)] w-full bg-[#f8f9fa] flex flex-col justify-between">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Profile Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans flex-1">
        {/* Tombol Back */}
        <div className="mb-6">
          <Link href="/dashboard">
            <button className="p-2.5 bg-white rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer outline-none">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">Here lies your account personal information</p>
        </div>

        {/* CARD CONTAINER UTAMA */}
        <div className="w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative">
          {/* Top Banner Blue Core */}
          <div className="h-32 w-full bg-[#1e5297] relative">
            {isEditing && (
              <div className="absolute top-4 right-4 text-white/40">
                <Edit3 className="w-6 h-6 animate-pulse" />
              </div>
            )}
          </div>

          {/* Konten Di Dalam Card */}
          <div className="px-8 pb-12 pt-0 relative">
            {/* Avatar Inisial */}
            <div className="absolute -top-14 left-8 w-24 h-24 bg-[#dbeafe] rounded-2xl border-4 border-white flex items-center justify-center shadow-sm select-none">
              <span className="text-2xl font-black text-[#1e5297]">{getInitials(isEditing ? editForm?.name || "" : profile.name)}</span>
            </div>

            {/* Baris Tombol Aksi (Edit / Save / Cancel) */}
            <div className="flex justify-end pt-4 mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#f8f9fa] hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl border border-gray-200 transition-colors cursor-pointer outline-none"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#1e5297] hover:bg-[#153b6e] text-white font-bold text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer outline-none disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(profile);
                    }}
                    disabled={isSaving}
                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer outline-none"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* FORM / DETAIL SECTION */}
            <div className="mt-8 max-w-4xl">
              {/* Nama & Universitas */}
              <div className="mb-8">
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">{profile.name}</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{profile.campus_name}</p>
                  </>
                ) : (
                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                      <input
                        type="text"
                        value={editForm?.name || ""}
                        onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                        className="w-full mt-1 px-4 py-2 text-gray-800 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e5297]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Campus Name</label>
                      <input
                        type="text"
                        value={editForm?.campus_name || ""}
                        onChange={(e) => setEditForm({ ...editForm!, campus_name: e.target.value })}
                        className="w-full mt-1 px-4 py-2 text-gray-800 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#1e5297]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* About Me / Deskripsi Bio */}
              <div className="mb-10">
                <h3 className="text-sm font-black text-gray-700 tracking-tight mb-2">About Me</h3>
                {!isEditing ? (
                  <p className="text-gray-500 font-medium text-sm md:text-base leading-relaxed max-w-3xl">{profile.about_me || "No description provided."}</p>
                ) : (
                  <textarea
                    rows={4}
                    value={editForm?.about_me || ""}
                    onChange={(e) => setEditForm({ ...editForm!, about_me: e.target.value })}
                    className="w-full p-4 text-gray-500 font-medium text-sm md:text-base border border-gray-200 rounded-2xl focus:outline-none focus:border-[#1e5297] leading-relaxed max-w-3xl"
                  />
                )}
              </div>

              {/* Grid Metadata Kontak & Informasi Kuliah */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-sm">✉</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-gray-600">{profile.email}</p>
                  </div>
                </div>

                {/* Semester */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-sm">🎓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Semester</p>
                    {!isEditing ? (
                      <p className="text-sm font-bold text-gray-600">{profile.semester}th Semester</p>
                    ) : (
                      <input
                        type="number"
                        value={editForm?.semester || 0}
                        onChange={(e) => setEditForm({ ...editForm!, semester: parseInt(e.target.value) || 0 })}
                        className="w-full mt-0.5 text-sm font-bold text-gray-600 border-b border-gray-200 focus:outline-none focus:border-[#1e5297]"
                      />
                    )}
                  </div>
                </div>

                {/* Role Status */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-sm">🛡️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Role</p>
                    <p className="text-sm font-bold text-[#1e5297] capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
