// app/dashboard/layout.tsx
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
  admin, // Ini merujuk ke folder @admin
  user, // Ini merujuk ke folder @user
  organizer,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
  organizer: React.ReactNode;
}) {
  const role = (await cookies()).get("user_role")?.value;

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
