"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, DollarSign, Link as LinkIcon, Layers, Plus, Loader2, X, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface ScheduleItem {
  event: string;
  date: string;
}

export default function Main() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [targetDraftId, setTargetDraftId] = useState<string | null>(null);

  // State Manajemen Form Terkontrol
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    startDate: "",
    endDate: "",
    prize: "",
    competitionType: "Online",
    registrationLink: "",
  });

  // State Dinamis untuk Rules & Guidelines
  const [rules, setRules] = useState<string[]>([""]);

  // State Dinamis untuk Timeline Schedule
  const [schedules, setSchedules] = useState<ScheduleItem[]>([{ event: "", date: "" }]);

  // Dropdown Options
  const categories = ["Hackathon", "Data Science", "Design", "Cybersecurity", "Technology", "Others"];
  const competitionTypes = ["Online", "Onsite", "Hybrid"];

  // EFFECT UNTUK MENANGKAP DATA DRAFT DARI SESSIONSTORAGE
  useEffect(() => {
    const savedDraftString = sessionStorage.getItem("selected_draft_data");

    if (savedDraftString) {
      try {
        const parsedDraft = JSON.parse(savedDraftString);
        setIsEditMode(true);
        setTargetDraftId(parsedDraft.competition_id);

        // 1. Ambil data teks/string biasa
        setFormData({
          title: parsedDraft.title || "",
          category: parsedDraft.category || "",
          description: parsedDraft.description || "",
          // Format ISO (2026-06-08T00:00:00.000Z) dipotong menjadi HTML date string (2026-06-08)
          startDate: parsedDraft.start_date ? parsedDraft.start_date.split("T")[0] : "",
          endDate: parsedDraft.end_date ? parsedDraft.end_date.split("T")[0] : "",
          prize: parsedDraft.prize || "",
          competitionType: parsedDraft.competition_type || "Online",
          registrationLink: parsedDraft.registration_link || "",
        });

        // 2. Membalikkan gabungan string ". " aturan kembali menjadi bentuk Array
        if (parsedDraft.rules_condition) {
          const splitRules = parsedDraft.rules_condition.split(". ").filter((r: string) => r.trim() !== "");
          setRules(splitRules.length > 0 ? splitRules : [""]);
        }

        // 3. Membalikkan skema Record<string, string> schedule backend menjadi Array [{event, date}]
        if (parsedDraft.schedule && typeof parsedDraft.schedule === "object") {
          const convertedSchedules = Object.entries(parsedDraft.schedule).map(([event, date]) => ({
            event,
            date: typeof date === "string" ? date.split("T")[0] : "",
          }));
          setSchedules(convertedSchedules.length > 0 ? convertedSchedules : [{ event: "", date: "" }]);
        }
      } catch (err) {
        console.error("Gagal mem-parsing data koordinat draft:", err);
      } finally {
        // Hapus jejak session memori agar form bersih kembali saat diakses manual nanti
        sessionStorage.removeItem("selected_draft_data");
      }
    }
  }, []);

  // Handler Perubahan Nilai Input Biasa & Select Dropdown
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler Rules
  const addRule = () => setRules([...rules, ""]);
  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };
  const removeRule = (index: number) => {
    if (rules.length > 1) {
      setRules(rules.filter((_, idx) => idx !== index));
    } else {
      setRules([""]);
    }
  };

  // Handler Schedules
  const addSchedule = () => setSchedules([...schedules, { event: "", date: "" }]);
  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };
  const removeSchedule = (index: number) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, idx) => idx !== index));
    } else {
      setSchedules([{ event: "", date: "" }]);
    }
  };

  // Main Submit Handler untuk POST / PUT data ke API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isDraftMode: boolean = false) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

      const apiScheduleObject: Record<string, string> = {};
      schedules.forEach((item) => {
        if (item.event.trim() && item.date) {
          apiScheduleObject[item.event.trim()] = item.date;
        }
      });

      const registrationClosedItem = schedules.find((s) => s.event.toLowerCase().includes("closed") || s.event.toLowerCase().includes("deadline"));
      const calculatedDeadline = registrationClosedItem ? registrationClosedItem.date : formData.endDate;

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        competition_type: formData.competitionType,
        schedule: apiScheduleObject,
        rules_condition: rules.filter((r) => r.trim() !== "").join(". "),
        deadline: calculatedDeadline,
        start_date: formData.startDate,
        end_date: formData.endDate,
        registration_link: formData.registrationLink,
        prize: formData.prize,
      };

      // Jika dalam mode edit draft, Anda bisa mengubah method menjadi PUT/PATCH sesuai endpoint backend Anda
      const targetUrl = isEditMode ? `${apiUrl}/competitions/${targetDraftId}` : `${apiUrl}/competitions`;
      const targetMethod = isEditMode ? "PUT" : "POST";

      const res = await fetch(targetUrl, {
        method: targetMethod,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menyimpan data kompetisi ke server.");
      }

      alert(isDraftMode ? "Berhasil menyimpan perubahan draft!" : isEditMode ? "Kompetisi berhasil diperbarui!" : "Kompetisi berhasil dibuat!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan internal backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] w-full overflow-x-hidden">
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none -z-10">
        <Image src="/NetworkBG.svg" alt="Create Competition Background" fill className="object-cover object-center" priority />
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 md:px-12 py-10 font-sans">
        <button
          onClick={() => router.back()}
          type="button"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1e5297] hover:bg-gray-50 transition-colors mb-6 cursor-pointer outline-none"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#1e5297] tracking-tight">{isEditMode ? "Continue Editing Draft" : "Create Competition"}</h1>
          <p className="text-gray-400 text-xs font-semibold mt-2">Here you can make your own competition. Make sure to give out all of the necessary information and criteria</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">
                Competition Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter your competition name..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="" disabled hidden>
                    Select your category...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-focus-within:rotate-180 duration-200" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="What's the competition about? Explain it here..."
              className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl px-5 py-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 block">Rules & Guidelines</label>
            <div className="bg-gray-100/70 border border-gray-200/50 rounded-2xl p-5 space-y-3">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <span className="text-xs font-bold text-gray-400 min-w-[15px]">{idx + 1}.</span>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(idx, e.target.value)}
                    placeholder={idx === 0 ? "Write your competition rules & guidelines..." : "Add more guidelines..."}
                    className="w-full bg-transparent border-none text-sm placeholder-gray-400 focus:outline-none"
                  />
                  <button type="button" onClick={() => removeRule(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md outline-none cursor-pointer" title="Delete rule">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addRule} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors mt-2 cursor-pointer outline-none">
                <Plus size={14} /> Add more...
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 block">Schedule</label>
            <div className="bg-gray-100/70 border border-gray-200/50 rounded-2xl p-5 space-y-4">
              {schedules.map((sched, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 border-b border-gray-200/50 pb-4 md:pb-0 md:border-none last:border-none last:pb-0 group relative">
                  <input
                    type="text"
                    value={sched.event}
                    onChange={(e) => handleScheduleChange(idx, "event", e.target.value)}
                    placeholder="Write your competition activity (e.g., Registration Open)..."
                    className="w-full md:flex-1 bg-transparent border-none text-sm placeholder-gray-400 focus:outline-none py-1 font-medium"
                  />

                  <div className="flex gap-2 w-full md:w-auto justify-end items-center">
                    <div className="flex items-center gap-2 bg-white/80 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm text-xs font-medium text-gray-500 focus-within:ring-2 focus-within:ring-[#8cabd9]/50 transition-all">
                      <Calendar size={14} className="text-gray-400" />
                      <input
                        type="date"
                        value={sched.date}
                        onChange={(e) => handleScheduleChange(idx, "date", e.target.value)}
                        required={!!sched.event}
                        className="bg-transparent focus:outline-none text-gray-700 font-sans cursor-pointer accent-[#8cabd9]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSchedule(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-md outline-none cursor-pointer ml-1"
                      title="Delete schedule"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addSchedule} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors mt-1 cursor-pointer outline-none">
                <Plus size={14} /> Add more...
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all text-gray-700 accent-[#8cabd9]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={formData.startDate}
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all text-gray-700 accent-[#8cabd9]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">Competition Prize</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="prize"
                  value={formData.prize}
                  onChange={handleInputChange}
                  placeholder="Rp..."
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400">
                Competition Type <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <select
                  name="competitionType"
                  value={formData.competitionType}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-12 py-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all text-gray-700 appearance-none cursor-pointer"
                >
                  {competitionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform group-focus-within:rotate-180 duration-200" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400">
              Registration Link <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="url"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={handleInputChange}
                required
                placeholder="Enter your URL..."
                className="w-full bg-gray-100/70 border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-#8cabd9/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e as any, true)}
              className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-500 shadow-sm transition-all cursor-pointer outline-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isEditMode ? "Update Draft" : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#8cabd9] hover:bg-[#365D92] text-white rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer outline-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEditMode ? "Publish Competition" : "Create Competition"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
