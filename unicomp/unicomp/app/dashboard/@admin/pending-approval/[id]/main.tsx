"use client";
import { useParams } from "next/navigation";

export default function Main() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20 font-sans">
      {/* Header Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1e40af]">Pending Approval</h1>
        <p className="text-gray-400 text-sm mt-1">Here is all of competition that has not been approved yet</p>
      </div>

      {/* Card Utama */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden max-w-4xl mx-auto">
        {/* Banner Biru (Header Card) */}
        <div className="bg-[#1e40af] p-12 relative">
          <div className="absolute top-6 right-8 bg-white text-[#1e40af] px-4 py-1 rounded-lg text-[10px] font-black uppercase">Others</div>
          <h2 className="text-4xl font-black text-white tracking-tight">ASYNCO COMPETITION</h2>
        </div>

        {/* Content Section */}
        <div className="p-12 space-y-8">
          {/* Description */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Asynco Competition is a flexible, fully asynchronous competition designed to challenge participants...</p>
          </section>

          {/* Rules */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3">Rules & Guidelines</h3>
            <ul className="list-disc list-outside ml-5 text-gray-400 text-sm space-y-2">
              <li>All submissions must be original...</li>
              <li>Participants must submit all required files...</li>
            </ul>
          </section>

          {/* Schedule Table */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-3">Schedule</h3>
            <div className="bg-[#F9FAFB] rounded-2xl p-6 space-y-4 border border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">Competition Brief Release</span>
                <span className="text-gray-400">May 20, 08:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-bold">First-point Check-in</span>
                <span className="text-gray-400">May 23, 23:59</span>
              </div>
            </div>
          </section>

          {/* Approve Button */}
          <div className="pt-6">
            <button className="w-full bg-[#8CABD9] hover:bg-[#1e40af] text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-[0.98]">Approve Competition</button>
          </div>
        </div>
      </div>
    </div>
  );
}
