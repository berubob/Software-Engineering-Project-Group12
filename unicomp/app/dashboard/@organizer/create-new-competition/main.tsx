"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, DollarSign, Users, Link as LinkIcon, Image as ImageIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter();

  // State untuk menangani dynamic list (Rules & Schedule)
  const [rules, setRules] = useState<string[]>([""]);
  const [schedules, setSchedules] = useState<{ activity: string; time: string; date: string }[]>([{ activity: "", time: "", date: "" }]);

  // Handler menambah baris Rules
  const addRule = () => setRules([...rules, ""]);
  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  // Handler menambah baris Schedule
  const addSchedule = () => setSchedules([...schedules, { activity: "", time: "", date: "" }]);
  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...schedules] as any;
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
      {/* BACKGROUND IMAGE OVERLAY */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Create Competition Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 md:px-12 py-10 font-sans">
        {/* Tombol Back Lingkaran Putih */}
        <button
          onClick={() => router.back()}
          type="button"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1e5297] hover:bg-gray-50 transition-colors mb-6 cursor-pointer outline-none"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1e5297] tracking-tight">Create Competition</h1>
          <p className="text-gray-400 text-xs font-semibold mt-2">Here you can make your own competition. Make sure to give out all of the necessary information and criteria</p>
        </div>

        {/* FORM CONTAINER */}
        <form className="space-y-8 text-gray-700">
          {/* Row 1: Competition Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Competition Name</label>
              <input
                type="text"
                placeholder="Enter your competition name..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Category</label>
              <input
                type="text"
                placeholder="Enter your competition category..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
              />
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Description</label>
            <textarea
              rows={5}
              placeholder="What's the competition about? Explain it here..."
              className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all resize-none"
            />
          </div>

          {/* Row 3: Rules & Guidelines (Dynamic List) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 block">Rules & Guidelines</label>
            <div className="bg-gray-100/70 border border-gray-200/50 rounded-2xl p-5 space-y-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 min-w-[15px]">{idx + 1}.</span>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(idx, e.target.value)}
                    placeholder={idx === 0 ? "Write your competition rules & guidelines..." : "Add more guidelines..."}
                    className="w-full bg-transparent border-none text-sm placeholder-gray-400 focus:outline-none"
                  />
                </div>
              ))}
              <button type="button" onClick={addRule} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors mt-2 cursor-pointer outline-none">
                <Plus size={14} /> Add more...
              </button>
            </div>
          </div>

          {/* Row 4: Schedule (Dynamic Rows) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 block">Schedule</label>
            <div className="bg-gray-100/70 border border-gray-200/50 rounded-2xl p-5 space-y-4">
              {schedules.map((sched, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 border-b border-gray-200/50 pb-4 md:pb-0 md:border-none last:border-none last:pb-0">
                  <input
                    type="text"
                    value={sched.activity}
                    onChange={(e) => handleScheduleChange(idx, "activity", e.target.value)}
                    placeholder="Write your competition activity..."
                    className="w-full md:flex-1 bg-transparent border-none text-sm placeholder-gray-400 focus:outline-none py-1"
                  />

                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    {/* Time Picker */}
                    <div className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-gray-500">
                      <Clock size={14} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder="Time"
                        value={sched.time}
                        onChange={(e) => handleScheduleChange(idx, "time", e.target.value)}
                        className="w-12 bg-transparent text-center focus:outline-none"
                      />
                    </div>
                    {/* Date Picker */}
                    <div className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={sched.date}
                        onChange={(e) => handleScheduleChange(idx, "date", e.target.value)}
                        className="w-20 bg-transparent text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addSchedule} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors mt-1 cursor-pointer outline-none">
                <Plus size={14} /> Add more...
              </button>
            </div>
          </div>

          {/* Row 5: Tiga Kolom (Period, Prize, Participant) */}
          {/* Menggunakan `mb-8` agar baris tiga kolom ini memberikan jarak vertikal ekstra ke form di bawahnya */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Competition Period</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="dd/mm/yyyy - dd/mm/yyyy"
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Competition Prize</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rp..."
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Maximum Participant</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Max..."
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 6: Cover Image URL */}
          {/* Ditambahkan `pt-2` atau otomatis terpisah berkat space-y-8 pada form */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Cover Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="url"
                placeholder="Enter your URL..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
              />
            </div>
          </div>

          {/* Row 7: Registration Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">Registration Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="url"
                placeholder="Enter your URL..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8cabd9]/50 transition-all"
              />
            </div>
          </div>

          {/* ACTION BUTTONS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <button
              type="button"
              className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 shadow-sm transition-all cursor-pointer outline-none"
            >
              Save as Draft
            </button>
            <button type="submit" className="w-full py-4 bg-[#8cabd9] hover:bg-[#365D92] text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer outline-none">
              Create Competition
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
