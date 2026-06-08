import Footer from "@/components/global_components/footer";
import OrganizerHeader from "@/components/local_components/organizerHeader";
import Main from "./main";

export default function OrganizerDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <OrganizerHeader />
      <div className="flex-1">
        <Main />
      </div>
      <Footer />
    </div>
  );
}
