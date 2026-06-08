import Image from "next/image";

export default function Main() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/bg-network.png')] bg-cover bg-center">
      <main className="flex-1 flex flex-col items-center py-16 px-6 text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-[#0E5499] text-5xl md:text-6xl font-bold tracking-tight mb-4">Welcome to UniComp!</h1>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">A Campus Competition Hub</h2>

          {/* Divider Horizontal */}
          <div className="w-full max-w-2xl mx-auto h-[1px] bg-gray-300"></div>
        </div>

        {/* About Us Card Section */}
        <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 md:p-16 text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-6">About Us</h3>

          {/* Garis pemisah */}
          <div className="w-full h-[1px] bg-gray-100 mb-8"></div>

          <p className="text-gray-600 leading-relaxed text-base md:text-lg text-justify font-medium">
            We are a platform dedicated to empowering students through campus-wide competitions that inspire innovation, creativity, and growth. Our mission is to provide opportunities for students to
            discover their potential, participate in meaningful challenges, and excel beyond the classroom. Whether you are looking to sharpen your skills, gain new experiences, collaborate with
            others, or earn recognition for your achievements, we are here to support your journey every step of the way. Through engaging competitions and a passionate community, we believe every
            student has the chance to grow, achieve, and turn their ambitions into excellence.
          </p>
        </div>
      </main>
    </div>
  );
}
