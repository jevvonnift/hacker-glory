"use client";

import {
  GaugeIcon,
  type LucideIcon,
  ScrollIcon,
  BarChart4Icon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "~/components/Avatar";
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
      <span className="absolute -top-16 left-1/2 hidden -translate-x-1/2 rounded-md border bg-white p-2 group-hover:block sm:static sm:inline sm:translate-x-0 sm:rounded-none sm:border-none sm:bg-inherit sm:p-0 ">
        {link.title}
      </span>
    </Link>
  );
};

const SidebarLinks = ({ links }: { links: Link[] }) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-row justify-center gap-4 sm:flex-col sm:gap-0">
      {links.map((link, idx) => {
        const isActive = pathname === link.href;

        return (
          <li
            className={cn(
              "rounded-full hover:bg-slate-100 sm:rounded-none",
              isActive && "bg-slate-100",
            )}
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
    href: "/dashboard/profile",
  },
];

const DashboardSidebar = () => {
  const { session } = useSession();

  return (
    <nav className="absolute bottom-0 left-0 w-full rounded-t-xl border bg-white  py-4 sm:static sm:w-[300px] sm:translate-x-0 sm:rounded-xl">
      <div className="hidden flex-col items-center justify-center gap-4 px-6 sm:flex">
        <Avatar
          src={session?.user.image ?? "/img/default-user"}
          alt="User Profile Image"
          className="h-[100px] w-[100px]"
        />
        <h2 className="text-lg">Haii, {session?.user.username}!</h2>
      </div>
      <div className="sm:mt-6">
        <SidebarLinks links={links} />
      </div>
    </nav>
  );
};

export default DashboardSidebar;
