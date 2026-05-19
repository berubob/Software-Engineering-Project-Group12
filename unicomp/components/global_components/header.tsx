"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserCircle, Settings, LogOut, User, Bell, Menu, X } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#8cabd9] py-4 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <Image src="/UniComp Logo.svg" width={24} height={24} alt="UniComp Logo" />
              <span className="font-extrabold text-2xl text-[#1e40af] tracking-tight group-hover:opacity-80 transition-opacity">UniComp</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
