import { BellIcon } from "lucide-react";
import Button from "../Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/trpc/react";
import Avatar from "../Avatar";
import AnnouncementPriorityBadge from "./AnnouncementPriorityBadge";
import { useRouter } from "next/navigation";

const RequestAnnouncementDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: announcemets } = api.announcement.getPendingRequest.useQuery();
  const router = useRouter();

  return (
    <div>
      <Button
        className="relative flex rounded-full p-2"
        onClick={() => setShowDropdown((s) => !s)}
      >
        <BellIcon strokeWidth={1.2} />
        {announcemets && !!announcemets.length && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {announcemets.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 z-10 mt-2 flex-col gap-2 rounded-xl border bg-white py-4 transition-all"
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex w-[320px] flex-col">
              {announcemets &&
                announcemets.map((announcement) => (
                  <div
                    className="cursor-pointer px-6 py-2 transition-all hover:bg-slate-100"
                    onClick={() =>
                      router.push(`/editor/preview/${announcement.id}`)
                    }
                  >
                    <div className="flex justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          alt="User Profile Picture"
                          className="h-8 w-8"
                          src={announcement.author.image}
                        />

                        <span>{announcement.author.username}</span>
                      </div>
                      <AnnouncementPriorityBadge
                        priority={announcement.priority}
                        className="flex items-center justify-center p-1 px-3 text-xs"
                      />
                    </div>

                    <p className="mt-2 line-clamp-2 text-[#3F3F3F]">
                      {announcement.title}
                    </p>
                  </div>
                ))}
              {announcemets && !announcemets.length && (
                <div className="flex w-full justify-center">
                  <p className="text-gray-500">
                    Belum ada permintaan persetujuan.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestAnnouncementDropdown;
