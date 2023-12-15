import { redirect } from "next/navigation";
import { getAuthServerSession } from "~/server/auth";

const EditorPageLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getAuthServerSession();

  if (!session) {
    redirect("/");
  }

  if (session.user.role.name === "SISWA") {
    redirect("/");
  }

  return <>{children}</>;
};

export default EditorPageLayout;
