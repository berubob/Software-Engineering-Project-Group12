import Image from "next/image";
import Link from "next/link";
import Bell from "lucide-react";

export default function Main() {
  const stats = [
    {
      label: "Active Competition",
      value: 2,
      icon: "/Trophy.svg",
      color: "bg-orange-100",
      href: "/dashboard/active-competition",
    },
    {
      label: "Upcoming Deadlines",
      value: 1,
      icon: "/Clock.svg",
      color: "bg-red-100",
      href: "/dashboard/upcoming-deadlines",
    },
    {
      label: "New Notifications",
      value: 3,
      icon: "/Bell.svg",
      color: "bg-green-100",
      href: "/dashboard/new-notifications",
    },
  ];

  const registrations = [
    { name: "UNTECH COMPETITION", date: "Registered 07/04/2026 - End 21/04/2026" },
    { name: "VIBEZ CODING COMPETITION", date: "Registered 04/04/2026 - End 11/04/2026" },
    { name: "DATA SCIENTIST COMPETITION", date: "Registered 01/03/2026 - End 01/04/2026" },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20">
      {/* Header Title */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-[#1e40af]">Campus Competition Overview</div>
        <div className="text-gray-500 text-sm mt-1">This is your dashboard! Here you can view competition overview and information</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-gray-700 w-1/2 leading-tight">{stat.label}</div>
              <div className={`${stat.color} p-2 rounded-full`}>
                <Image src={stat.icon} width={24} height={24} alt="icon" />
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-5xl font-bold text-gray-800">{stat.value}</div>
              {/* HREF SEKARANG DINAMIS */}
              <Link href={stat.href} className="text-xs text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
                View Detail
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Registrations */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-gray-800">My Registrations</div>
            <Link href="/dashboard/my-registration" className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
              View All
            </Link>
          </div>
          <div className="space-y-6">
            {registrations.map((reg, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer px-2 -mx-2 rounded-lg">
                <div>
                  <div className="text-sm font-bold text-gray-800">{reg.name}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{reg.date}</div>
                </div>
                <div className="text-gray-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Results */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="font-bold text-gray-800">My Results</div>
            <Link href="/dashboard/my-results" className="text-xs font-semibold text-gray-400 cursor-pointer hover:text-blue-600 transition-all">
              View All
            </Link>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-10">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Image src="/Trophy.svg" width={20} height={20} alt="empty" className="opacity-100 grayscale brightness-120" />
            </div>
            <div className="text-gray-400 text-xs italic">No result published yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
