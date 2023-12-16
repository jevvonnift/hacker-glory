import { getAuthServerSession } from "~/server/auth";
import MainPageNavbar from "../(components)/Navbar";
import DashboardSidebar from "./(components)/DashboardSidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthServerSession();

  if (!session) {
    redirect("/");
  }

  if (!session.user.isAdmin) {
    redirect("/");
  }

  return (
    <div>
      <MainPageNavbar />

      <div className="relative mt-3 flex flex-col gap-4 sm:flex-row">
        <DashboardSidebar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
