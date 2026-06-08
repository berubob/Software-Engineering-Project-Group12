import Image from "next/image";
import Footer from "@/components/global_components/footer";
import Link from "next/link";
import Main from "./main";
import AdminHeader from "@/components/local_components/adminHeader";

export default function Notifications() {
  return (
    <>
      <AdminHeader />
      <Main />
      <Footer />
    </>
  );
}
