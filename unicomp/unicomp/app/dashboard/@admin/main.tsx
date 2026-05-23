"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, Trophy, FileText, ChevronDown } from "lucide-react";

export default function Main() {
  const [activeTab, setActiveTab] = useState("publish"); // State untuk kontrol tab

  const stats = [
    {
      label: "Pending Approval",
      value: 2,
      icon: Clock,
      iconColor: "text-[#FF5757]",
      bgColor: "bg-[#FEE2E2]",
      href: "/dashboard/pending-approval",
    },
    {
      label: "Active Competition",
      value: 5,
      icon: Trophy,
      iconColor: "text-[#FFB048]",
      bgColor: "bg-[#FEF3C7]",
      href: "/dashboard/active-competition",
    },
    {
      label: "Publish Result",
      value: 1,
      icon: FileText,
      iconColor: "text-[#4593DF]",
      bgColor: "bg-[#DBEAFE]",
      href: "/dashboard",
    },
  ];

  const winners = [
    { rank: 1, name: "Clement Ernest Atmadja", color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]" },
    { rank: 2, name: "Albert Christian Yang", color: "text-gray-400", bg: "bg-gray-100" },
    { rank: 3, name: "Vittorio Dinata", color: "text-[#D97706]", bg: "bg-[#FFEDD5]" },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Title */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#1e40af]">Admin Control Center</h1>
        <p className="text-gray-500 text-sm mt-1">This is admin dashboard! Manage and update competitions, results and campus communication all on this website</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-gray-700 w-1/2 leading-tight">{stat.label}</div>
              <div className={`${stat.bgColor} p-2.5 rounded-full`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-5xl font-bold text-gray-800">{stat.value}</div>
              <Link href={stat.href} className="text-xs text-gray-400 cursor-pointer hover:text-blue-600 transition-all font-medium">
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[500px]">
        {/* Tab Header */}
        <div className="flex gap-10 px-10 pt-8 border-b border-gray-50">
          <button
            onClick={() => setActiveTab("publish")}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === "publish" ? "text-[#8CABD9] border-b-4 border-[#8CABD9]" : "text-gray-300 hover:text-gray-400"}`}
          >
            Publish Result
          </button>
          <button
            onClick={() => setActiveTab("notification")}
            className={`pb-4 text-sm font-bold transition-all ${activeTab === "notification" ? "text-[#8CABD9] border-b-4 border-[#8CABD9]" : "text-gray-300 hover:text-gray-400"}`}
          >
            Send Notification
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-10">
          {activeTab === "publish" ? (
            /* Publish Result Content */
            <div className="max-w-md bg-[#F9FAFB] border border-gray-100 rounded-[2rem] p-8 shadow-inner">
              <div className="mb-6">
                <h3 className="text-base font-black text-gray-700 tracking-tight uppercase">DATA SCIENTIST COMPETITION</h3>
                <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-1 uppercase">By: DATA SCIENCE CLUB</p>
              </div>

              <div className="space-y-3 mb-8">
                {winners.map((winner) => (
                  <div key={winner.rank} className="bg-white border border-gray-50 px-5 py-3 rounded-xl flex items-center gap-4 shadow-sm">
                    <div className={`w-6 h-6 rounded-full ${winner.bg} ${winner.color} text-[10px] flex items-center justify-center font-black`}>{winner.rank}</div>
                    <div className="text-xs text-gray-500 font-bold">{winner.name}</div>
                  </div>
                ))}
              </div>

              <button className="w-full bg-[#8CABD9] hover:bg-[#7DA0D0] text-white text-xs font-extrabold py-4 rounded-2xl transition-all shadow-md active:scale-95">Publish Result</button>
            </div>
          ) : (
            /* Send Notification Content */
            <div className="max-w-full space-y-6">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Target Audience</label>
                <div className="relative">
                  <select className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 appearance-none outline-none focus:ring-1 focus:ring-blue-100">
                    <option>Vibez Coding Competition Participant</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              {/* Notification Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Notification Title</label>
                <input
                  type="text"
                  placeholder="Type your notification title here..."
                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Message Content</label>
                <textarea
                  rows={6}
                  placeholder="Type your announcement here..."
                  className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-500 outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <button className="px-16 bg-[#8CABD9] hover:bg-[#7DA0D0] text-white text-xs font-extrabold py-4 rounded-2xl transition-all shadow-md active:scale-95">Publish Notification</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
