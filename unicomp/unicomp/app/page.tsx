import Image from "next/image";
import Header from "@/components/global_components/header";
import Footer from "@/components/global_components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/bg-network.png')] bg-cover bg-center">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        <div className="space-y-4">
          <h1 className="text-center text-6xl font-bold text-[#0E5499] max-w-4xl mx-auto leading-tight">Campus Competition Hub</h1>
          <p className="text-center text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Discover, participate, and excel in campus-wide competitions. <br />
            Your journey to excellence starts here.
          </p>
        </div>

        <Link href="/auth/register">
          <button className="bg-[#8cabd9] hover:bg-[#7a99c7] text-white font-bold py-4 px-20 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95">Join Now</button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}
