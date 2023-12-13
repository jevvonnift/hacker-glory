"use client";

import { BrushIcon, PencilIcon, PlusIcon, ScrollIcon } from "lucide-react";
import Link from "next/link";
import { useBoolean } from "usehooks-ts";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import useSession from "~/hooks/useSession";

const BottomNavbar = () => {
  const {
    value: showModal,
    setTrue: showModalTrue,
    setFalse: showModalFalse,
  } = useBoolean(false);
  const { session } = useSession();

  return session && session.user.role.name !== "SISWA" ? (
    <>
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2">
          <Button className="flex overflow-hidden rounded-full p-3 sm:px-3 ">
            <ScrollIcon className="sm:mr-2" strokeWidth={1.2} />
            <span className="hidden sm:block">Pengumuman Saya</span>
          </Button>
          <Button
            className="flex rounded-full p-3 sm:px-3"
            onClick={showModalTrue}
          >
            <PlusIcon className="sm:mr-2" strokeWidth={1.2} />
            <span className="hidden sm:block">Buat Pengumuman</span>
          </Button>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={showModalFalse}>
        <div className="w-full text-center">
          <h2 className="text-xl">Buat Pengumuman</h2>
        </div>
        <div className="mt-3 flex gap-2">
          <Link href="/editor/new?type=article">
            <Button className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-4">
              <span className="text-xl">Artikel</span>
              <PencilIcon strokeWidth={1.2} size={50} />
            </Button>
          </Link>
          <Link href="/editor/new?type=board">
            <Button className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-4">
              <span className="text-xl">Mading</span>
              <BrushIcon strokeWidth={1.2} size={50} />
            </Button>
          </Link>
        </div>
      </Modal>
    </>
  ) : null;
};

export default BottomNavbar;
