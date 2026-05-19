import { Info } from "lucide-react";

const competitions = [
  {
    title: "UNTECH COMPETITION",
    organizer: "BNCC",
    daysLeft: "14 Days Remaining",
    progress: "5%",
    nextStep: "Proposal Submission",
  },
  {
    title: "VIBEZ CODING COMPETITION",
    organizer: "HIMTI",
    daysLeft: "4 Days Remaining",
    progress: "75%",
    nextStep: "Mid-Point Check-In",
  },
];

const Main = () => {
  return (
    <div className="bg-[#f8f9fa] min-h-screen px-6 py-10 md:px-20">
      {/* Title Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1e40af]">Active Competition</h1>
        <p className="text-gray-500 mt-2 text-sm">Here you can view all of your active competition. Make sure to complete all of it on time!</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competitions.map((comp, index) => (
          <div key={index} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
            {/* Top Row: Title & Badge */}
            <div className="flex justify-between items-start mb-1">
              <div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">{comp.title}</h2>
                <p className="text-[11px] text-gray-400 font-medium">By: {comp.organizer}</p>
              </div>
              <div className="bg-[#dbeafe] text-[#1e40af] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">{comp.daysLeft}</div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-50 my-6"></div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Progress</span>
                <span className="text-[10px] font-bold text-gray-400">{comp.progress}</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-50">
                {/* The Blue Fill */}
                <div className="bg-[#3b82f6] h-full rounded-full transition-all duration-700" style={{ width: comp.progress }}></div>
              </div>
            </div>

            {/* Bottom Row: Next Step */}
            <div className="flex items-center gap-2 text-gray-400 pt-1">
              <Info size={16} className="text-gray-400" />
              <div className="text-[11px] font-medium">
                Next Step: <span className="text-gray-500 font-semibold">{comp.nextStep}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
