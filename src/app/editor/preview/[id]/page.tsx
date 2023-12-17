import { redirect } from "next/navigation";
import { getAuthServerSession } from "~/server/auth";
import { api } from "~/trpc/server";
import AnnouncementPreview from "./(components)/AnnouncementPreview";

const PreviewAnnouncement = async ({ params }: { params: { id: string } }) => {
  const session = await getAuthServerSession();

  if (!session) redirect("/");
  if (!session.user.isAdmin) redirect("/");

  const announcement = await api.announcement.getById.query({
    id: params.id,
  });

  if (!announcement) redirect("/");
  if (announcement.isDraft) redirect("/");

  return (
    <div>
      <AnnouncementPreview announcement={announcement} />
    </div>
  );
};

export default PreviewAnnouncement;
