"use client";

import Button from "~/components/Button";
import Link from "next/link";
import useSession from "~/hooks/useSession";
import Logo from "~/components/Logo";
import UserDropdown from "~/components/user/UserDropdown";
import { BookmarkIcon } from "lucide-react";

const MainPageNavbar = () => {
  const { session } = useSession();

  return (
    <nav className="sticky top-0 flex items-center justify-between">
      <Logo />
      <div className="flex gap-2">
        {session ? (
          <div className="flex gap-2">
            <Button className="flex rounded-full p-3">
              <BookmarkIcon strokeWidth={1.2} />
            </Button>
            <UserDropdown />
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button className="rounded-full px-5 py-3 transition-all hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="hidden rounded-full px-5 py-3 transition-all hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white sm:block">
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
