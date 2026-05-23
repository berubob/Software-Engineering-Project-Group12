import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white py-4">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image src="/UniComp Logo.svg" width={32} height={32} alt="UniComp Logo" />
            <span className="font-semibold text-[#000000]">UniComp</span>
          </div>
        </Link>

        <div className="text-sm text-center text-[#000000]/60">© {new Date().getFullYear()} CampusCompete. All rights reserved. Built for student excellence</div>

        <div className="flex gap-4 text-[#000000]/50">
          <Link href="/privacy" className="hover:text-[#000000]/80">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-[#000000]/80">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-[#000000]/80">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
