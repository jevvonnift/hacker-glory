"use client";

import { PlusIcon, ScrollIcon } from "lucide-react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import useSession from "~/hooks/useSession";
import { DEFAULT_ANNOUNCEMENT_BODY } from "~/lib/utils";
import { api } from "~/trpc/react";

const BottomNavbar = () => {
  const { session } = useSession();
  const { mutate: createAnnouncement, isLoading: isLoadingCreateAnnouncement } =
    api.announcement.create.useMutation();

  const onCreateAnnouncement = () => {
    if (!session) return;

    createAnnouncement(
      {
        title: "Judul Pengumuman",
        body: "[]",
        categoryId: 1,
        isAccepted: session.user.isAdmin,
        isDraft: true,
        priority: "BIASA",
        sourceType: "IMAGE",
        sourceURL: "",
        publishedAt: null,
      },
      {
        onSuccess: (data) => {
          window.location.href = `/editor/${data.id}`;
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return session && session.user.role.name !== "SISWA" ? (
    <>
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2">
          <Button className="flex overflow-hidden rounded-full p-3 sm:px-3 ">
            <ScrollIcon className="sm:mr-2" strokeWidth={1.2} />
            <span className="hidden sm:block">Pengumuman Saya</span>
          </Button>
          <Button
            onClick={onCreateAnnouncement}
            disabled={isLoadingCreateAnnouncement}
            className="flex rounded-full p-3 sm:px-3"
          >
            <PlusIcon className="sm:mr-2" strokeWidth={1.2} />
            <span className="hidden sm:block">Buat Pengumuman</span>
          </Button>
        </div>
      </div>
    </>
  ) : null;
};

export default BottomNavbar;
