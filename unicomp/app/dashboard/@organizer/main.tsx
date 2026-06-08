"use client";
import React, { useState, useEffect } from "react";
import { Trophy, Clock, Loader2, Scroll } from "lucide-react";
import Link from "next/link";

export default function Main() {
  const [publishedCount, setPublishedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [draftCount, setDraftCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerStats = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

        if (!token || !apiUrl) return;

        const userRes = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        const userId = userData.user_id;

        const [compRes, submissionsRes] = await Promise.all([
          fetch(`${apiUrl}/competitions`),
          fetch(`${apiUrl}/competitions/organizer/submissions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (compRes.ok) {
          const competitions = await compRes.json();
          const myPublishedComps = competitions.filter((comp: any) => comp.organizer_id === userId && comp.status === "accepted");
          setPublishedCount(myPublishedComps.length);
        }

        if (submissionsRes.ok) {
          const submissionData = await submissionsRes.json();
          setDraftCount(submissionData.draft?.count || 0);
          setPendingCount(submissionData.pending?.count || 0);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizerStats();
  }, []); // PERBAIKAN: Mengosongkan dependency array agar tidak memicu error scope

  const stats = [
    {
      title: "Published",
      count: publishedCount,
      icon: <Trophy className="text-[#f59e0b] w-5 h-5" />,
      iconBg: "bg-[#fef3c7]",
      link: "/dashboard/published",
    },
    {
      title: "Pending Approval",
      count: pendingCount,
      icon: <Clock className="text-[#ef4444] w-5 h-5" />,
      iconBg: "bg-[#fee2e2]",
      link: "/dashboard/pending-approval",
    },
    {
      title: "Draft",
      count: draftCount,
      icon: <Scroll className="text-[#3b82f6] w-5 h-5" />,
      iconBg: "bg-[#dbeafe]",
      link: "/dashboard/draft",
    },
  ];

  return (
    <main className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 font-sans">
      {/* Dashboard Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#1e5297] tracking-tight">Organizer Workshop</h1>
        <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">This is organizer dashboard! Manage and update your own competition all on this website</p>
      </div>

      {/* Grid Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-40 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="text-gray-400 font-bold text-sm tracking-tight uppercase">{stat.title}</span>
              <div className={`p-2.5 rounded-full ${stat.iconBg} flex items-center justify-center`}>{stat.icon}</div>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div className="h-12 flex items-center">
                {isLoading ? <Loader2 className="animate-spin text-gray-300 w-8 h-8" /> : <span className="text-5xl font-black text-gray-800 tracking-tighter">{stat.count}</span>}
              </div>

              <Link href={stat.link}>
                <button className="text-xs font-bold text-gray-400 hover:text-[#1e5297] transition-colors outline-none cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50">View Detail</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Create Competition */}
      <div className="w-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-700 tracking-tight">Create Competition</h2>
          <p className="text-gray-400 text-sm mt-2 font-medium">
            Make new competition and publish all on this website!
            <br />
            Make sure to give all of the valid and necessary information!
          </p>
        </div>
        <Link href="/dashboard/create-new-competition">
          <button className="bg-[#8cabd9] hover:bg-[#365D92] text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-sm whitespace-nowrap transition-colors cursor-pointer outline-none">
            Create New Competition
          </button>
        </Link>
      </div>
    </main>
  );
}
