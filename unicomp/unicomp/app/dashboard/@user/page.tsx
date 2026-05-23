import Image from "next/image";
import UserHeader from "@/components/local_components/userHeader";
import Footer from "@/components/global_components/footer";
import Link from "next/link";
import Main from "@/app/dashboard/@user/main";

export default function UserDashboard() {
  return (
    <>
      <UserHeader />
      <Main />
      <Footer />
    </>
  );
}
