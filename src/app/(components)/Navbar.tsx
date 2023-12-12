"use client";

import Button from "~/components/Button";
import Link from "next/link";
import useSession from "~/hooks/useSession";
import LogoutButton from "./LogoutButton";
import Logo from "~/components/Logo";

const MainPageNavbar = () => {
  const { session } = useSession();

  return (
    <nav className="sticky top-0 flex items-center justify-between">
      <Logo />
      <div className="flex gap-2">
        {session ? (
          <LogoutButton />
        ) : (
          <>
            <Link href="/login">
              <Button className="rounded-full px-6 transition-all hover:bg-slate-500 hover:text-white">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 transition-all hover:bg-slate-500 hover:text-white">
                Daftar
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default MainPageNavbar;
