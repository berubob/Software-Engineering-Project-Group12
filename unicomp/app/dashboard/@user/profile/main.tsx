"use client";
import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/global_components/backButton";
import { Mail, GraduationCap, MapPin, ArrowLeft, Trophy } from "lucide-react";

export default function Main() {
  const router = useRouter();
  const skills = ["React", "Typescript", "Python", "Machine Learning", "UI/UX Design"];

  return (
    <main className="px-6 py-8 md:px-20 max-w-[1400px] w-full mx-auto font-sans">
      {/* --- BACK BUTTON & GREETING --- */}
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl font-extrabold text-[#1e3a8a] tracking-tight">Welcome Back</h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">Here lies your personal account information and overall achievement</p>
      </div>

      {/* --- LAYOUT GRID 3 KOLOM --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* KIRI: Profile Card & Achievement Card (Span 2 Kolom) */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Profile Bio Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            {/* Blue Header Banner */}
            <div className="h-28 bg-[#0b5394] w-full"></div>

            <div className="px-8 pb-8 relative">
              {/* Avatar Inisial */}
              <div className="w-24 h-24 rounded-2xl bg-[#cfe2f3] border-4 border-white text-[#1155cc] font-bold text-2xl flex items-center justify-center absolute -top-12 left-8 shadow-sm">JD</div>

              {/* Name & Edit Button Row */}
              <div className="pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">John Doer</h2>
                  <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mt-0.5">BINUS UNIVERSITY</p>
                </div>
                <button className="bg-[#f3f4f6] text-gray-600 hover:bg-gray-200 text-xs font-bold px-6 py-2.5 rounded-xl transition-colors">Edit Profile</button>
              </div>

              {/* About Me Section */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-700 text-sm mb-2">About Me</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-2xl font-medium">
                  Passionate about competitive programming and building impactful software solutions. Always looking for new challenges in hackathons and data science.
                </p>
              </div>

              {/* Metadata Row */}
              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400 font-semibold">
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-gray-400" />
                  <span>john.doer@binus.ac.id</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <GraduationCap size={16} className="text-gray-400" />
                  <span>Computer Science, 4th Semester</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. My Achievement Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="font-bold text-gray-700 text-base border-b border-gray-100 pb-4 mb-12">My Achievement</h3>

            {/* Empty State Tropy */}
            <div className="flex flex-col items-center justify-center text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center text-gray-300 mb-4">
                <Trophy size={28} />
              </div>
              <p className="text-xs font-medium text-gray-400 mb-6">You have no achievement yet</p>
              <button className="bg-[#89aae6] hover:bg-[#7397d3] text-white text-xs font-bold px-8 py-3 rounded-xl transition-colors shadow-sm">Find Competition</button>
            </div>
          </div>
        </div>

        {/* KANAN: Skills & Stats Sidebar */}
        <div className="space-y-6">
          {/* 1. Skills & Expertise */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-700 text-sm mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="bg-[#f8fafc] border border-gray-100 text-gray-700 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Total Competition Registered Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-700 text-sm">Total Competition Registered</h4>
            <p className="text-6xl font-black text-gray-800 mt-2 tracking-tight">3</p>
          </div>

          {/* 3. Total Competition Won Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-700 text-sm">Total Competition Won</h4>
            <p className="text-6xl font-black text-gray-800 mt-2 tracking-tight">0</p>
          </div>

          {/* 4. Action Apply Button */}
          <button className="w-full bg-[#89aae6] hover:bg-[#7397d3] text-white text-xs font-bold py-3.5 rounded-xl transition-colors shadow-sm">Apply as Organizer</button>
        </div>
      </div>
    </main>
  );
}
