import { getAuthServerSession } from "~/server/auth";
import MainPageNavbar from "../(components)/Navbar";
import DashboardSidebar from "./(components)/DashboardSidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getAuthServerSession();

  if (!session) {
    redirect("/");
  }

  if (session.user.role.name !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <MainPageNavbar />

      <div className="mt-3 flex gap-2">
        <DashboardSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
