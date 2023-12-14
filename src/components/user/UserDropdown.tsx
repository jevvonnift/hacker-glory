"use client";

import useSession from "~/hooks/useSession";
import Button from "../Button";
import { useState } from "react";
import Link from "next/link";
import useLogout from "~/hooks/useLogout";
import { GaugeIcon, LogOutIcon, UserIcon } from "lucide-react";
import Avatar from "../Avatar";
import { AnimatePresence, motion } from "framer-motion";

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
        <Avatar
          src={session?.user.image ?? "/img/default-user"}
          alt="User Profile Image"
          className="h-[30px] w-[30px]"
        />
        <span className="hidden sm:block">{session.user.username}</span>
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 z-10 mt-2 flex-col gap-2 rounded-xl border bg-white p-4 transition-all"
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex w-[150px] flex-col gap-2">
              {session && session.user.isAdmin && (
                <Link
                  className="flex gap-2 rounded-md px-4 py-2 text-center hover:bg-slate-100"
                  href="/dashboard"
                >
                  <GaugeIcon strokeWidth={1} /> <span>Dashboard</span>
                </Link>
              )}
              <Link
                className="flex gap-2 rounded-md px-4 py-2 text-center hover:bg-slate-100"
                href="/profile"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <></>
  );
};

export default UserDropdown;
