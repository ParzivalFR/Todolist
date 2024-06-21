import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const Nav = () => {
  return (
    <nav className="max-w[1200px] w-full mx-auto h-20 flex items-center justify-between p-5 border-b border-gray-300">
      <div>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="w-14 h-14"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Nav;
