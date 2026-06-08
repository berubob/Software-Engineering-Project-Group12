"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#8cabd9]/90 backdrop-blur-sm py-5 text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer group">
              {/* Ukuran Image */}
              <div className="relative w-[45px] h-[45px]">
                <Image src="/UniComp Logo.svg" fill alt="UniComp Logo" className="object-contain" />
              </div>
              <span className="font-extrabold text-3xl text-[#1e40af] tracking-tighter group-hover:opacity-80 transition-opacity">UniComp</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              href="/about"
              className="relative text-[#1e40af] font-bold text-lg hover:text-[#0E5499] transition-colors py-1 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-[#0E5499] after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              About Us
            </Link>

            <Link href="/auth/login">
              <button className="bg-white text-[#1e40af] font-black py-2.5 px-10 rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 border border-white cursor-pointer text-sm uppercase tracking-wide">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#1e40af] hover:opacity-80 transition-opacity p-1">
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col items-center justify-center gap-6 border-t border-[#1e40af]/10 pt-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="font-bold text-[#1e40af] text-xl hover:underline decoration-2 underline-offset-4 transition-all">
              About Us
            </Link>

            <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="w-full max-w-xs">
              <button className="w-full bg-white text-[#1e40af] font-black py-4 rounded-full shadow-sm active:scale-98 border border-white text-sm tracking-widest uppercase">Login</button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
