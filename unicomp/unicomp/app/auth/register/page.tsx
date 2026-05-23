"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "participant",
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      return alert("Please fill in all fields!");
    }
    if (!formData.agree) {
      return alert("You must agree to the terms!");
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        router.push("/auth/login");
      } else {
        alert(result.message || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error, try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image src="/MountainBG.svg" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <Link href="/auth/login" className="absolute top-6 left-6 text-white hover:scale-110 transition-transform z-20">
        <ArrowLeft size={32} />
      </Link>

      {/* Registration Card */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-[2.5rem] shadow-2xl z-10 p-8 md:p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Create Account</h1>
          <p className="mt-2 text-gray-500 font-medium text-sm md:text-base">Join the campus competition community</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border-none bg-gray-200 px-6 py-3.5 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#8cabd9] transition-all"
          />

          {/* Email */}
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border-none bg-gray-200 px-6 py-3.5 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#8cabd9] transition-all"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl border-none bg-gray-200 px-6 py-3.5 pr-14 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#8cabd9] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-500 hover:bg-gray-300/50 transition-all cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Agreement Checkbox - Compact Version */}
          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              checked={formData.agree} // Hubungkan ke state
              onChange={handleChange} // Hubungkan ke state
              className="mt-1 h-4 w-4 rounded border-gray-300 accent-[#8cabd9] cursor-pointer"
            />
            <label htmlFor="agree" className="text-xs md:text-sm text-gray-600 pt-[0.15rem] leading-tight cursor-pointer">
              I agree to the{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-full py-3.5 text-lg font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer 
            ${loading ? "bg-gray-400" : "bg-[#8cabd9] hover:bg-[#365D92]"}`}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
