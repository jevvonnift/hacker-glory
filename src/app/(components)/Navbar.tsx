"use client";

import Button from "~/components/Button";
import Link from "next/link";
import useSession from "~/hooks/useSession";
import Logo from "~/components/Logo";
import UserDropdown from "~/components/user/UserDropdown";
import { BookmarkIcon } from "lucide-react";
import RequestAnnouncementDropdown from "~/components/announcement/RequestAnnouncementDropdown";

const MainPageNavbar = () => {
  const { session } = useSession();

  return (
    <nav className=" sticky z-40 flex items-center justify-between border-b bg-slate-100 pb-2">
      <Logo />
      <div className="flex items-center gap-2">
        {session ? (
          <div className="flex items-center gap-2">
            <Link href="/announcement/saved">
              <Button className="flex rounded-full p-2">
                <BookmarkIcon strokeWidth={1.2} />
              </Button>
            </Link>
            {session.user.isAdmin && <RequestAnnouncementDropdown />}
            <UserDropdown />
          </div>
        ) : (
          <>
            <Link href="/login">
              <Button className="rounded-full px-4 py-2 transition-all hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button className="hidden rounded-full px-4 py-2 transition-all hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white sm:block">
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
