import Image from "next/image";
import Header from "@/components/global_components/header";
import Footer from "@/components/global_components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/bg-network.png')] bg-cover bg-center">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Teks Utama */}
        <div className="space-y-4 mb-10">
          <h1 className="text-[#0E5499] text-5xl md:text-6xl font-bold tracking-tight">Welcome to UniComp!</h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">A Campus Competition Hub</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
            Discover, participate, and excel in campus-wide competitions designed to challenge your thinking, skills and creativity. Whether you aim to learn, compete or achieve recognition, your
            journey to excellence starts here.
          </p>
        </div>

        {/* Tombol Join */}
        <div className="flex items-center w-full max-w-4xl px-4">
          <div className="flex-1 h-[1px] bg-gray-300"></div>

          <Link href="/auth/register" className="mx-6">
            <button className="bg-[#8cabd9] hover:bg-[#7a99c7] text-white font-bold py-3 px-16 rounded-full shadow-md transition-all transform hover:scale-105 active:scale-95 text-lg">
              Join Now
            </button>
          </Link>

          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
