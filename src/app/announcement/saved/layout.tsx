import { redirect } from "next/navigation";
import React from "react";
import BottomNavbar from "~/app/(components)/BottomNavbar";
import MainPageNavbar from "~/app/(components)/Navbar";
import { getAuthServerSession } from "~/server/auth";

const ListMyAnnouncementLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getAuthServerSession();

  if (!session) return redirect("/");

  return (
    <main className="relative">
      <MainPageNavbar />
      <div className="mt-4">{children}</div>
      <BottomNavbar />
    </main>
  );
};

export default ListMyAnnouncementLayout;
