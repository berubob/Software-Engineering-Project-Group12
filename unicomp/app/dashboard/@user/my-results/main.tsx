import Image from "next/image";

const Main = () => {
  // Misal nanti ada data, kamu bisa mapping di sini.
  // Untuk sekarang kita buat tampilan empty sesuai desain.
  const hasResults = false;

  return (
    <main className="min-h-screen bg-[#f8f9fa] px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">My Results</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your competition results. Keep going on your academic journey!</p>
      </div>

      {/* Results Card Container */}
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm p-10 md:p-20 min-h-[400px] flex flex-col items-center justify-center text-center">
        {!hasResults ? (
          <div className="max-w-md space-y-4">
            {/* Trophy Icon Circle */}
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-200" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-gray-800">No result published yet</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your competition results and rankings will appear here once they <br className="hidden md:block" />
              are published by the organizers. Please wait...
            </p>
          </div>
        ) : (
          <div>{/* Tampilan jika ada data nanti */}</div>
        )}
      </div>
    </main>
  );
};

export default Main;
