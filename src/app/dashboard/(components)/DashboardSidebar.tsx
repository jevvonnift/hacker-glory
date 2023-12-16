"use client";

import {
  GaugeIcon,
  type LucideIcon,
  ScrollIcon,
  BarChart4Icon,
  UsersIcon,
  MenuIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBoolean } from "usehooks-ts";
import Avatar from "~/components/Avatar";
import Button from "~/components/Button";
import useSession from "~/hooks/useSession";
import { cn } from "~/lib/utils";

type Link = {
  title: string;
  icon: LucideIcon;
  href: string;
};

const SidebarLink = ({ link }: { link: Link }) => {
  return (
    <Link
      className="group relative flex w-full items-center gap-2 px-4 py-4 text-center"
      href={link.href}
    >
      <link.icon strokeWidth={1} size={30} />{" "}
      <span className="static inline  border border-none bg-inherit group-hover:block ">
        {link.title}
      </span>
    </Link>
  );
};

const SidebarLinks = ({ links }: { links: Link[] }) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col  justify-center gap-0">
      {links.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <li
            className={cn("hover:bg-slate-100", isActive && "bg-slate-100")}
            key={idx}
          >
            <SidebarLink link={link} />
          </li>
        );
      })}
    </ul>
  );
};

const links: Link[] = [
  { title: "Dashboard", icon: GaugeIcon, href: "/dashboard" },
  {
    title: "Pengumuman",
    icon: ScrollIcon,
    href: "/dashboard/profile",
  },
  {
    title: "Kunjungan",
    icon: BarChart4Icon,
    href: "/dashboard/profile",
  },
  {
    title: "Pengguna",
    icon: UsersIcon,
    href: "/dashboard/users",
  },
];

const DashboardSidebar = () => {
  const { session } = useSession();
  const { value: isDropdownOpen, toggle: toggleDropdown } = useBoolean();

  return (
    <div>
      <Button
        className="mt-3 block rounded-full p-2 md:hidden"
        onClick={toggleDropdown}
      >
        <MenuIcon strokeWidth={1.2} />
      </Button>

      <nav
        className={cn(
          "absolute top-0 z-30 mt-2 w-[300px] -translate-x-[316px] rounded-xl rounded-t-xl border bg-white py-4 transition-all md:sticky md:top-2 md:mt-0 md:translate-x-0",
          isDropdownOpen && "translate-x-0",
        )}
      >
        <Button
          className="absolute right-2 top-0 mt-3 block rounded-full p-2 md:hidden"
          onClick={toggleDropdown}
        >
          <MenuIcon strokeWidth={1.2} />
        </Button>

        <div className="flex flex-col items-center justify-center gap-4 px-6">
          <Avatar
            src={session?.user.image ?? "/img/default-user.png"}
            alt="User Profile Image"
            className="h-[100px] w-[100px]"
          />
          <h2 className="text-lg">Haii, {session?.user.username}!</h2>
        </div>
        <div className="mt-6">
          <SidebarLinks links={links} />
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
