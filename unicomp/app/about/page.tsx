import Image from "next/image";
import Header from "@/components/global_components/header";
import Footer from "@/components/global_components/footer";
import Link from "next/link";
import Main from "./main";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/bg-network.png')] bg-cover bg-center">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
