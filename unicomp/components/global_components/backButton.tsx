"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-white text-gray-400 hover:text-gray-600 p-2 rounded-full shadow-sm border border-gray-100 transition-colors mb-4 cursor-pointer flex items-center justify-center"
      title="Kembali"
    >
      <ArrowLeft size={16} />
    </button>
  );
}
