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
              <Button className="px-4">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="px-4">Daftar</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default MainPageNavbar;
