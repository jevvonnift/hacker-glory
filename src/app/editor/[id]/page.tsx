import { redirect } from "next/navigation";
import { getAuthServerSession } from "~/server/auth";
import { api } from "~/trpc/server";
import AnnoucementEditor from "./(components)/AnnouncementEditor";

const EditorAnnouncement = async ({ params }: { params: { id: string } }) => {
  const session = await getAuthServerSession();

  if (!session) redirect("/");
  if (session.user.role.name === "SISWA") redirect("/");

  const announcement = await api.announcement.getById.query({
    id: params.id,
  });

  if (!announcement) redirect("/");
  if (announcement.author.id !== session.user.id) redirect("/");

  return (
    <div>
      <AnnoucementEditor announcement={announcement} />
    </div>
  );
};

export default EditorAnnouncement;
