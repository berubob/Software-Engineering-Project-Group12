"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Search } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // State untuk form dan UI
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("userName", result.user.name);
          localStorage.setItem("userEmail", result.user.email);
        }

        alert("Login Berhasil!");
        router.push("/dashboard");
      } else {
        alert(result.message || "Email atau password salah.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row overflow-hidden">
      {/* Bagian Kiri: Form Login */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f3f4f6] px-8 py-6 md:px-20 lg:px-32">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-8 text-4xl font-extrabold text-[#000000]">UniComp</h1>

          <form className="space-y-5 text-left" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full rounded-xl border-none bg-[#d1d5db] px-6 py-4 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#8cabd9] transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full rounded-xl border-none bg-[#d1d5db] px-6 pr-14 py-4 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#8cabd9] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-400/50 transition-all outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 accent-[#8cabd9] cursor-pointer" />
                <span className="font-medium">Remember Me</span>
              </label>
              <Link href="#" className="font-medium hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full rounded-full py-4 text-xl font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer
                ${loading ? "bg-gray-400" : "bg-[#8cabd9] hover:bg-[#365D92]"}`}
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#f3f4f6] px-4 text-gray-500 font-medium italic">or sign in with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
              <button type="button" className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gray-400 bg-white transition-colors hover:bg-gray-50 cursor-pointer">
                <Image src="/google.svg" alt="Google" width={24} height={24} />
              </button>
              <span className="text-sm font-bold text-gray-600">Google</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button type="button" className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-gray-400 bg-white transition-colors hover:bg-gray-50 cursor-pointer">
                <Search size={24} className="text-gray-800" />
              </button>
              <span className="text-sm font-bold text-gray-600">SSO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Gambar & Prompt Register */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden md:flex">
        <div className="absolute inset-0">
          <Image src="/MountainBG.svg" alt="Academic Journey" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#1e40af]/30 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg px-8 text-center text-white">
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">Start your academic journey now!</h2>
          <p className="mt-8 text-lg lg:text-xl font-medium leading-relaxed opacity-90">If you don't have an account yet, join us and start your academic journey.</p>
          <Link
            href="/auth/register"
            className="mt-10 inline-block w-full max-w-xs rounded-full border-2 border-white py-4 text-xl lg:text-2xl font-bold transition-all hover:bg-white hover:text-[#1e40af]"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
