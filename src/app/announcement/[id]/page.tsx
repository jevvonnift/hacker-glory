import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import AnnouncementDetail from "./(components)/AnnouncementDetail";
import MainPageNavbar from "~/app/(components)/Navbar";
import BottomNavbar from "~/app/(components)/BottomNavbar";

const AnnouncementDetailPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const announcement = await api.announcement.getDetailAnnouncement.query({
    id: params.id,
  });

  if (!announcement) redirect("/");
  if (announcement.isDraft) redirect("/");
  if (!announcement.publishedAt) redirect("/");
  if (announcement.publishedAt > new Date()) redirect("/");

  return (
    <div>
      <MainPageNavbar />

      <div className="mt-4 flex w-full justify-center">
        <AnnouncementDetail announcement={announcement} />
      </div>

      <BottomNavbar />
    </div>
  );
};

export default AnnouncementDetailPage;
