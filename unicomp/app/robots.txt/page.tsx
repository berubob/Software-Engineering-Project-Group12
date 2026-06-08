import React from "react";

export default function RobotsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] font-mono p-8 md:p-20">
      <div className="max-w-2xl">
        <h1 className="text-sm text-gray-500 mb-6">/robots.txt</h1>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
          {`User-agent: *
Allow: /
Disallow: /rahasiabangetlohyah

# Selamat karena telah menemukan easter egg pertama 😏
# Sekarang silakan berdiri dan panggil seseorang yang bernama "Clement Ernest Atmadja" dan ambil hadiahnya dari dia.
Btw, ada easter egg lagi loh 😀
 `}
          <span className="text-[#121212]">Coba akses /rahasiabangetlohyah 🫠 (Khusus Admin yah)</span>
        </pre>
        <div className="mt-10 text-[10px] text-gray-600">--- end of file ---</div>
      </div>
    </div>
  );
}
