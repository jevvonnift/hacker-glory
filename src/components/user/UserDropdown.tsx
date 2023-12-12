"use client";

import Image from "next/image";
import useSession from "~/hooks/useSession";
import Button from "../Button";
import { useState } from "react";
import Link from "next/link";
import useLogout from "~/hooks/useLogout";
import { GaugeIcon, LogOutIcon, UserIcon } from "lucide-react";

const UserDropdown = () => {
  const { session } = useSession();
  const { logout, isLoading: isLoadingLogout } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);

  return session ? (
    <div className="relative">
      <Button
        className="flex items-center justify-center gap-2 rounded-full p-2 sm:px-4"
        onClick={() => setShowDropdown((s) => !s)}
      >
        <Image
          src={session.user.image}
          alt="User Profile Image"
          width={30}
          height={30}
        />
        <span className="hidden  sm:block">{session.user.username}</span>
      </Button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 flex-col gap-2 rounded-xl border bg-white p-4 transition-all"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="flex flex-col gap-2">
            <Link
              className="flex gap-2 rounded-md px-4 py-2 text-center hover:bg-slate-100"
              href="/"
            >
              <GaugeIcon strokeWidth={1} /> <span>Dashboard</span>
            </Link>
            <Link
              className="flex gap-2 rounded-md px-4 py-2 text-center hover:bg-slate-100"
              href="/"
            >
              <UserIcon strokeWidth={1} /> <span>Profil</span>
            </Link>
            <button
              disabled={isLoadingLogout}
              onClick={logout}
              className="flex gap-2 rounded-md px-4 py-2 text-center hover:bg-slate-100 disabled:opacity-50 hover:disabled:bg-white"
            >
              <LogOutIcon strokeWidth={1} /> <span>Keluar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default UserDropdown;
