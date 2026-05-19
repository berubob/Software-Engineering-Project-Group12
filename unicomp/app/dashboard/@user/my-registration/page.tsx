import Image from "next/image";
import UserHeader from "@/components/local_components/userHeader";
import Footer from "@/components/global_components/footer";
import Link from "next/link";
import Main from "./main";

const Dashboard = () => {
  return (
    <>
      <UserHeader />
      <Main />
      <Footer />
    </>
  );
};

export default Dashboard;
