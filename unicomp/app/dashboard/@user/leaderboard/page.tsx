import Image from "next/image";
import UserHeader from "@/components/local_components/userHeader";
import Footer from "@/components/global_components/footer";
import Link from "next/link";
import Main from "./main";

export default function Leaderboard() {
  return (
    <>
      <UserHeader />
      <Main />
      <Footer />
    </>
  );
}
