"use client";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children, admin, user, organizer }: { children: React.ReactNode; admin: React.ReactNode; user: React.ReactNode; organizer: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    setRole(savedRole || "participant"); // Jika null, default ke "user"
  }, []);

  if (role === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  let slotToRender;

  switch (role) {
    case "admin":
      slotToRender = <div>{admin}</div>;
      break;
    case "organizer":
      slotToRender = <div>{organizer}</div>;
      break;
    default:
      slotToRender = <div>{user}</div>;
      break;
  }

  return <div>{slotToRender}</div>;
}
